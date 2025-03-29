import { readFileSync, writeFileSync } from "fs";
import path from "path";
import HttpException from "~/models/HttpException";
import Reotem from "~/util/functions";
import { UserRole } from "../../../../front/src/models/api.model"
import { parseUser } from "~/util/parser";

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");
const PUBLIC_PATH = path.join(__dirname, "..", "..", "..", "public/");


export const checkUserRole = async (role: UserRole, session: string) => {
    if (!role || !session) {
        throw new HttpException(404);
    }

    if (!UserRole.includes(role)) {
        throw new HttpException(400, { role: "unknown" });
    }

    // TODO Reotem.getSession(session:string) -> user.id | undefined
    const DB = JSON.parse(readFileSync(DB_PATH, 'utf8'));
    if (DB.sessions[session] == undefined) {
        throw new HttpException(401);
    }

    return DB.users[DB.sessions[session]].role == role;
}

export const getUser = async (id: number, session: string = '') => {
    if (id < 0) {
        throw new HttpException(400);
    }

    const user = await Reotem.getUser(id);
    const userSession = await Reotem.getSession(session);

    if (user == undefined) {
        throw new HttpException(404);
    }

    return parseUser(user, user.id === userSession?.id);
};

export const postImage = async (id: number, base64: string, session: string) => {
    if (id < 0) {
        throw new HttpException(400);
    }

    const user = await Reotem.getUser(id);

    if (user == undefined) {
        throw new HttpException(404);
    }

    const DB = JSON.parse(readFileSync(DB_PATH, 'utf8'));
    if (DB.sessions[session] != user.id) {
        throw new HttpException(401);
    }

    // Captured img [base64 string]
    console.log(base64)

    // Convert base64 --> img.jpeg
    const buffer = Buffer.from(base64, 'base64');
    console.log(buffer)

    const imgName = id + '.jpeg';

    // save image under the account id
    writeFileSync(PUBLIC_PATH + imgName, buffer)

    return imgName;
}