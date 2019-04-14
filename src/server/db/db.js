const sqlite3        = require('sqlite3').verbose();

const item_database = './src/server/db/db.db';   //resources
const db = new sqlite3.Database(item_database);   

export async function storeMasterItem(type, app, object, name, label, desc, def) {
    let sql = 'INSERT INTO items (type, app, object, name, label, description, definition) VALUES (?, ?, ?, ?, ?, ?, ?)';
    return db.run(sql, type, app, JSON.stringify(object), name, label, desc, def);
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