const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const path = require('path');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { table } = require('console');
const { requireAuth, checkUser } = require('../middleware/auth_middleware');

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get('*', checkUser);

router.get('/login', (req, res)=>{
    res.render('login-admin');
})

router.get('/add/artist', requireAuth, (req, res)=>{
    res.render('add-artist');
})

router.get('/create/new', requireAuth, (req, res)=>{
    res.render('admin-register');
})

const adminemail = "xyz@gmail.com";
const adminpassword = "dbmsproject";

router.post('/login/admin/data', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const maxAge = 3 * 24 * 60 * 60;
    db.query('SELECT * FROM ADMIN WHERE EMAIL=?', [email], async (err, results, fields) => {

        if (err) {
            console.log(err);
        }
        else if (results.length > 0) {
            const comparison = await bcrypt.compare(password, results[0].password);
            if (comparison) {
                const token = jwt.sign({ user_id: results[0].user_id, name: results[0].name },
                    process.env.SECRET_KEY, { expiresIn: maxAge });

                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                console.log(token);
                res.render('admin');
            }
            else {
                res.render('login-admin', {
                    message: 'Incorrect Email and Password.'
                });
            }
        }
        else {
            res.render('login-admin', {
                message: "Email doesn't Exists."
            });
        }
    })


})


router.post('/register/artist', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const cpass = req.body.cpassword;

    db.query('SELECT EMAIL FROM WORKER WHERE EMAIL = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
        }
        if (results.length > 0) {
            return res.render('add-artist', {
                message: "That Email is already taken."
            });
        }
        else if (password !== cpass) {
            return res.render('add-artist', {
                message: "Passwords are different."
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO WORKER SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                const maxAge = 3 * 24 * 60 * 60;
                db.query('SELECT * FROM WORKER WHERE EMAIL=?', [email], async (err, result2, fields) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        const token = jwt.sign({ user_id: result2[0].user_id, name: result2[0].name },
                            process.env.SECRET_KEY, { expiresIn: maxAge });
                        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                        res.render('admin');
                    }
                })  
            }
        })

    })
})


router.post('/newAdmin/data', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const cpass = req.body.cpassword;

    db.query('SELECT EMAIL FROM ADMIN WHERE EMAIL = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
        }
        if (results.length > 0) {
            return res.render('admin-register', {
                message: "That Email is already taken."
            });
        }
        else if (password !== cpass) {
            return res.render('admin-register', {
                message: "Passwords are different."
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO ADMIN SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                const maxAge = 3 * 24 * 60 * 60;
                db.query('SELECT * FROM ADMIN WHERE EMAIL=?', [email], async (err, result2, fields) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        const token = jwt.sign({ user_id: result2[0].user_id, name: result2[0].name },
                            process.env.SECRET_KEY, { expiresIn: maxAge });
                        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                        res.render('admin');
                    }
                })  
            }
        })

    })
})

module.exports = router;