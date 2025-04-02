import express, { ErrorRequestHandler } from "express";
import { init } from "./util/mongoose";
import cors from "cors"; // corss origin request
import routes from "./routes/routes";
import HttpException from "./models/HttpException";
import logger from "./util/logger";

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();

const port = process.env.PORT;

const corsOptions = {
  origin: "*", // Allows requests from all domains. Specify actual domain in production for security.
  optionsSuccessStatus: 200, // Ensure compatibility by setting OPTIONS success status to 200 OK.
};

init();

const app = express();

// Apply JSON parsing and CORS with configured options as global middleware.
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    inflate: true,
    limit: "1mb",
    parameterLimit: 5000,
    type: "application/x-www-form-urlencoded",
  })
);
app.use(cors(corsOptions));

app.use(routes);

// to get images
// https://stackoverflow.com/questions/68572063/return-url-of-locally-stored-image-node-js-api
app.use(express.static("public"));

const errorHandler: ErrorRequestHandler = function (err, req, res, next) {
  if (err && err.name === "UnauthorizedError") {
    res.status(401).json({
      status: "error",
      message: "missing authorization credentials",
    });
    return;
  } else if (err instanceof HttpException) {
    if (err.internalLog === true) {
      console.error(err);
    } else {
      logger("Error for user generated.");
    }
    res.status(err.errorCode).json({ message: err.message });
    return;
  } else if (err instanceof Error) {
    logger(JSON.stringify(err));
    res.status(500).json({ message: err.message });
    return;
  }
  next(err);
};

app.use(errorHandler);

// 404: Not found
app.use(function (req, res) {
  res.status(404).json({ ERROR: "Page not found." });
});

app.listen(port, async () => {
  logger(`\n|----------------| SERVER START AT ${new Date().toDateString().toUpperCase()} |----------------|`)
  logger(`Server running on http://localhost:${port}/`);
});
