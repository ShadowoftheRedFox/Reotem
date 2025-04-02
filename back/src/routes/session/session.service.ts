import crypto from "crypto";
import bcrypt from "bcryptjs";
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

export const createSession = async (email: string, hash?: string) => {
    if (!email) {
        throw new HttpException(422, { mail: "can't be blank" });
    }

    const user = (await Reotem.getUserByMail(email)) as UserSchema;

    if (user == undefined && !hash) {
        // instead of doing that, pretend it's ok and send a wrong tokens
        // throw new HttpException(401, { error: "invalid credentials" });

        // now, it well send back fake tokens, and will fail through
        // the 401 case below (hash && user.challeng will be false)
        // it now have the same pattern if the user doesn't exists, to prevent
        // anyone from guessing this user exists or not
        const challenge = generateToken(24);
        const fakePassword = generateToken(64);
        const password = (await bcrypt.hash(fakePassword, bcrypt.genSaltSync(10))).split('$');

        const salt = '$' + password[1] + '$' + password[2] + '$' + password[3].slice(0, 22);

        console.log("Fake challenge fallthrough");

        return { challenge: challenge, salt: salt };
    }

    if (!hash) {
        const challenge = generateToken(24);
        const password = user.password.split('$');

        const salt = '$' + password[1] + '$' + password[2] + '$' + password[3].slice(0, 22);
        user.challenge = challenge;

        await Reotem.updateUser(user.id, { challenge: challenge })

        return { challenge: challenge, salt: salt };
    }

    if (hash && user && user.challenge) {
        console.log("Verifying challenge anwser")

        const hash_server = crypto.createHash("sha256").update(user.challenge + user.password).digest("hex");

        if (hash == hash_server) {
            const sessionid = generateToken(24);


            await Reotem.deleteSession(user.id);
            await Reotem.addSession({ id: user.id, token: sessionid });
            await Reotem.updateUser(user.id, { challenge: undefined, lastLogin: `${new Date(Date.now()).toISOString()}` })

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
