import { readFileSync } from "fs";
import path from "path";
import HttpException from "~/models/HttpException";
import Reotem from "~/util/functions";
import { APIQuery, Notification, NotificationQuery } from "../../../../front/src/models/api.model"

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");


export const getNotificationAmount = async (id: number, session: string) => {
    if (id < 0 || !session) {
        throw new HttpException(400);
    }

    const user = await Reotem.getUser(id);

    if (user == undefined) {
        throw new HttpException(404);
    }

    // TODO Reotem.getSession(session:string) -> user.id
    const DB = JSON.parse(readFileSync(DB_PATH, 'utf8'));
    if (DB.sessions[session] != id) {
        throw new HttpException(401);
    }

    // TODO Reotem.user.getNotifications(id:number) -> number
    let amount = 0;
    if (DB.notifications[id] != undefined) {
        (DB.notifications[id] as { read: boolean, message: string }[]).forEach(notif => {
            if (!notif.read) amount++;
        });
    }

    return { amount: amount };
};

export const getNotificationQuery = async (id: number, session: string, query?: APIQuery<NotificationQuery>): Promise<Notification[]> => {
    if (id < 0 || !session) {
        throw new HttpException(400);
    }

    // TODO Reotem.getSession(session:string) -> user.id
    const DB = JSON.parse(readFileSync(DB_PATH, 'utf8'));
    if (DB.sessions[session] != id) {
        throw new HttpException(401);
    }

    if (query == undefined) {
        return DB.notifications[id];
    }

    // TODO follow query
    return DB.notifications[id];
}