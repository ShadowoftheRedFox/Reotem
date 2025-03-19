const mongoose = require("mongoose");
const defaultIMG = Buffer.from("../assets/Default.png");

const userSchema = mongoose.Schema({
  mongo_id: mongoose.Schema.Types.ObjectId,
  userID: Number,
  login: { type: String, required: true, unique: true },
  mail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  genre: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  age: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: [
      "Administrator",
      "CEO",
      "CO-CEO",
      "Project Manager",
      "Developper",
      "Tester",
      "Intern",
    ],
    required: true,
  },
  photo: {type: Buffer, default: defaultIMG},
});
module.exports = mongoose.model("User", userSchema);
