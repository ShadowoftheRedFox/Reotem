const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const HttpException = require("../../models/HttpException");
const fs = require("fs");
const path = require("path");
const { generateToken } = require("../../util/crypt");
const { parseUser } = require("../../util/parser");

const DB_PATH = path.join(__dirname, "..", "..", "db.json");

const getSession = (id) => {
    if (!id) {
        throw new HttpException(422, { errors: { id: ["can't be blank"] } });
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    let user = DB.users[DB.sessions[id]];
    if (user == undefined) throw new HttpException(404);

    user = parseUser(user);

    return { ...user };
};

const createSession = (mail, hash) => {
    if (!mail) {
        throw new HttpException(422, { errors: { mail: ["can't be blank"] } });
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    let id = -1
    // find id with mail
    Object.values(DB.users).forEach(u => {
        if (u.email.toLowerCase() == mail.toLowerCase()) {
            id = u._id;
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

const deleteSession = (id, session) => {
    if (!id) {
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

module.exports = { createSession, getSession, deleteSession };