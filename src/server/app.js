const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

// Custom Packages

const qs = require('./qs/qs');

const app = express();

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, '../../dist/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../../dist/index.html'));
});

app.get('/api/qsmasterpull', (req,res) => {
    qs.qsPullMasterItems().then((r) => {
        console.log(r);
        res.send(r)
        res.end();
    })
})

app.post('/submit', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.write('you posted:\n');
    res.end(JSON.stringify(req.body, null, 2));
    console.log(JSON.stringify(req.body, null, 2));
})

app.listen(1212);
console.log('Server listening on port 1212')