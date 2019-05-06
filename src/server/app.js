const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

// Custom Packages

const qs = require('./qs/qs');
const db = require('./db/db');

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

app.get('/api/qsgetdoclist', (req, res) => {
    qs.qsGetDocList().then((list) => {
        console.log('API', 'Sending Doc List')
        res.send(list);
        res.end();
    })
})

app.get('/api/getstoreditems', async (req, res) => {
    let rows = await db.getStoredItems();
    res.send(rows)
    res.end();
})

app.get('/api/getlateststoreditems', async (req, res) => {
    let rows = await db.getLatestStoredItems();
    res.send(rows)
    res.end();
})

app.get('/api/getstoreditemsfortable', async (req, res) => {
    let rows = await db.mapStoredObjects();
    res.send(rows)
    res.end();
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

app.post('/api/storeobject', async (req,res) => {
    console.log('API received Master Item Object for Storage', req.body);
    let store = await db.storeMasterItem(req.body.type, req.body.app, req.body.layout, req.body.title, req.body.label, req.body.desc, req.body.def, req.body.id, req.body.version, req.body.appName);
    res.send('Received, Carry on.');
    res.end();
    console.log('API completed Master Item Object for Storage');
})

app.post('/api/editobject', async (req,res) => {
    console.log('API received Master Item Object for Editing');
    // console.log('API request', req.body);
    await db.editMasterItem(req.body.id, req.body.method, req.body.object, req.body.app);
    res.send('Received, Carry on.');
    res.end();
    console.log('API completed Master Item Object for Editing');
})

app.post('/api/updateobject', async (req,res) => {
    console.log('API received Master Item Object for Modification');
    // console.log('API request', req.body);
    await db.modifyMasterItem(req.body.id, req.body.name, req.body.label, req.body.description, req.body.definition, req.body.object);
    res.send('Received, Carry on.');
    res.end();
    console.log('API completed Master Item Object for Editing');
})

app.get('/api/qlikalive', async (req,res) => {
    console.log('API Checking Qlik Session Status');
    let status = await qs.qsQlikAlive();
    console.log('API Qlik Session Status:', status.status);
    res.send(status);
    res.end();
})

app.post('/submit', (req, res) => {
    res.send('you posted:\n');
    res.end(JSON.stringify(req.body, null, 2));
    console.log(JSON.stringify(req.body, null, 2));
})

app.listen(1212);
console.log('Server listening on port 1212')