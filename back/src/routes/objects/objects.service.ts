// import HttpException from "../../models/HttpException";
import fs from "fs";
import path from "path";
import { ObjectQuery } from "../../../../front/src/models/api.model";
import { AnyObject } from "../../../../front/src/models/domo.model";
import HttpException from "~/models/HttpException";

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");

export const getAll = (query: ObjectQuery = {}) => {
    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    const objects = Object.values(DB.objects as { [key: number]: AnyObject });

    let resultObjects = objects;

    if (query?.type) {
        resultObjects = resultObjects.filter(o => o.objectClass == query.type)
    }

    const n = resultObjects.length;

    if (query?.limit && query.limit > 0) {
        if (query.step && query.step >= 0) {
            resultObjects = resultObjects.slice(query.step * query.limit, (query.step + 1) * query.limit);
        } else {
            resultObjects = resultObjects.slice(0, query.limit);
        }
    }

    return { objects: resultObjects, total: n };
};

export const getOne = async (id: number) => {
    if (isNaN(id) || id < 0) {
        throw new HttpException(422);
    }

    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    const ids = Object.keys(DB.objects as { [key: number]: AnyObject });

    let obj = null;

    ids.forEach(i => {
        if (Number(i) == id) {
            obj = DB.objects[i];
        }
    });

    if (obj == null) {
        throw new HttpException(404);
    }

    return obj;
}