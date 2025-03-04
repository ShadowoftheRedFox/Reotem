const mongoose = require("mongoose");
const minYear = new Date().getFullYear() - 18;
const maxYear = new Date().getFullYear() - 120;

const userSchema = mongoose.Schema({
  mongo_id: mongoose.Schema.Types.ObjectId,
  userID: Number,
  login: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  genre: {
    type: String,
    enum: ["Male", "Female", "MD Helicopter MD-900 Explorer", "Other"],
    required: true,
  },
  age: {
    type: Date,
    minimum: `${minYear}-01-01`,
    maximum: `${maxYear}-01-01`,
    required: true,
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
  photo: Buffer,
});
module.exports = mongoose.model("User", userSchema);
