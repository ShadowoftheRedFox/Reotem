import mongoose, { InferRawDocType } from "mongoose";
const { Schema } = mongoose;

const notifSchemaDefinition = {
  
    id: { type: String, required: true },
    read: { type: Boolean, required: true },
    message: { type: String, required: true },
    title: { type: String, required: true }
}

export const notifSchema = new Schema(notifSchemaDefinition);

export type NotifSchema = InferRawDocType<typeof notifSchemaDefinition>;

const notificationSchemaDefinition = {
    id: { type: String, required: true },
    notifications: [notifSchema]
}

export const notificationSchema = new Schema(notificationSchemaDefinition);

export type NotificationSchema = InferRawDocType<typeof notificationSchemaDefinition>;

export const NotificationsModel = mongoose.model("Notification", notificationSchema);
