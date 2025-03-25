import mongoose, { InferRawDocType, ObjectId } from "mongoose";
const { Schema } = mongoose;

const notifSchemaDefinition = {
    _id: String,
    read: { type: Boolean },
    message: { type: String, required: true }
}

export const notifSchema = new Schema(notifSchemaDefinition);

export type NotifSchema = InferRawDocType<typeof notifSchemaDefinition>;

const notificationSchemaDefinition = {
    id: { type: Number, required: true },
    notifications: [notifSchema]
}

export const notificationSchema = new Schema(notificationSchemaDefinition);

export type NotificationSchema = InferRawDocType<typeof notificationSchemaDefinition>;

export const NotificationsModel = mongoose.model("Notification", notificationSchema);
