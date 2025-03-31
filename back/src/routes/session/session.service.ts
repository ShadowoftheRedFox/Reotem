import crypto from "crypto";
import HttpException from "../../models/HttpException";
import { generateToken } from "../../util/crypt";
import { parseUser } from "../../util/parser";
import Reotem from "~/util/functions";
import { UserSchema } from "~/models/user";
import { User } from "../../../../front/src/models/api.model";


export const getSession = async (token: string) => {
    if (!token) {
        throw new HttpException(422, { token: "can't be blank" });
    }

    const session = await Reotem.getSession(token);
    let user: Partial<User> = (await Reotem.getUser(session?.id)) as Partial<User>;
    if (user == undefined) throw new HttpException(404);

    user = parseUser(user as never, true);

    return { ...user };
};

export const createSession = async (mail: string, hash: string) => {
    if (!mail) {
        throw new HttpException(422, { mail: "can't be blank" });
    }

    const user = (await Reotem.getUserByMail(mail)) as UserSchema;

    if (user == undefined) {
        throw new HttpException(401, { error: "invalid credentials" });
    }

    if (!hash) {
        const challenge = generateToken(24);
        const password = user.password.split('$');

        const salt = '$' + password[1] + '$' + password[2] + '$' + password[3].slice(0, 22);
        user.challenge = challenge;

        await Reotem.updateUser(user._id, { challenge: challenge })

        return { challenge: challenge, salt: salt };
    }

    if (hash && user.challenge) {
        const hash_server = crypto.createHash("sha256").update(user.challenge + user.password).digest("hex");

        if (hash == hash_server) {
            const sessionid = generateToken(24);


            await Reotem.deleteSession(user._id);
            await Reotem.addSession({ _id: user._id, token: sessionid });
            await Reotem.updateUser(user._id, { challenge: undefined })

            return { sessionid: sessionid };
        }
    }

    throw new HttpException(401, { error: "invalid credentials" });
};

export const deleteSession = async (id: string, session: string) => {
    if (id === "") {
        throw new HttpException(422, { id: ["can't be blank"] });
    }

    if (!session) {
        throw new HttpException(422, { session: ["can't be blank"] });
    }

    await Reotem.deleteSession(id);
    return true;
};
