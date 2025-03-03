const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/ploof/', (req, res) => {
    res.send('Hello ploof!')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
