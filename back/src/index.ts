import express from 'express';
import { init } from './util/mongoose';
import cors from 'cors'; // corss origin request
import routes from './routes/routes';
import HttpException from './models/HttpException';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

const port = process.env.PORT;

const corsOptions = {
    origin: '*',  // Allows requests from all domains. Specify actual domain in production for security.
    optionsSuccessStatus: 200 // Ensure compatibility by setting OPTIONS success status to 200 OK.
};

const app = express();

// Apply JSON parsing and CORS with configured options as global middleware.
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    inflate: true,
    limit: "1mb",
    parameterLimit: 5000,
    type: "application/x-www-form-urlencoded",
}));
app.use(cors(corsOptions));

app.use(routes);

init();

const errorHandler = (err: Error | HttpException, req: express.Request, res: express.Response, /* next: express.NextFunction */) => {
    if (err && err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: 'error',
            message: 'missing authorization credentials',
        });
    } else if (err instanceof HttpException) {
        if (err.internalLog === true) { console.error(err); } else { console.log("Error for user generated."); }
        res.status(err.errorCode).json({ message: err.message });
    } else if (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

app.use(errorHandler as never);

// 404: Not found
app.use(function (req, res) {
    res.status(404).json({ ERROR: 'Page not found.' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
