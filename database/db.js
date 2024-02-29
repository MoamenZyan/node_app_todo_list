#!/usr/bin/node
const mysql = require('mysql2');


// Connection to database
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
});

// Function to init database tables when server goes up
function init(){
    connection.query("CREATE TABLE IF NOT EXISTS login (id VARCHAR(40) PRIMARY KEY, username VARCHAR(30) UNIQUE NOT NULL, password VARCHAR(60) NOT NULL)");
    connection.query("CREATE TABLE IF NOT EXISTS user_info (id VARCHAR(40) PRIMARY KEY, phone_number VARCHAR(11) UNIQUE, email VARCHAR(50) UNIQUE, address TEXT, age CHAR(2), FOREIGN KEY (id) REFERENCES login(id))");
    connection.query("CREATE TABLE IF NOT EXISTS todo (task_id INT PRIMARY KEY AUTO_INCREMENT, user_id VARCHAR(40), description TEXT, deadline DATE, status BOOLEAN, FOREIGN KEY (user_id) REFERENCES login(id))");
}

// Query function for database
function query(sql, params){
    return new Promise ((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

module.exports = {
    init, query
}
