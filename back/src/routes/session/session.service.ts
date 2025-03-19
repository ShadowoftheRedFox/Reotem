import crypto from "crypto";
import HttpException from "../../models/HttpException";
import fs from "fs";
import path from "path";
import { generateToken } from "../../util/crypt";
import { parseUser } from "../../util/parser";

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");

export const getSession = (id: string) => {
    if (!id) {
        throw new HttpException(422, { errors: { id: ["can't be blank"] } });
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    let user = DB.users[DB.sessions[id]];
    if (user == undefined) throw new HttpException(404);

    user = parseUser(user);

    return { ...user };
};

export const createSession = (mail: string, hash: string) => {
    if (!mail) {
        throw new HttpException(422, { errors: { mail: ["can't be blank"] } });
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    let id = -1;
    // find id with mail
    Object.values(DB.users as { [key: string]: string | number | unknown }[]).forEach((u) => {
        if ((u.email as string).toLowerCase() == mail.toLowerCase()) {
            id = u._id as number;
        }
    });

    if (id == -1) {
        throw new HttpException(400);
    }
    const user = DB.users[id];

    if (!hash) {
        const challenge = generateToken(24);
        const password = user.password.split('$');

        const salt = '$' + password[1] + '$' + password[2] + '$' + password[3].slice(0, 22);
        user.challenge = challenge;

        DB.users[user._id] = user;
        fs.writeFileSync(DB_PATH, JSON.stringify(DB));

        return { challenge: challenge, salt: salt };
    }

    if (hash && user.challenge) {
        const hash_server = crypto.createHash("sha256").update(user.challenge + user.password).digest("hex");

        if (hash == hash_server) {
            const session_id = generateToken(24);

            // deleting old session
            Object.keys(DB.sessions).forEach(s => {
                if (DB.sessions[s] == user._id) {
                    delete DB.sessions[s];
                }
            });

            DB.sessions[session_id] = id;

            delete user.challenge;
            DB.users[id] = user;
            fs.writeFileSync(DB_PATH, JSON.stringify(DB));

            return { session_id: session_id };
        }
    }

    throw new HttpException(401, { error: "invalid credentials" });
};

export const deleteSession = (id: number, session: string) => {
    if (isNaN(id)) {
        throw new HttpException(422, { errors: { id: ["can't be blank"] } });
    }

    if (!session) {
        throw new HttpException(422, { errors: { session: ["can't be blank"] } });
    }

    // session must match the id in DB.sessions
    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    if (DB.sessions[session] != id) return false;

    delete DB.sessions[session];
    fs.writeFileSync(DB_PATH, JSON.stringify(DB));
    return true;
};
