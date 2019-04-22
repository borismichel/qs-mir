import { qsPullMasterItems } from '../qs/qs';

const sqlite3        = require('sqlite3').verbose();

const qs = require('../qs/qs');

const item_database = './src/server/db/db.db';   //resources
const db = new sqlite3.Database(item_database);   

export async function storeMasterItem(type, app, object, name, label, desc, def, objectid, version) {
    let sql = 'INSERT INTO items (type, app, object, name, label, description, definition, objectid, version) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    let v = (version) ? version + 1:1;
    return db.run(sql, type, app, JSON.stringify(object), name, label, desc, def, objectid, v);
}

export async function editMasterItem(id, method, object, app) {
    var sql;
    var res;

    var layout = (object) ? JSON.parse(object):'';

    switch (method) {
        case 'delete':
        sql = 'DELETE FROM items WHERE id = ' + id + ';';
        db.run(sql);
        res = "200 - SUCCESS";
        break;

        case 'duplicate':
        sql = 'INSERT INTO \
                    items (type, object, app, version, name, label, description, definition, objectid) \
                        SELECT type, object, app, version+1, name, label, description, definition, objectid \
                        FROM items WHERE id = ' + id + ';';
        db.run(sql);
        res = "200 - SUCCESS";
        break;

        case 'export':
        res = await qs.qsDeployMasterItem(app, layout);
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

export async function getLatestStoredItems() {
    let sql = 'SELECT \
                id, \
                type, \
                object, \
                app, \
                version, \
                name, \
                label, \
                description, \
                definition, \
                objectid \
            FROM items \
            INNER JOIN  \
            (SELECT app as joinApp, objectid as joinOid, max(Version) as max FROM items GROUP BY joinApp, joinOid)  \
            ON app = joinApp AND objectid = joinOid  AND version = max \
            ;';
    return new Promise((resolve, reject) => {
        db.all(sql, function(err, items) {
            if(err) {console.error(err)};
            resolve(items);
        })
    })
}

export async function getMaxVersionForItem(app, object) {
    let sql = 'SELECT max(version) as Max, app, objectid FROM items WHERE app="'+ app +'" AND objectid="'+ object + '" GROUP BY app, objectid;';
    return new Promise((resolve, reject) => {
        db.all(sql, function(err, items) {
            if(err) {console.error(err)};  
            if (items.length > 0) {
                resolve(items[0].Max);
            } else {
                resolve(false)
            }
        })
    })
}