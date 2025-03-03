const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    login: String,
    password: String,
    age: {
        type: Number,
        minimum: 0
    }

});
module.exports = mongoose.model("User", userSchema);