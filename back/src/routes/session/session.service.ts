import crypto from "crypto";
import HttpException from "../../models/HttpException";
import fs from "fs";
import path from "path";
import { generateToken } from "../../util/crypt";
import { parseUser } from "../../util/parser";
import Reotem from "~/util/functions";

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");

export const getSession = async (token: string) => {
    if (!token) {
        throw new HttpException(422, { token: "can't be blank" });
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    let session = await Reotem.getSession(token);
    let user = await Reotem.getUser(session?.id) || DB.users[DB.sessions[token]];
    if (user == undefined) throw new HttpException(404);

    user = parseUser(user as never) as never;

    console.log(user)

    return { ...user };
};

export const createSession = async (mail: string, hash: string) => {
    if (!mail) {
        throw new HttpException(422, { mail: "can't be blank" });
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    let id = -1;
    // find id with mail
    Object.values(DB.users as { [key: string]: string | number | unknown }[]).forEach((u) => {
        if ((u.email as string).toLowerCase() == mail.toLowerCase()) {
            id = u.id as number;
        }
    });

    if (id == -1) {
        throw new HttpException(400);
    }
    const user = await Reotem.getUserByMail(mail) || DB.users[id];

    if (!hash) {
        const challenge = generateToken(24);
        const password = user.password.split('$');

        const salt = '$' + password[1] + '$' + password[2] + '$' + password[3].slice(0, 22);
        user.challenge = challenge;

        DB.users[user.id] = user;
        fs.writeFileSync(DB_PATH, JSON.stringify(DB));

        return { challenge: challenge, salt: salt };
    }

    if (hash && user.challenge) {
        const hash_server = crypto.createHash("sha256").update(user.challenge + user.password).digest("hex");

        if (hash == hash_server) {
            const sessionid = generateToken(24);

            // deleting old session
            Object.keys(DB.sessions).forEach(s => {
                if (DB.sessions[s] == user.id) {
                    delete DB.sessions[s];
                    Reotem.deleteSession(user.id);
                }
            });

            DB.sessions[sessionid] = id;
            Reotem.addSession({ id: user.id, token: sessionid });

            delete user.challenge;
            DB.users[id] = user;
            fs.writeFileSync(DB_PATH, JSON.stringify(DB));

            return { sessionid: sessionid };
        }
    }

    throw new HttpException(401, { error: "invalid credentials" });
};

export const deleteSession = (id: number, session: string) => {
    if (isNaN(id)) {
        throw new HttpException(422, { id: ["can't be blank"] });
    }

    if (!session) {
        throw new HttpException(422, { session: ["can't be blank"] });
    }

    // session must match the id in DB.sessions
    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    if (DB.sessions[session] != id) return false;

    delete DB.sessions[session];
    Reotem.deleteSession(id);
    fs.writeFileSync(DB_PATH, JSON.stringify(DB));
    return true;
};
