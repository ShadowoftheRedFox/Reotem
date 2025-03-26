import bcrypt from "bcryptjs";
import HttpException from "../../models/HttpException";
import fs from "fs";
import path from "path";
import { UserMaxAge, UserMinAge, UserRole, UserSchema, UserSexe } from "../../models/user";
import { generateToken } from "../../util/crypt";
import { parseUser } from "../../util/parser";
import { sendMail, template } from "../../util/mailer";
import Reotem from "../../util/functions";

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");

const checkUserUniqueness = async (email: string) => {
    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    Object.values(DB.users as { [key: string]: unknown }[]).forEach((user) => {
        if ((user.email as string).toLowerCase() == email.toLowerCase()) {
            throw new HttpException(422, { email: 'has already been taken', });
        }
    });
};

export const createUser = async (input: { [key: string]: never }) => {
    const firstname = input.firstname as string;
    const lastname = input.lastname as string;
    const email = input.email as string;
    const age = input.age as number;
    const role = input.role as string;
    const sexe = input.sexe as string;
    const password = input.password as string;

    if (!email) {
        throw new HttpException(422, { email: "can't be blank" });
    }

    if (!firstname) {
        throw new HttpException(422, { firstname: "can't be blank" });
    }

    if (!lastname) {
        throw new HttpException(422, { lastname: "can't be blank" });
    }

    if (!password) {
        throw new HttpException(422, { password: "can't be blank" });
    }

    if (password.length < 8) {
        throw new HttpException(422, { password: "must be longer than 8 characters" });
    }

    if (!age) {
        throw new HttpException(422, { age: "can't be blank" });
    }
    if (age < UserMinAge || age > UserMaxAge) {
        throw new HttpException(422, { age: "invalid" });
    }

    if (!role) {
        throw new HttpException(422, { role: "can't be blank" });
    }
    if (!UserRole.includes(role)) {
        throw new HttpException(422, { role: "invalid" });
    }

    if (!sexe) {
        throw new HttpException(422, { sexe: "can't be blank" });
    }
    if (!UserSexe.includes(sexe)) {
        throw new HttpException(422, { sexe: "invalid" });
    }

    await checkUserUniqueness(email);

    const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    let user = {
        id: Object.keys(DB.users).length,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPassword,
        age: age,
        role: role,
        sexe: sexe,
        validated: generateToken(10),
        exp: 0,
        lvl: "Débutant"
    };

    const sessionid = generateToken(24);

    DB.sessions[sessionid] = user.id;
    DB.users[user.id] = user;
    DB.validating[user.validated] = user.id;
    fs.writeFileSync(DB_PATH, JSON.stringify(DB));

    await Reotem.addUser(user);
    await Reotem.addSession({ id: user.id, token: sessionid });


    user = parseUser(user as never) as never;

    const username = user.firstname + " " + user.lastname;

    // send the mail with the link to validate
    sendMail(user.email, "Vérification de votre adresse mail", `À l'attention de ${username}`, template.validate(username, user.validated), username);

    return { user: user, session: sessionid };
};

export const getCurrentUser = async (id: number) => {
    let user = await Reotem.getUser(id) as UserSchema | Partial<UserSchema>;

    if (!user) return {};

    user = parseUser(user as UserSchema) as Partial<UserSchema>;

    return {
        ...user,
        token: generateToken(user.id),
    };
};

export const validateUser = async (token: string, session: string) => {
    // 400 because important route, we don't want to tell what went wrong
    if (!token || !session) {
        throw new HttpException(400);
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    if (DB.validating[token] != DB.sessions[session]) {
        throw new HttpException(400);
    }

    const user = DB.users[DB.validating[token]];

    delete user.validated;
    delete DB.validating[token];

    DB.users[user.id] = user;
    fs.writeFileSync(DB_PATH, JSON.stringify(DB));

    return true;
};

export const checkTokenExists = async (token: string) => {
    if (!token) throw new HttpException(404);

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    if (DB.validating[token] == undefined) throw new HttpException(404);
    return true;
};
