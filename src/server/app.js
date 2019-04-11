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

app.post('/api/qsmasterpull', (req,res) => {
    let appid = req.body.app;
    console.log('API', 'Sending Master Items')
    qs.qsPullAndMapMasterItems(appid).then((r) => {
        console.log('API', 'Sending Master Items', 'm', r[0].length, 'd', r[1].length)
        res.send(r)
        res.end();
    })
})

app.get('/test', (req,res) => {
    let appid = "C:\\Users\\Boris Michel\\Documents\\Qlik\\Sense\\Apps\\Consumer Sales.qvf" //req.body.app;
    console.log('API', 'Sending Master Items')
    qs.qsPullAndMapMasterItems(appid).then((r) => {
        console.log('API', 'Sending Master Items', 'm', r[0].length, 'd', r[1].length)
        res.send(JSON.stringify(r, null, 2));
        res.end();
    })
})

app.get('/api/qsgetdoclist', (req, res) => {
    qs.qsGetDocList().then((list) => {
        console.log('API', 'Sending Doc List')
        res.send(list);
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