import { qsPullMasterItems } from '../qs/qs';

const sqlite3        = require('sqlite3').verbose();

const qs = require('../qs/qs');

const item_database = './src/server/db/db.db';   //resources
const db = new sqlite3.Database(item_database);   

export async function storeMasterItem(type, app, object, name, label, desc, def, objectid) {
    let sql = 'INSERT INTO items (type, app, object, name, label, description, definition, objectid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    return db.run(sql, type, app, JSON.stringify(object), name, label, desc, def, objectid);
}

export async function editMasterItem(id, method, object, app) {
    var sql;
    var res;
    switch (method) {
        case 'delete':
        sql = 'DELETE FROM items WHERE id = ' + id + ';';
        db.run(sql);
        res = "200 - SUCCESS";
        break;

        case 'duplicate':
        sql = 'INSERT INTO \
                    items (type, object, app, version, name, label, description, definition) \
                        SELECT type, object, app, version, name, label, description, definition \
                        FROM items WHERE id = ' + id + ';';
        db.run(sql);
        res = "200 - SUCCESS";
        break;

        case 'export':
        res = await qs.qsDeployMasterItem(app, object);
        break;
    }

    return res;
}

export async function getStoredItems() {
    let sql = 'SELECT * FROM items';
    return new Promise((resolve, reject) => {
        db.all(sql, function(err, items) {
            if(err) {console.error(err)};
            resolve(items);
        })
    })
}