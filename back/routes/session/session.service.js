const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const HttpException = require("../../models/HttpException").default;
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "..", "db.json");

function generateToken(n = 24) {
    if (n <= 0 || isNaN(n)) { n = 24; }
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for (var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

const getSession = (id) => {
    if (!id) {
        throw new HttpException(422, { errors: { id: ["can't be blank"] } });
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    const user = DB.users[DB.sessions[id]];
    if (user == undefined) throw new HttpException(404);

    delete user.password;

    return { ...user };
};

const createSession = (mail, hash) => {
    if (!mail) {
        throw new HttpException(422, { errors: { mail: ["can't be blank"] } });
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    let id = -1
    // find id with mail
    for (u in Object.values(DB.users)) {
        if (DB.users[u].login == mail) {
            id = DB.users[u]._id;
            break;
        }
    }

    /*
    asso_id = g.args.get('asso')
    hash_client = g.args.get('hash') # get the hash from the client if it exists
    
    if not asso_id:
        return api.error('Missing parameters')
    
    mydb = get_db() # connect to the database
    mycursor = mydb.cursor(dictionary=True)
    
    mycursor.execute("SELECT password, challenge, id FROM assos WHERE id = %s", (asso_id,))
    asso = mycursor.fetchone()
    
    if not asso:
        return api.error('Invalid asso', 400)
    */
    if (id == -1) {
        throw new HttpException(400);
    }
    const user = DB.users[id];

    /*
    if not hash_client:
        #generate  the challenge and hash it with the password to send it to the client
        challenge = secrets.token_urlsafe(24)
        password = asso['password'].split('$')

        salt= '$'+password[1]+'$'+password[2]+'$'+password[3][:22]
        
        mycursor.execute("UPDATE assos SET challenge = %s WHERE id = %s", (challenge, asso_id))

        return api.success({'challenge' : challenge,'salt' : salt}, 201)
    */

    if (!hash) {
        const challenge = generateToken(24);
        const password = user.password.split('$');

        const salt = '$' + password[1] + '$' + password[2] + '$' + password[3].slice(0, 22);
        user.challenge = challenge;

        DB.users[user._id] = user;
        fs.writeFileSync(DB_PATH, JSON.stringify(DB));

        return { challenge: challenge, salt: salt };
    }

    /*
    #check if the challenge exist and if the client send the hash of the challenge
    if hash_client and asso['challenge']:

        #hash the challenge with the password and compare it with the hash send by the client
        hash_serv = sha256((asso['challenge']+ asso['password']).encode()).hexdigest()


        if hash_client==hash_serv:
            #if the hash are the same, create a session and return the id of the session (and delete the challenge in the database)
            session_id = secrets.token_urlsafe(24)
            mycursor.execute("INSERT INTO sessions (id, asso_id) VALUES (%s, %s)", (session_id, asso['id']))
            mycursor.execute("UPDATE assos SET challenge = NULL WHERE id = %s", (asso_id,))
            return api.success({'id': session_id, 'asso_id': asso['id']}, 201)
    */

    if (hash && user.challenge) {
        const hash_server = crypto.createHash("sha256").update(user.challenge + user.password).digest("hex");

        if (hash == hash_server) {
            const session_id = generateToken(24);

            DB.sessions[session_id] = id;

            delete user.challenge;
            DB.users[id] = user;
            fs.writeFileSync(DB_PATH, JSON.stringify(DB));

            return { session_id: session_id };
        }
    }

    /* 
    return api.error('Invalid credentials', 401)
    */
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