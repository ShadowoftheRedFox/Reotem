const models = require("../models/export_models");
const mongoose = require("mongoose");

module.exports = async (Reotem) => {
  Reotem.addUser = async (user) => {
    const merged = Object.assign(user);
    try {
      new models.User(merged);
    } catch (err) {
      console.log("CATCHED:", err);
      return;
    }
    const newUser = await new models.User(merged);
    newUser.save().then((u) => console.log(`Nouvel utilisateur -> ${u.login}`));
  };
  Reotem.getUser = async (user) => {
    const data = await User.findOne({ $or: [{ login: user }, { mail: user }] });
    if (data) return data;
    return;
  };
  Reotem.updateUser = async (user) => {
    let data = await Reotem.getUser(user);
    if (typeof data !== "object") data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
    }
    return data.updateOne(settings);
  };
};
