import { readFileSync } from "fs";
import path from "path";
import HttpException from "~/models/HttpException";
import Reotem from "~/util/functions";
import { parseUser } from "~/util/parser";

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");


export const getUser = async (id: number, session?: string) => {
    if (id < 0) {
        throw new HttpException(400);
    }

    const user = await Reotem.getUser(id);

    if (user == undefined) {
        throw new HttpException(404);
    }

    // TODO Reotem.getSession(session:string) -> user.id
    const DB = JSON.parse(readFileSync(DB_PATH, 'utf8'));
    const sensible = session != undefined && DB.sessions[session] == id;

    return parseUser(user, sensible);
};