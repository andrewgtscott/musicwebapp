const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    password: 'root',
    database: 'stacksofwax',
    port: '8889',
    multipleStatements: true,
    waitForConnections: true,
    queueLimit:10
});

pool.getConnection((err)=>{
    if(err) return console.log(err.message);
    console.log("connected to db using createPool");
});


module.exports = pool;
