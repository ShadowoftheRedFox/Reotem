const mongoose = require("mongoose");
require('dotenv').config();
const DBCONNECTION = process.env.DBCONNECTION;
module.exports = {
    init: () => {
        const options = {
            autoIndex: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        };
        mongoose.connect(DBCONNECTION, options);
        mongoose.Promise = global.Promise;
        mongoose.connection.on("connected", () => console.log("[MONGODB] Connected to database."));
    }
};