import { readFileSync } from "fs";
import path from "path";
import HttpException from "~/models/HttpException";
import { parseUser } from "~/util/parser";

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");

export const getUser = async (id: number) => {
    if (id < 0) {
        throw new HttpException(400);
    }

    const DB = JSON.parse(readFileSync(DB_PATH, 'utf8'));

    if (DB.users[id] == undefined) {
        throw new HttpException(404);
    }

    return parseUser(DB.users[id]);
};