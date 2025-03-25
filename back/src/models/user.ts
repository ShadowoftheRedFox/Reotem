import mongoose, { InferRawDocType } from "mongoose";
const { Schema } = mongoose;

export const UserMaxAge = 120;
export const UserMinAge = 18;

export const UserSexe = [
    "Homme", "Femme", "Autre"
];

export const UserRole = [
    "Administrator",
    "CEO",
    "CO-CEO",
    "Project Manager",
    "Developper",
    "Tester",
    "Intern",
];

const userSchemaDefinition = {
    id: { type: Number, required: true },
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
    level: { type: String, required: true },
    sexe: { type: String, required: true },
    photo: { type: Buffer, default: null },
    challenge: String, // can be undefined when is not challenged
    validated: String, // is a secret token, is defined when user has not validated his email yet
}

export const userSchema = new Schema(userSchemaDefinition);

export type UserSchema = InferRawDocType<typeof userSchemaDefinition>;

export const UserModel = mongoose.model("User", userSchema);
