const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'warehouse',
});

db.connect((err) => {
    if (err) {
        console.log('Gagal terhubung dengan database: ' + err.stack);
    } else {
        console.log('Berhasil terhubung dengan database: ', db.threadId);
    }
});

module.exports = db;
