const mysql = require('promise-mysql');
// const host = "redstream.by";
const host = "192.168.1.99";
const db = mysql.createPool({user: 'vadim', password: 'vadim', database: 'vadim', host});
//
// db.update = async function(table, data, id) {
//     let keys = Object.keys(data);
//     let pairs = [];
//     for(let k of keys) {pairs.push(db.escapeId(k) + ' = ' + db.escape(data[k]))}
//     if (pairs.length === 0) return false;
//
//     let sql = 'UPDATE users SET ' + pairs.join(', ') + ' WHERE id = ?';
//     let res = db.query(sql, [id]);
//     return res.id
// };

db.insert = async function(table, data) {
    let keys = [];
    let vals = [];
    for(let k of Object.keys(data)) {
        keys.push(db.escapeId(k));
        vals.push(db.escape(data[k]));
    }
    let sql = 'INSERT INTO ?? (' + keys.join(', ') + ') VALUES (' + vals.join(', ') + ')';
    console.log(sql);
    let res = await db.query(sql, [table]);
    return res.insertId;
};

export default db;
