import bcrypt from "bcryptjs";
import HttpException from "../../models/HttpException";
import fs from "fs";
import path from "path";
import { UserMaxAge, UserMinAge, UserSchema } from "../../models/user";
import { generateToken } from "../../util/crypt";
import { parseUser } from "../../util/parser";
import { sendMail, template } from "../../util/mailer";
import Reotem from "../../util/functions";
import { User, UserRole, UserSexe } from "../../../../front/src/models/api.model";

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");

const checkUserUniqueness = async (email: string) => {
    // TODO Reotem.checkUserUnique -> boolean
    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    Object.values(DB.users as { [key: string]: unknown }[]).forEach((user) => {
        if ((user.email as string).toLowerCase() == email.toLowerCase()) {
            throw new HttpException(422, { email: 'has already been taken', });
        }
    });
};

export const createUser = async (input: { [key: string]: string | number }) => {
    const firstname = input.firstname + '';
    const lastname = input.lastname + '';
    const email = input.email + '';
    const age = Number(input.age);
    const role = input.role as UserRole;
    const sexe = input.sexe as UserSexe;
    const password = input.password + '';

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
    let user: Partial<User> = {
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
    DB.users[user.id as number] = user;
    DB.validating[user.validated as string] = user.id;
    fs.writeFileSync(DB_PATH, JSON.stringify(DB));

    await Reotem.addUser(user);
    await Reotem.addSession({ id: user.id, token: sessionid });


    user = parseUser(user as never);

    const username = user.firstname + " " + user.lastname;

    // send the mail with the link to validate
    sendMail(user.email as string, "Vérification de votre adresse mail", `À l'attention de ${username}`, template.validate(username, user.validated as string), username);

    return { user: user, session: sessionid };
};

export const getCurrentUser = async (id: number) => {
    let user = await Reotem.getUser(id) as Partial<UserSchema>;

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

    // TODO Reotem.validate(token) -> boolean
    const user = DB.users[DB.validating[token]];

    delete user.validated;
    delete DB.validating[token];

    DB.users[user.id] = user;
    fs.writeFileSync(DB_PATH, JSON.stringify(DB));

    return true;
};

export const checkTokenExists = async (token: string) => {
    if (!token) throw new HttpException(404);

    // TODO Reotem.tokenExists(token) -> boolean

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    if (DB.validating[token] == undefined) throw new HttpException(404);
    return true;
};
