import { readFileSync } from "fs";
import path from "path";
import HttpException from "~/models/HttpException";
import Reotem from "~/util/functions";
import { Notification, NotificationQuery, UserRole } from "../../../../front/src/models/api.model"

const DB_PATH = path.join(__dirname, "..", "..", "..", "db.json");


export const getNotificationAmount = async (id: number, session: string) => {
    if (id < 0 || !session) {
        throw new HttpException(400);
    }

    const currentSession = await Reotem.getSession(session);
    // TODO Reotem.getSession(session:string) -> user.id | undefined
    if (currentSession?.id != id) {
        throw new HttpException(401);
    }

    // TODO Reotem.user.getNotifications(id:number) -> number
    const userNotications = await Reotem.getNotifications(id);
    let amount = 0;
    if (userNotications != undefined) {
        userNotications.notifications.forEach(notif => {
            if (!notif.read) amount++;
        });
    } else {
        const notifications = {
            id: id,
            notifications: []
        };
        await Reotem.addNotifications(notifications)
    }

    return { amount: amount };
};

export const getNotificationQuery = async (id: number, session: string, query?: NotificationQuery): Promise<Notification[]> => {
    if (id < 0 || !session) {
        throw new HttpException(400);
    }

    const currentSession = await Reotem.getSession(session);
    // TODO Reotem.getSession(session:string) -> user.id | undefined
    if (currentSession?.id != id) {
        throw new HttpException(401);
    }

    const userNotif = await Reotem.getNotifications(id);
    console.log(query)
    if (query === undefined) {
        return userNotif?.notifications as Notification[];
    }

    let queryNotifs: Notification[] = [];
    if (query.id) {
        userNotif?.notifications.forEach(notif => {
            if (notif.id === query.id) {
                queryNotifs.push(notif as Notification);
            }
        });
        return queryNotifs;
    }

    if (query.read) {
        userNotif?.notifications.forEach(notif => {
            if (notif.read === query.read) {
                queryNotifs.push(notif as Notification);
            }
        });
    }

    if (query.limit) {
        if (queryNotifs.length === 0) {
            queryNotifs = userNotif?.notifications as Notification[];
        }
        queryNotifs = queryNotifs.splice((query.step || 0) * query.limit, query.limit);
    }
    // TODO follow query
    return queryNotifs;
}

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