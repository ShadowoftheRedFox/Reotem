import crypto from "crypto";
import HttpException from "../../models/HttpException";
import fs from "fs";
import path from "path";
import { generateToken } from "../../util/crypt";
import { parseUser } from "../../util/parser";
import Reotem from "~/util/functions";
import { UserSchema } from "~/models/user";
import { User } from "../../../../front/src/models/api.model";

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");

export const getSession = async (token: string) => {
    if (!token) {
        throw new HttpException(422, { token: "can't be blank" });
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const session = await Reotem.getSession(token);
    let user: User = await Reotem.getUser(session?.id) || DB.users[DB.sessions[token]];
    if (user == undefined) throw new HttpException(404);

    user = parseUser(user as never, true) as never;

    return { ...user };
};

export const createSession = async (mail: string, hash: string) => {
    if (!mail) {
        throw new HttpException(422, { mail: "can't be blank" });
    }

    const user = (await Reotem.getUserByMail(mail)) as UserSchema;

    if (!hash) {
        const challenge = generateToken(24);
        const password = user.password.split('$');

        const salt = '$' + password[1] + '$' + password[2] + '$' + password[3].slice(0, 22);
        user.challenge = challenge;

        await Reotem.updateUser(user.id, { challenge: challenge } as UserSchema)

        return { challenge: challenge, salt: salt };
    }

    if (hash && user.challenge) {
        const hash_server = crypto.createHash("sha256").update(user.challenge + user.password).digest("hex");

        if (hash == hash_server) {
            const sessionid = generateToken(24);


            await Reotem.deleteSession(user.id);
            await Reotem.addSession({ id: user.id, token: sessionid });
            await Reotem.updateUser(user.id, { challenge: '' } as UserSchema)

            return { sessionid: sessionid };
        }
    }

    throw new HttpException(401, { error: "invalid credentials" });
};

export const deleteSession = async (id: number, session: string) => {
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
    await Reotem.deleteSession(id);
    fs.writeFileSync(DB_PATH, JSON.stringify(DB));
    return true;
};
