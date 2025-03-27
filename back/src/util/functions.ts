import models from "../models/export_models";
import { UserSchema } from "~/models/user";
import { NotifSchema, NotificationSchema } from "~/models/notification";
import { NotificationQuery } from "../../../front/src/models/api.model";

const excludes = ['collection', '_doc', 'db', '_id', '__v', 'schema'];

const Reotem = {
  addUser: async (user: object) => {
    const merged = Object.assign(user);
    const newUser = new models.User(merged);
    await newUser
      .save()
      .then((u) => console.log(`New user -> ${u.email}`));
  },
  getUser: async (id: number) => {
    const data = await models.User.findOne({ id: id });
    if (data) return data;
    return;
  },
  getUserByMail: async (mail: string) => {
    const data = await models.User.findOne({ email: mail });
    if (data) return data;
    return;
  },
  getUsers: async () => {
    const data = await models.User.find();
    if (data) return data;
    return;
  },
  updateUser: async (query: number, updated: Partial<UserSchema>) => {
    const data = await Reotem.getUser(query);
    if (typeof data !== "object") return;
    for (const key in data) {
      if (key.startsWith('$') || typeof (data as never)[key] === typeof Function || excludes.includes(key) || (updated as never)[key] === undefined) continue;
      if ((data as never)[key] !== (updated as never)[key])
        (data as never)[key] = (updated as never)[key];
    }
    return data.updateOne(updated);
  },
  deleteUser: async (id: number) => {
    const data = await models.User.findOne({ id: id });
    if (data) return data.deleteOne();
    return;
  },

  addSession: async (session: object) => {
    const merged = Object.assign(session);
    const newSession = new models.Session(merged);
    await newSession
      .save()
      .then((u) => console.log(`New session for user -> ${u.id}`));
  },
  getSession: async (token: string) => {
    const data = await models.Session.findOne({ token: token });
    if (data) return data;
    return;
  },
  getSessions: async () => {
    const data = await models.Session.find();
    if (data) return data;
    return;
  },
  updateSession: async (query: number, updated: UserSchema) => {
    const data = await Reotem.getUser(query);
    if (typeof data !== "object") return;
    for (const key in data) {
      if (key.startsWith('$') || typeof (data as never)[key] === typeof Function || excludes.includes(key) || (updated as never)[key] === undefined) continue;
      if ((data as never)[key] !== (updated as never)[key])
        (data as never)[key] = (updated as never)[key];
    }
    return data.updateOne(updated);
  },
  deleteSession: async (id: number) => {
    const data = await models.Session.findOne({ id: id });
    console.log(`Deleting session for user -> ${data?.id}`);
    if (data) return data.deleteOne();
    return;
  },

  addNotifications: async (notifications: object) => {
    const merged = Object.assign(notifications);
    const newNotification = new models.Notification(merged);
    await newNotification
      .save()
      .then((u) => console.log(`New notification table for user -> ${u.id}`));
  },
  getNotification: async (userId: number, query: NotificationQuery) => {
    const data = await models.Notification.findOne({ id: userId, notifications: { $elemMatch: query } });
    if (data) return data;
    return;
  },
  getNotifications: async (id: number) => {
    const data = await models.Notification.findOne({ id: id });
    if (data) return data;
    return;
  },
  addNotification: async (userId: number, notif: NotifSchema) => {
    await models.Notification.updateOne(
      { id: userId },
      { $push: { notifications: notif } });
    console.log(`New notifications for user -> ${userId} -> ${notif.id}`);
  },
  updateNotification: async (userId: number, updated: Partial<NotifSchema>) => {
    const data = await Reotem.getNotification(userId, updated as NotificationQuery);
    if (typeof data !== "object") return;
    for (const key in data) {
      if (key.startsWith('$') || typeof (data as never)[key] === typeof Function || excludes.includes(key) || (updated as never)[key] === undefined) continue;
      if ((data as never)[key] !== (updated as never)[key])
        (data as never)[key] = (updated as never)[key];
    }
    return data.updateOne(updated);
  },
  updateNotifications: async (userId: number, updated: Partial<NotificationSchema>) => {
    const data = await Reotem.getNotifications(userId);
    if (typeof data !== "object") return;
    for (const key in data) {
      if (key.startsWith('$') || typeof (data as never)[key] === typeof Function || excludes.includes(key) || (updated as never)[key] === undefined) continue;
      if ((data as never)[key] !== (updated as never)[key])
        (data as never)[key] = (updated as never)[key];
    }
    return data.updateOne(updated);
  },
  deleteNotification: async (userId: number, notificationId: number) => {
    const data = await Reotem.getNotifications(userId);
    const delPos = data?.notifications.map(notif => notif.id).indexOf(notificationId);
    data?.notifications.splice((delPos as number), 1);
    await Reotem.updateNotifications(data?.id, (data as NotificationSchema));
    return;
  },
};

export default Reotem;