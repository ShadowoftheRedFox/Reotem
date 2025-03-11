const mongoose = require("mongoose");
const minYear = new Date().getFullYear() - 18;
const maxYear = new Date().getFullYear() - 120;
let errorMessage;

const userSchema = mongoose.Schema({
  mongo_id: mongoose.Schema.Types.ObjectId,
  userID: Number,
  login: { type: String, required: true, unique: true },
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
    required: true,
    validate: {
      validator: function (d) {
        let date = new Date(d);
        let min = new Date(`${minYear}-01-01`);
        let max = new Date(`${maxYear}-01-01`);
        return min <= date <= max;
      },
      message: props => `${new Date().getFullYear() - (new Date(props.value).getFullYear())} ans n'est pas un age valide (vous devez avoir plus de 18 ans)!`
    },
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
