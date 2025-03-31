import mongoose, { InferRawDocType } from "mongoose";
const { Schema } = mongoose;

const sessionSchemaDefinition = {
    id: { type: String, required: true },
    token: {type: String, required: true}
}


export const sessionSchema = new Schema(sessionSchemaDefinition);

export type SessionSchema = InferRawDocType<typeof sessionSchemaDefinition>;

export const SessionModel = mongoose.model("Session", sessionSchema);
