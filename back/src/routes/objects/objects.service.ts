// import HttpException from "../../models/HttpException";
import fs from "fs";
import path from "path";
import { ObjectQuery } from "../../../../front/src/models/api.model";
import { AnyObject, SpeakerObject } from "../../../../front/src/models/domo.model";

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");

export const getAll = (query?: ObjectQuery) => {
    const DB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    const objects = Object.values(DB.objects as { [key: number]: AnyObject });

    const testObject: SpeakerObject = {
        objectClass: "SpeakerObject",
        name: "Ampoule1",
        room: "Test",
        lastInteraction: new Date().toISOString(),
        connection: "Wi-Fi",
        state: "Normal",
        id: 12,
        neededLevel: "Débutant",
        electricityUsage: 12,
        consomationThreshold: 12,
        turnedOn: true,
        battery: 90
    };
    objects.push(testObject);

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