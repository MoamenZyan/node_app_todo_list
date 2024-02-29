#!/usr/bin/node
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const db = require('../database/db.js');

// Database Class
class InsertDB{
    constructor (){}

    // Method To Insert New User Into DATABASE
    async user_insertion(body){
        this.id = uuid.v4();
        this.password = await bcrypt.hash(body["password"], 10);
        try {
            await db.query("INSERT INTO login (id, username, password) VALUES (?, ?, ?)", [this.id, body["username"], this.password]);
            await db.query("INSERT INTO user_info (id, phone_number, email, address, age) VALUES (?, ?, ?, ?, ?)", [this.id, body["phone"], body["email"], body["address"], body["age"]]);
            return 0;
        } catch (err){
            console.log(err);
            if (err.code == 'ER_DUP_ENTRY')
                return 1;
            else
                return 2;
        }
    }

    // Method To Update Existing User
    async user_update(body, user_id){
        try {
            await db.query("UPDATE login SET username = ? WHERE BINARY id = ?", [body["username"], user_id]);
            await db.query("UPDATE user_info SET email = ?, phone_number = ?, address = ?, age = ? WHERE BINARY id = ?", [body["email"], body["phone"], body["address"], body["age"], user_id]);
            return 0;
        } catch (err) {
            console.log(err);
            return 1;
        }
    }

    // Method To Insert New Task Into DATABASE
    async task_insertion(body, user_id){
        this.description = body["description"];
        this.deadline = body["deadline"];
        try {
            await db.query("INSERT INTO todo (user_id, description, deadline, status) VALUES (?, ?, ?, ?)", [user_id, this.description, this.deadline, false]);
            return 0;
        } catch (err){
            if (err.code == 'ER_DUP_ENTRY')
                return 1;
            else
                return 2;
        }
    }
}

module.exports = {
    InsertDB
}
