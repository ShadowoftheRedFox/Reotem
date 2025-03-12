const express = require('express');
const mongoose = require('./util/mongoose');
const cors = require('cors'); // corss origin request
const routes = require('./routes/routes');

require('dotenv').config();

const port = process.env.PORT;

const corsOptions = {
    origin: '*',  // Allows requests from all domains. Specify actual domain in production for security.
    optionsSuccessStatus: 200 // Ensure compatibility by setting OPTIONS success status to 200 OK.
};

const app = express();

// Apply JSON parsing and CORS with configured options as global middleware.
app.use(express.json());
app.use(cors(corsOptions));

app.use(routes);

mongoose.init()

app.use(
    (
        err,  //Error | HttpException
        req,  //express.Request
        res,  //express.Response
        next, // express.NextFunction
    ) => {
        if (err && err.name === 'UnauthorizedError') {
            return res.status(401).json({
                status: 'error',
                message: 'missing authorization credentials',
            });
        } else if (err && err.errorCode) {
            console.log(err);
            res.status(err.errorCode).json({ message: err.message });
        } else if (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },
);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
