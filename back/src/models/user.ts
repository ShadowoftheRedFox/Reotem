import mongoose, { InferRawDocType } from "mongoose";
const { Schema } = mongoose;

export const UserMaxAge = 120;
export const UserMinAge = 18;

const userSchemaDefinition = {
  id: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: String, required: true },
  role: { type: String, required: true },
  sexe: { type: String, required: true },
  exp: { type: Number, default: 0, required: true },
  lvl: { type: String, default: "Débutant", required: true },
  challenge: String, // can be undefined when is not challenged
  validated: String, // is a secret token, is defined when user has not validated his email yet
  adminValidated: { type: Boolean, default: false, required: true },
  lastLogin: String,
};

export const userSchema = new Schema(userSchemaDefinition);

export type UserSchema = InferRawDocType<typeof userSchemaDefinition>;

export const UserModel = mongoose.model("User", userSchema);
