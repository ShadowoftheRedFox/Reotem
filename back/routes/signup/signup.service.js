const bcrypt = require("bcryptjs")
const HttpException = require("../../models/HttpException").default;
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "..", "db.json");

const generateToken = (id) => {
    return `${id}_token_todo`; // TODO
}

const checkUserUniqueness = async (email, username) => {
    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    DB.users.forEach(user => {
        if (user.email == email) {
            throw new HttpException(422, {
                errors: {
                    email: ['has already been taken'],
                },
            });
        }
        if (user.username == username) {
            throw new HttpException(422, {
                errors: {
                    username: ['has already been taken'],
                },
            });
        }
    });
};

const createUser = async (input) => {
    console.log(input);
    const email = input.email?.trim();
    const username = input.username?.trim();
    const password = input.password?.trim();

    if (!email) {
        throw new HttpException(422, { errors: { email: ["can't be blank"] } });
    }

    if (!username) {
        throw new HttpException(422, { errors: { username: ["can't be blank"] } });
    }

    if (!password) {
        throw new HttpException(422, { errors: { password: ["can't be blank"] } });
    }

    await checkUserUniqueness(email, username);

    const hashedPassword = await bcrypt.hash(password, 10);

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const user = {
        _id: DB.users.length,
        first_name: username,
        last_name: username,
        login: email,
        password: hashedPassword,
    };

    DB.users.push(user);
    fs.writeFileSync(DB_PATH, JSON.stringify(DB));

    delete user.password;

    return {
        ...user,
        token: generateToken(user._id),
    };
};

const loginUser = async (userPayload) => {
    const email = userPayload.email?.trim();
    const password = userPayload.password?.trim();

    if (!email) {
        throw new HttpException(422, { errors: { email: ["can't be blank"] } });
    }

    if (!password) {
        throw new HttpException(422, { errors: { password: ["can't be blank"] } });
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const user = DB.users.find(u => u.email = email);

    if (user) {
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            return {
                first_name: user.first_name,
                last_name: user.last_name,
                login: user.login,
                token: generateToken(user._id),
            };
        }
    }

    throw new HttpException(403, {
        errors: {
            'email or password': ['is invalid'],
        },
    });
};

const getCurrentUser = async (id) => {
    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const user = DB.users.find(u => u._id = id);

    if (!user) return {};

    delete user.password;

    return {
        ...user,
        token: generateToken(user._id),
    };
};

const updateUser = async (userPayload, id) => {
    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const user = DB.users.find(u => u._id = id);

    if (!user) return {};

    const { email, first_name, last_name, password } = userPayload;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    if (email) {
        user.login = email;
    }

    if (first_name) {
        user.first_name = first_name;
    }

    if (last_name) {
        user.last_name = last_name;
    }

    delete user.password;

    DB.users[user._id] = user;
    fs.writeFileSync(DB_PATH, JSON.stringify(DB));

    return {
        ...user,
        token: generateToken(user._id),
    };
};

module.exports = { loginUser, createUser, updateUser, getCurrentUser };