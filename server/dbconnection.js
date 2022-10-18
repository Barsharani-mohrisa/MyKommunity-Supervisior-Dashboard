var mysql = require("mysql2");


var db=mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'mykom-dash',
    port: 3306,
});
//
module.exports = db;