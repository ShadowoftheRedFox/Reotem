import { Notification, NotificationQuery } from "../../../../../front/src/models/api.model"
import HttpException from "~/models/HttpException";
import Reotem from "~/util/functions";

export const getNotificationAmount = async (id: number, session: string) => {
    if (id < 0 || !session) {
        throw new HttpException(400);
    }

    const currentSession = await Reotem.getSession(session);
    if (currentSession?.id != id) {
        throw new HttpException(401);
    }

    // await Reotem.deleteNotification(0, 0);
    // await Reotem.addNotification(0, { id: 0, title: "Test", message: "Ploof?" });

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
    if (currentSession?.id != id) {
        throw new HttpException(401);
    }

    const userNotif = await Reotem.getNotifications(id);
    if (query === undefined) {
        return userNotif?.notifications || [];
    }

    let queryNotifs: Notification[] = [];
    if (query.id) {
        userNotif?.notifications.forEach(notif => {
            if (notif.id === query.id) {
                queryNotifs.push(notif);
            }
        });
        return queryNotifs;
    }

    if (query.read) {
        userNotif?.notifications.forEach(notif => {
            if (notif.read === query.read) {
                queryNotifs.push(notif);
            }
        });
    }

    if (query.limit) {
        if (queryNotifs.length === 0 && userNotif) {
            queryNotifs = userNotif.notifications;
        }
        queryNotifs = queryNotifs.splice((query.step || 0) * query.limit, query.limit);
    }
    return queryNotifs;
}

export const setNotificationRead = async (ids: number[], session: string) => {
    if (!Array.isArray(ids) || ids.length == 0) {
        throw new HttpException(422, { ids: "empty" });
    }

    const currentSession = await Reotem.getSession(session);
    if (currentSession == undefined || currentSession.id === undefined) {
        throw new HttpException(401);
    }

    const userNotifications = (await Reotem.getNotification(currentSession.id, {}))?.notifications;
    if (userNotifications == undefined) {
        throw new HttpException(400);
    }

    userNotifications.forEach(n => {
        if (ids.includes(n.id)) {
            n.read = true;
        }
    });

    await Reotem.updateNotifications(currentSession.id, {
        id: currentSession.id,
        notifications: userNotifications
    });
}

export const setNotificationUnread = async (ids: number[], session: string) => {
    if (!Array.isArray(ids) || ids.length == 0) {
        throw new HttpException(422);
    }

    const currentSession = await Reotem.getSession(session);
    if (currentSession == undefined || currentSession.id === undefined) {
        throw new HttpException(401);
    }

    const userNotifications = (await Reotem.getNotification(currentSession.id, {}))?.notifications;
    if (userNotifications == undefined) {
        throw new HttpException(400);
    }

    userNotifications.forEach(n => {
        if (ids.includes(n.id)) {
            n.read = false;
        }
    });

    await Reotem.updateNotifications(currentSession.id, {
        id: currentSession.id,
        notifications: userNotifications
    });
}
export const deletingNotification = async (ids: number[], session: string) => {
    if (!Array.isArray(ids) || ids.length == 0) {
        throw new HttpException(422);
    }

    const currentSession = await Reotem.getSession(session);
    if (currentSession == undefined || currentSession.id === undefined) {
        throw new HttpException(401);
    }

    ids.forEach(async (i) => {
        await Reotem.deleteNotification(currentSession.id, i);
    });
}