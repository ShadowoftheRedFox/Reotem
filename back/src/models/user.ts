import mongoose, { InferRawDocType } from "mongoose";
const { Schema } = mongoose;

export const UserMaxAge = 120;
export const UserMinAge = 18;

const userSchemaDefinition = {
    id: { type: Number, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    age: {
        type: Number,
        minimum: UserMinAge,
        maximum: UserMaxAge,
        required: true
    },
    role: { type: String, required: true },
    sexe: { type: String, required: true },
    exp: { type: Number, default: 0 },
    lvl: { type: String, default: "Débutant" },
    challenge: String, // can be undefined when is not challenged
    validated: String, // is a secret token, is defined when user has not validated his email yet
    adminValidated: { type: Boolean, default: false }
}


export const userSchema = new Schema(userSchemaDefinition);

export type UserSchema = InferRawDocType<typeof userSchemaDefinition>;

export const UserModel = mongoose.model("User", userSchema);
