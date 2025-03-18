const bcrypt = require("bcryptjs");
const HttpException = require("../../models/HttpException");
const fs = require("fs");
const path = require("path");
const { UserModel, UserMaxAge, UserMinAge, UserRole, UserSexe } = require("../../models/user");
const { generateToken } = require("../../util/crypt");
const { parseUser } = require("../../util/parser");
const { sendMail, template } = require("../../util/mailer");

const DB_PATH = path.join(__dirname, "..", "..", "db.json");

const checkUserUniqueness = async (email, firstname, lastname) => {
    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    Object.values(DB.users).forEach(user => {
        if (user.email.toLowerCase() == email.toLowerCase()) {
            throw new HttpException(422, {
                errors: {
                    email: ['has already been taken'],
                },
            });
        }
        if (user.firstname.toLowerCase() == firstname.toLowerCase() && user.lastname.toLowerCase() == lastname.toLowerCase()) {
            throw new HttpException(422, {
                errors: {
                    name: ['has already been taken'],
                },
            });
        }
    });
};

const createUser = async (input) => {
    const firstname = input.firstname;
    const lastname = input.lastname;
    const email = input.email;
    const age = input.age;
    const role = input.role;
    const sexe = input.sexe;
    const password = input.password;

    if (!email) {
        throw new HttpException(422, { errors: { email: ["can't be blank"] } });
    }

    if (!firstname) {
        throw new HttpException(422, { errors: { firstname: ["can't be blank"] } });
    }

    if (!lastname) {
        throw new HttpException(422, { errors: { lastname: ["can't be blank"] } });
    }

    if (!password) {
        throw new HttpException(422, { errors: { password: ["can't be blank"] } });
    }

    if (!age) {
        throw new HttpException(422, { errors: { age: ["can't be blank"] } });
    }
    if (age < UserMinAge || age > UserMaxAge) {
        throw new HttpException(422, { errors: { age: ["invalid"] } });
    }

    if (!role) {
        throw new HttpException(422, { errors: { role: ["can't be blank"] } });
    }
    if (!UserRole.includes(role)) {
        throw new HttpException(422, { errors: { role: ["invalid"] } });
    }

    if (!sexe) {
        throw new HttpException(422, { errors: { sexe: ["can't be blank"] } });
    }
    if (!UserSexe.includes(sexe)) {
        throw new HttpException(422, { errors: { sexe: ["invalid"] } });
    }

    await checkUserUniqueness(email, firstname, lastname);

    const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    let user = {
        _id: Object.keys(DB.users).length,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPassword,
        age: age,
        role: role,
        sexe: sexe,
        validated: generateToken(64)
    };

    const session_id = generateToken(24);

    DB.sessions[session_id] = user._id;
    DB.users[user._id] = user;
    DB.validating[user.validated] = user._id;
    fs.writeFileSync(DB_PATH, JSON.stringify(DB));

    user = parseUser(user);

    const username = user.firstname + " " + user.lastname;

    // send the mail with the link to validate
    // TEST if it works
    sendMail(user.email, "Vérification de votre adresse mail", `À l'attention de ${username}`, template.validate(username, user.validated), username);

    return { user: user, session: session_id };
};

const getCurrentUser = async (id) => {
    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const user = DB.users[id];

    if (!user) return {};

    user = parseUser(user);

    return {
        ...user,
        token: generateToken(user._id),
    };
};

const validateUser = async (token, session) => {
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

    DB.users[user._id] = user;
    fs.writeFileSync(DB_PATH, JSON.stringify(DB));

    return true;
};

const checkTokenExists = async (token) => {
    if (!token) throw new HttpException(404);

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    if (DB.validating[token] == undefined) throw new HttpException(404);
    return true;
};

module.exports = { validateUser, createUser, getCurrentUser, checkTokenExists };