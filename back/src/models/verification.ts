import mongoose, { InferRawDocType } from "mongoose";
const { Schema } = mongoose;

const verificationSchemaDefinition = {
    id: { type: String, required: true },
    token: {type: String, required: true}
}


export const verificationSchema = new Schema(verificationSchemaDefinition);

export type VerificationSchema = InferRawDocType<typeof verificationSchemaDefinition>;

export const VerificationModel = mongoose.model("Verification", verificationSchema);
