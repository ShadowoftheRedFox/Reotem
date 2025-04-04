import models from "../models/export_models";
import { UserSchema } from "~/models/user";
import { NotifSchema, NotificationSchema } from "~/models/notification";
import {
  LevelAdvanced,
  LevelBeginner,
  NotificationQuery,
} from "../../../front/src/models/api.model";
import { AnyObject, ObjectSchema } from "~/models/object";
import mongoose, { Types } from "mongoose";
import logger from "./logger";
import * as fs from "fs";

const excludes = ["collection", "_doc", "db", "id", "__v", "schema"];

const Reotem = {
  addUser: async (user: object) => {
    const objectId = new Types.ObjectId();
    const merged = Object.assign(user, {
      _id: objectId,
      id: objectId.toString(),
    });
    const newUser = new models.User(merged);
    await newUser.save().then((u) => {
      logger(`New user -> ${u.email}`);
    });
    return newUser;
  },
  getUser: async (id: string) => {
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
  updateUser: async (id: string, updated: Partial<UserSchema>) => {
    const data = await Reotem.getUser(id);
    if (typeof data !== "object") return;
    for (const key in data) {
      if (
        key.startsWith("$") ||
        typeof (data as never)[key] === typeof Function ||
        excludes.includes(key) ||
        (updated as never)[key] === undefined
      )
        continue;
      if ((data as never)[key] !== (updated as never)[key])
        (data as never)[key] = (updated as never)[key];
    }
    return data.updateOne(updated);
  },
  deleteUser: async (id: string) => {
    const data = await models.User.findOne({ id: id });
    if (data) return data.deleteOne();
    return;
  },
  checkUserUnique: async (email: string) => {
    const users = await Reotem.getUsers();
    const emails = users?.map((user) => user.email);
    return emails?.includes(email);
  },

  addSession: async (session: object) => {
    const merged = Object.assign(session);
    const newSession = new models.Session(merged);
    await newSession.save().then((u) => {
      logger(`New session for user -> ${u.id}`);
    });
    return newSession;
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
  updateSession: async (query: string, updated: UserSchema) => {
    const data = await Reotem.getUser(query);
    if (typeof data !== "object") return;
    for (const key in data) {
      if (
        key.startsWith("$") ||
        typeof (data as never)[key] === typeof Function ||
        excludes.includes(key) ||
        (updated as never)[key] === undefined
      )
        continue;
      if ((data as never)[key] !== (updated as never)[key])
        (data as never)[key] = (updated as never)[key];
    }
    return data.updateOne(updated);
  },
  deleteSession: async (id: string) => {
    const data = await models.Session.findOne({ id: id });
    logger(`Deleting session for user -> ${data?.id}`);
    if (data) return data.deleteOne();
    return;
  },

  addVerification: async (verification: { id?: string; token?: string }) => {
    const merged = Object.assign(verification);
    const newVerification = new models.Verification(merged);
    await newVerification.save().then((u) => {
      logger(`New verification for user -> ${u.id}`);
    });
    return newVerification;
  },
  getVerification: async (token: string) => {
    const data = await models.Verification.findOne({ token: token });
    if (data) return data;
    return;
  },
  updateVerification: async (query: string, updated: UserSchema) => {
    const data = await Reotem.getUser(query);
    if (typeof data !== "object") return;
    for (const key in data) {
      if (
        key.startsWith("$") ||
        typeof (data as never)[key] === typeof Function ||
        excludes.includes(key) ||
        (updated as never)[key] === undefined
      )
        continue;
      if ((data as never)[key] !== (updated as never)[key])
        (data as never)[key] = (updated as never)[key];
    }
    return data.updateOne(updated);
  },
  deleteVerification: async (id: string) => {
    const data = await models.Verification.findOne({ id: id });
    logger(`Deleting verification for user -> ${data?.id}`);
    if (data) return data.deleteOne();
    return;
  },

  addNotifications: async (notifications: object) => {
    const merged = Object.assign(notifications);
    const newNotification = new models.Notification(merged);
    await newNotification.save().then((u) => {
      logger(`New notification table for user -> ${u.id}`);
    });
    return newNotification;
  },
  getNotification: async (userId: string, query: NotificationQuery) => {
    const data = await models.Notification.findOne({
      id: userId,
      notifications: { $elemMatch: query },
    });
    if (data) return data;
    return;
  },
  getNotifications: async (id: string) => {
    const data = await models.Notification.findOne({ id: id });
    if (data) return data;
    return;
  },
  addNotification: async (userId: string, notif: Partial<NotifSchema>) => {
    const objectId = new Types.ObjectId();
    const merged = Object.assign(notif, {
      _id: objectId,
      id: objectId.toString(),
    });
    await models.Notification.updateOne(
      { id: userId },
      { $push: { notifications: merged } }
    );
    logger(`New notifications for user -> ${userId} -> ${notif.id}`);
  },
  updateNotification: async (userId: string, updated: Partial<NotifSchema>) => {
    const data = await Reotem.getNotification(
      userId,
      updated as NotificationQuery
    );
    if (typeof data !== "object") return;
    for (const key in data) {
      if (
        key.startsWith("$") ||
        typeof (data as never)[key] === typeof Function ||
        excludes.includes(key) ||
        (updated as never)[key] === undefined
      )
        continue;
      if ((data as never)[key] !== (updated as never)[key])
        (data as never)[key] = (updated as never)[key];
    }
    return data.updateOne(updated);
  },
  updateNotifications: async (
    userId: string,
    updated: Partial<NotificationSchema>
  ) => {
    const data = await Reotem.getNotifications(userId);
    if (typeof data !== "object") return;
    for (const key in data) {
      if (
        key.startsWith("$") ||
        typeof (data as never)[key] === typeof Function ||
        excludes.includes(key) ||
        (updated as never)[key] === undefined
      )
        continue;
      if ((data as never)[key] !== (updated as never)[key])
        (data as never)[key] = (updated as never)[key];
    }
    return data.updateOne(updated);
  },
  deleteNotification: async (userId: string, notificationId: string) => {
    const data = await Reotem.getNotifications(userId);
    const delPos = data?.notifications
      .map((notif) => notif.id)
      .indexOf(notificationId);
    data?.notifications.splice(delPos as number, 1);
    await Reotem.updateNotifications(data?.id, data as NotificationSchema);
    return;
  },

  addObject: async (object: ObjectSchema, objectData: AnyObject) => {
    const objectId = new Types.ObjectId();
    const merged = {
      ...object,
      ...objectData,
      ...{ _id: objectId, id: objectId.toString() },
    };
    const newObject = await new models.Object(merged);
    await newObject.save().then((o) => {
      logger(`New ${o.objectClass} -> ${o.id}`);
    });
    return newObject;
  },
  getAllObjects: async () => {
    const data = await models.Object.find();
    if (data) return data;
    return;
  },
  getObject: async (id: string) => {
    const data = await models.Object.findOne({ id: id });
    if (data) return data;
    return;
  },
  updateObject: async (
    objectId: string,
    updated: ObjectSchema,
    userId: string
  ) => {
    const data = await Reotem.getObject(objectId);
    const user = await Reotem.getUser(userId);
    if (user) {
      user.exp = user.exp + 10;
      if (user.exp >= LevelBeginner && user.lvl === "Débutant") {
        logger("Level up Débutant -> Avancé");
        user.lvl = "Avancé";
        user.exp = user.exp - LevelBeginner;
      }
      if (user.exp >= LevelAdvanced && user.lvl === "Avancé") {
        logger("Level up Avancé -> Expert");
        user.lvl = "Expert";
        user.exp = user.exp - LevelAdvanced;
      }
    }
    await Reotem.updateUser(userId, user as UserSchema);
    if (typeof data !== "object") return;
    for (const key in data) {
      if (
        key.startsWith("$") ||
        typeof (data as never)[key] === typeof Function ||
        excludes.includes(key) ||
        (updated as never)[key] === undefined
      )
        continue;
      if ((data as never)[key] !== (updated as never)[key])
        (data as never)[key] = (updated as never)[key];
    }
    return data.updateOne(updated);
  },
  deleteObject: async (id: string) => {
    const data = await models.Object.findOne({ id: id });
    logger(`Deleting object -> ${data?.id}`);
    if (data) return data.deleteOne();
    return;
  },

  dataDump: async (id: string) => {
    const user = await Reotem.getUser(id)
    if (user?.role !== "Administrator") return 403
    const db = mongoose.connection.db
    if (!db) return 500
    const collections = await db.listCollections().toArray();
    const result: Record<string, mongoose.mongo.WithId<mongoose.mongo.BSON.Document>[]> = {};
    for (const collection of collections) {
      const collectionName = collection.name;
      result[collectionName] = await db.collection(collectionName).find({}).toArray();
    }
    fs.appendFile('./dump/backup.json', `${JSON.stringify(result, undefined, 4)}`, function (err) {
      if (err) return 500;
    });
    return 201
  }
};

export default Reotem;

