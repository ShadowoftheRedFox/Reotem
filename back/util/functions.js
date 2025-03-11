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
};
