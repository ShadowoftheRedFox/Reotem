const mongoose = require("mongoose");

const UserMaxAge = 120;
const UserMinAge = 18;

const UserSexe = [
    "Homme", "Femme", "Autre"
];

const UserRole = [
    "Employé"
];

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    age: {
        type: Number,
        minimum: UserMinAge,
        maximum: UserMaxAge
    },
    role: String,
    sexe: String,
    challenge: {
        type: String,
        nullable: true // can be undefined when is not challenged
    },
    validated: {
        type: String, // is a secret token
        nullable: true // is defined when user has not validated his email yet
    }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel, UserRole, UserSexe, UserMinAge, UserMaxAge };