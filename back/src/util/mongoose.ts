import mongoose from "mongoose";
import logger from "./logger";

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
const DBCONNECTION = process.env.DBCONNECTION as string;

export default mongoose;

export const init = () => {
    const options = {
        autoIndex: false,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    };
    mongoose.connect(DBCONNECTION, options);
    mongoose.Promise = global.Promise;
    mongoose.connection.on("connected", async () => {
        logger("[MONGODB] Connected to database.");
    });
}