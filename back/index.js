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
app.use(express.urlencoded({
    extended: true,
    inflate: true,
    limit: "1mb",
    parameterLimit: 5000,
    type: "application/x-www-form-urlencoded",
}));
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
            if (err.interalLog === true) { console.error(err); } else { console.log("Error for user generated."); }
            res.status(err.errorCode).json({ message: err.message });
        } else if (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },
);

// 404: Not found
app.use(function (req, res, next) {
    res.status(404).json({ ERROR: 'Page not found.' });
=======
const path = require("path");
const multer = require("multer");
const Reotem = require("./util/functions");
  
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      `${req.body.login}_${req.body.last_name}_${req.body.first_name}-profile_picture.jpg`
    );
  },
});
const upload = multer({ storage: storage });

app.post("/test/", upload.single("photo"), async (req, res) => {
  let user = req.body;
  let photoBuffer =
    req.file !== undefined
      ? Buffer.from(req.file.path)
      : Buffer.from(defaultPFPfile);
  user.photo = photoBuffer;
  let results = await Reotem.addUser(user);
  if (results.error === undefined)
    return res.send(
      "Bravo vous êtes inscrit " + user.first_name + " " + user.last_name
    );
  let errors = Object.values(Object.values(results.error)[0]);
  res.statusMessage = "ERRORS: ";
  errors.forEach(
    (error) =>
      (res.statusMessage = res.statusMessage + `${error.properties.message},`)
  );
  req.session.formData = req.body;
  res.redirect("/test");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
