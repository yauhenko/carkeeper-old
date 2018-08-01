const mysql = require('promise-mysql');
// const host = "redstream.by";
const host = "192.168.1.99";
export default mysql.createPool({user: 'vadim', password: 'vadim', database: 'vadim', host});