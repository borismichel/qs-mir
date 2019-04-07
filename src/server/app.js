const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const app = express();

console.log(path.join(__dirname, '../../dist'))

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, '../../dist/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../../dist/index.html'));
});

app.post('/submit', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.write('you posted:\n');
    res.end(JSON.stringify(req.body, null, 2));
    console.log(JSON.stringify(req.body, null, 2));
})

app.listen(1212);