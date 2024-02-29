#!/usr/bin/node
const express = require('express');
const session = require('express-session');
const db = require('./database/db.js');
const functions = require('./functions/functions.js');
const bcrypt = require('bcrypt');
const path = require('path');
const cookieParser = require('cookie-parser');
const classes = require('./functions/classes.js')
const db_insertion = new classes.InsertDB();
const app = express();
const PORT = "3000";


// Session Middleware
app.use(session({
    secret: functions.key_generator(),
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: "/",
    }
}));


// EJS configurations
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/static/html'));

// Server Middlewares
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '/static/js')));
app.use(express.static(path.join(__dirname, '/static/css')));
app.use(express.static(path.join(__dirname, '/static/images')));


// DB INIT
db.init();

// Home Page
app.get('/', (req, res) => {
    res.render('home');
});

// Signup Page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// User's Page
app.get("/user/:username", (req, res) => {
    const user_url = req.url.slice(6, req.url.includes('/', 6) && req.url.length - 1 || undefined )
    if (req.session.user !== undefined && req.session.user === user_url){
        res.render('user', {user: req.session.user});
    } else {
        res.redirect("/");
    }
});

// User's Settings Page
app.get("/user/:username/settings", async (req, res) => {
    const user_url = req.url.slice(6, req.url.lastIndexOf('/'));
    const user_obj = await db.query("SELECT login.username, user_info.email, user_info.phone_number, user_info.address, user_info.age FROM login JOIN user_info ON login.id = user_info.id WHERE login.username = ?", [req.session.user]);
    if (req.session.user !== undefined && req.session.user === user_url){
        res.render('settings', user_obj[0]);
    } else {
        res.redirect("/");
    }
});


// Login API
app.post('/api/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const result = await (db.query("SELECT password FROM login WHERE BINARY username = ?", [username]));
    if (result.length != 0 && await bcrypt.compare(password, result[0]['password']))
    {
        req.session.user = username;
        req.session.cookie.path = `/user/${username}`;
        if (req.headers.checkbox == "true")
        {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        }
        else
        {
            req.session.cookie.expires = false;
        }
        res.status(200).redirect(`/user/${username}`);
    }
    else
    {
        res.status(400).send();
    }
});

// Signup API
app.post("/api/signup", async (req, res) => {
    const result = await db_insertion.user_insertion(req.body);
    if (result == 0) {
        res.status(200).send();
    } else if (result == 1) {
        res.status(409).send();
    } else {
        res.status(500).send();
    }
});


// API To Get User's ID
app.get("/user/:username/user_id", async (req, res) => {
    const user = req.session.user;
    if (user) {
        const user_id = await db.query("SELECT id FROM login WHERE BINARY username = ?", [user]);
        res.send(user_id);
    } else {
        res.redirect("/");
    }
});

// API To Get User's Tasks
app.get("/user/:username/tasks", async (req, res) => {
    const user = req.session.user;
    if (user) {
        const tasks = await db.query("SELECT task_id, description, deadline, status FROM todo WHERE user_id = ?", req.headers.user_id);
        res.send(tasks);
    } else {
        res.redirect("/");
    }
});

// API To Add Task To A User In A DATABASE
app.post("/user/:username/add_task", async (req, res) => {
    if (req.session.user)
    {
        const result = await db_insertion.task_insertion(req.body, req.headers.user_id);
        if (result == 0) {
            res.status(200).send();
        } else if (result == 1) {
            res.status(409).send();
        } else {
            res.status(500).send();
        }
    }
    else
    {
        res.redirect("/");
    }
});

// API To Update User's Info
app.post("/user/:username/api/settings", async (req, res) => {
    const result = await db_insertion.user_update(req.body, req.headers.user_id);
    if (result === 0) {
        res.status(200).send();
    } else {
        res.status(409).send();
    }
});


// API To Delete User's Task
app.delete('/user/:username/delete_task', async (req, res) => {
    if (req.session.user){
        const task_id = Number(req.headers.task_id);
        await db.query('DELETE FROM todo WHERE task_id = ?', [task_id]);
        res.status(200).send();
    } else {
        res.redirect("/");
    }
});

// API To Check User's Task
app.put('/user/:username/check_task', async (req, res) => {
    if (req.session.user){
        const task_id = Number(req.headers.task_id);
        await db.query('UPDATE todo SET status = ? WHERE task_id = ?', [true, task_id]);
        res.status(200).send();
    } else {
        res.redirect("/");
    }
});

// API To Logout Or Terminate Session
app.get('/user/:username/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

// App Listening Port
app.listen(PORT, () => {
    console.log(`Server Is Running On Port ${PORT}`);
});
