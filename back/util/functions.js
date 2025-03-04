const models = require("../models/export_models");
const mongoose = require("mongoose");

module.exports = async (Reotem) => {
  try {
    Reotem.addUser = async (user) => {
      const merged = Object.assign(user);
      const createUser = await new models.User(merged);
      createUser
        .save()
        .then((u) => console.log(`Nouvel utilisateur -> ${u.login}`));
    };
  } catch (e) {
    console.log(e);
  }
};
