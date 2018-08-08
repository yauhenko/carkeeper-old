const mysql = require('promise-mysql');
const host = "redstream.by";
//const host = "192.168.1.99";
const db = mysql.createPool({user: 'vadim', password: 'vadim', database: 'vadim', host});

db.update = async (table, data, id, { pk = 'id', ignore = false } = {}) => {
    let keys = Object.keys(data);
    let pairs = [];
    for(let k of keys) {pairs.push(db.escapeId(k) + ' = ' + db.escape(data[k]))}
    if (pairs.length === 0) return false;
    let sql = 'UPDATE ' + (ignore ? 'IGNORE' : '') + ' ?? SET ' + pairs.join(', ') + ' WHERE ?? = ?';
    let res = await db.query(sql, [table, pk, id]);
    console.log(res);
    return Boolean(res['affectedRows']);
};

db.insert = async (table, data, { ignore = false } = {}) => {
    let keys = [], vals = [];
    for(let key of Object.keys(data)) {
        keys.push(db.escapeId(key));
        vals.push(db.escape(data[key]));
    }
    let sql = 'INSERT ' + (ignore ? 'IGNORE' : '') + ' INTO ?? (' + keys.join(', ') + ') VALUES (' + vals.join(', ') + ')';
    console.log(sql);
    let res = await db.query(sql, [table]);
    return res['insertId'];
};

db.one = async (sql, data = []) => {
    if(!sql.match(/LIMIT 1/i)) sql += ' LIMIT 1';
    let res = await db.query(sql, data);
    if(res.length === 0) return null;
    else return res[0];
};

db.get = async (table, id, { pk = 'id', fields = '*' } = {}) => {
    let sql = 'SELECT ?? FROM ?? WHERE ?? = ? LIMIT 1';
    return await db.one(sql, [fields, table, pk, id]);
};

db.aggregate = async (sql, data = [], rules = {}) => {
    let result = await db.query(sql, data);

    for(let key of Object.keys(rules)) {
        let rule = rules[key];
        rule.key = rule.key || 'id';
        rule.fields = rule.fields || '*';
        rule.single = rule.single || null;
        if(rule.fields instanceof Array && rule.fields.indexOf(rule.key) === -1) rule.fields.push(rule.key);
    }

    let index = {};
    let items = {};

    result.forEach((item, idx) => {
        for(let key of Object.keys(rules)) {
            if(item[key]) {
                if(!items[key]) items[key] = [];
                if(!index[key]) index[key] = {};
                items[key].push(item[key]);
                index[key][item[key]] = idx;
            }
        }
    });

    for(let key of Object.keys(items)) {
       let rule = rules[key];
       let res = await db.query('SELECT ?? FROM ?? WHERE ?? IN (?)', [rule.fields, rule.table, rule.key, items[key]]);
       res.forEach((item) => {
           let idx = index[key][ item[rule.key] ];
           result[idx][key] = rule.single ? item[rule.single] : Object.assign(item, {});
       });

    }

    return result;

};

db.aggregateOne = async (sql, data = [], rules = {}) => {
    if(!sql.match(/LIMIT 1/i)) sql += ' LIMIT 1';
    let res = await db.aggregate(sql, data, rules);
    if(res.length === 0) return 0;
    return res[0];
};

db.delete = async (table, id, pk = 'id') => {
    let res = await db.query('DELETE FROM ?? WHERE ?? = ?', [table, pk, id]);
    return Boolean(res['affectedRows']);
};

export default db;
