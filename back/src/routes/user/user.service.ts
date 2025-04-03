import path from "path";
import HttpException from "~/models/HttpException";
import Reotem from "~/util/functions";
import { User, UserRole } from "../../../../front/src/models/api.model";
import { parseUser } from "~/util/parser";
import { UserSchema } from "~/models/user";
import { generateToken } from "~/util/crypt";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { SessionSchema } from "~/models/session";
import { sendMail, template } from "~/util/mailer";
import sharp from "sharp";

const PUBLIC_PATH = path.join(__dirname, "..", "..", "..", "public/");

export const checkUserRole = async (role: UserRole, session: string) => {
    if (!role || !session) {
        throw new HttpException(404);
    }

    if (!UserRole.includes(role)) {
        throw new HttpException(400, { role: "unknown" });
    }

    const userId = (await Reotem.getSession(session))?.id.toString();

    if (userId === undefined || userId === "") {
        throw new HttpException(401);
    }

    const userRole = (await Reotem.getUser(userId))?.role;

    return userRole == role;
};

export const getUser = async (id: string, session: string = "") => {
    if (id === "") {
        throw new HttpException(400);
    }

    const user = await Reotem.getUser(id);
    const userSession = await Reotem.getSession(session);

    if (user == undefined) {
        throw new HttpException(404);
    }

    //TODO TO DELETE IF ALL USERS HAVE ISO DATE FORMAT (Users Remaining: Ploof and Admin [if admin has age])
    if (!isNaN(parseInt(user.age)) && parseInt(user.age) < 120) {
        user.age = `${new Date().getFullYear() - parseInt(user.age)}-01-01T00:00:01.972Z`;
        await Reotem.updateUser(user.id, user);
    }

    // await Reotem.addNotification(user.id, { message: "Message de test pour l'affichage", title: "Test", read: false });

    return parseUser(user, user.id === userSession?.id);
};

export const postImage = async (id: string, base64: string, session: string) => {
    if (id === "") {
        throw new HttpException(400);
    }

    const user = await Reotem.getUser(id);

    if (user == undefined) {
        throw new HttpException(404);
    }

    const currentSession = await Reotem.getSession(session);
    if (currentSession?.id != user.id) {
        throw new HttpException(401);
    }


    // Convert base64 --> img.webp
    const buffer = Buffer.from(base64, "base64");

    const imgName = id + ".webp";

    // compress image (reduce quality and fix size) and save it
    await sharp(buffer).webp({ quality: 70 }).toFile(PUBLIC_PATH + imgName);

    return imgName;
};

export const updateUser = async (id: string, session: string, updatedUser: Partial<User>) => {
    if (id === "") {
        throw new HttpException(400);
    }

    const user = await Reotem.getUser(id);

    if (user == undefined) {
        throw new HttpException(404);
    }

    const currentSession = await Reotem.getSession(session);
    const adminUser = await Reotem.getUser(currentSession?.id);

    // if session user is an admin
    const sessionUserIsAdmin = (adminUser?.role as UserRole) === "Administrator";
    const userIsOwnAdmin = currentSession?.id == user.id && sessionUserIsAdmin;

    if (currentSession?.id != user.id && !sessionUserIsAdmin) {
        throw new HttpException(401);
    }

    if (!sessionUserIsAdmin) {
        // fields user can't update but admin can
        delete updatedUser.exp;
        delete updatedUser.lvl;
        delete updatedUser.role;
        delete updatedUser.validated;
        delete updatedUser.adminValidated;
    }
    if (sessionUserIsAdmin && !userIsOwnAdmin) {
        // fields admin can't change but user can
        delete updatedUser.sexe;
        delete updatedUser.age;
    }
    // fields no one can update
    delete updatedUser.id;
    delete updatedUser.lastLogin;
    delete updatedUser.validated;
    // specific route required
    delete updatedUser.password;
    delete updatedUser.email;

    await Reotem.updateUser(id, updatedUser as Partial<UserSchema>);

    return true;
}

export const updateUserPassword = async (id: string, session: string, hash?: string, password?: string) => {
    // need to always have the same pattern as session:
    // if something is invalid, do as it is but create a fake token

    if (!session) {
        throw new HttpException(422, { session: "can't be blank" });
    }
    if (hash && !password) {
        throw new HttpException(422, { password: "can't be blank" });
    }

    const user = (await Reotem.getUser(id)) as UserSchema;
    const currentSession = (await Reotem.getSession(session)) as SessionSchema;

    if (
        (
            user == undefined ||
            currentSession.id == undefined ||
            user.id != currentSession.id
        ) &&
        !hash
    ) {
        // same logic as the session
        const challenge = generateToken(24);
        const fakePassword = generateToken(64);
        const password = (await bcrypt.hash(fakePassword, bcrypt.genSaltSync(10))).split('$');

        const salt = '$' + password[1] + '$' + password[2] + '$' + password[3].slice(0, 22);

        console.log("Fake challenge fallthrough (email update)");

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
        console.log("Verifying challenge anwser (email update)")

        const hash_server = crypto.createHash("sha256").update(user.challenge + user.password).digest("hex");

        if (hash == hash_server) {
            const username = user.firstname + ' ' + user.lastname;
            const hashedPassword = await bcrypt.hash(password as string, bcrypt.genSaltSync(10));

            await Reotem.updateUser(id, { password: hashedPassword });
            (await Reotem.getUsers())?.map(async user => {
                if (user.role === "Administrator") await Reotem.addNotification(user.id, { title: "Un utilisateur a changé son mot de passe", message: `L'utilisateur ${user.id} a changé son mot de passe.`, read: false })
            })

            sendMail(user.email, "Changement de mot de passe", `À l'attention de ${username}`, template.passwordChange(username));

            return true;
        }
    }

    throw new HttpException(401, { error: "invalid credentials" });
}
export const updateUserEmail = async (id: string, session: string, hash?: string, email?: string) => {
    if (!session) {
        throw new HttpException(422, { session: "can't be blank" });
    }
    if (hash && !email) {
        throw new HttpException(422, { newEmail: "can't be blank" });
    }

    const user = (await Reotem.getUser(id)) as UserSchema;
    const currentSession = (await Reotem.getSession(session)) as SessionSchema;

    if (
        (
            user == undefined ||
            currentSession.id == undefined ||
            user.id != currentSession.id
        ) &&
        !hash
    ) {
        // same logic as the session
        const challenge = generateToken(24);
        const fakePassword = generateToken(64);
        const password = (await bcrypt.hash(fakePassword, bcrypt.genSaltSync(10))).split('$');

        const salt = '$' + password[1] + '$' + password[2] + '$' + password[3].slice(0, 22);

        console.log("Fake challenge fallthrough (email update)");

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
        console.log("Verifying challenge anwser (email update)")

        const hash_server = crypto.createHash("sha256").update(user.challenge + user.password).digest("hex");

        if (hash == hash_server) {
            // prevent from revalidating the same email
            if (user.email == email) return true;

            const token = generateToken(24);
            const username = user.firstname + ' ' + user.lastname;

            await Reotem.updateUser(id, { email: email });
            await Reotem.addVerification({ id, token: token });

            sendMail(email as string, "Vérification de votre nouvelle adresse email", `À l'attention de ${username}`, template.revalidate(username, token));

            return true;
        }
    }

    throw new HttpException(401, { error: "invalid credentials" });
}