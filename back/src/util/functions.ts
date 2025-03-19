import models from "../models/export_models";
import { UserSchema } from "~/models/user"; 
import mongoose from "mongoose";

const Reotem = {
  addUser: async (user: object) => {
    const merged = Object.assign(user);
    const newUser = await new models(merged);
    await newUser
      .save()
      .then((u) => console.log(`Nouvel utilisateur -> ${u.email}`));
  },
  getUser: async (query: string) => {
    const data = await models.findOne({ id: query });
    if (data) return data;
    return;
  },
  getUsers: async () => {
    const data = await models.find();
    if (data) return data;
    return;
  },
  updateUser: async (query: string, updated: UserSchema) => {
    let data = await Reotem.getUser(query);
    if (typeof data !== "object") return;
    return data.updateOne(updated);
  }
};

export default Reotem;