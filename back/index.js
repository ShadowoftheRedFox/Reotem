const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("./util/mongoose");
const Reotem = {};
require("./util/functions")(Reotem);
require("dotenv").config();
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
mongoose.init();
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test/", (req, res) => {
  const options = {
    root: path.join(__dirname),
  };
  const fileName = "index.html";
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.error("Error sending file:", err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

app.post("/test/", upload.single("photo"), (req, res) => {
  let user = req.body;
  let photoBuffer = Buffer.from(req.file.path);
  user.photo = photoBuffer;
  res.send("Bravo vous êtes inscrit " + user.first_name + " " + user.last_name);
  console.log(user);
  Reotem.addUser(user);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
