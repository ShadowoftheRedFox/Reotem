const express = require('express');
const mongoose = require('./util/mongoose');
const app = express();
require('dotenv').config()
const port = process.env.PORT;
mongoose.init()

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/ploof/', (req, res) => {
    res.send('Hello ploof!')
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
