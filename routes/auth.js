const express = require('express');
const router = express.Router();
const path = require('path');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { table } = require('console');
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './.env'});
const { requireAuth, checkUser } = require('../middleware/auth_middleware');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.post('/register-user', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const cpass = req.body.cpassword;

    db.query('SELECT EMAIL FROM users WHERE EMAIL = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
        }
        if (results.length > 0) {
            return res.render('register', {
                message: "That Email is already taken."
            });
        }
        else if (password !== cpass) {
            return res.render('register', {
                message: "Passwords are different."
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO USERS SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                const maxAge = 3 * 24 * 60 * 60;
                db.query('SELECT * FROM USERS WHERE EMAIL=?', [email], async (err, result2, fields) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        const token = jwt.sign({ user_id: result2[0].user_id, name: result2[0].name },
                            process.env.SECRET_KEY, { expiresIn: maxAge });
                        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                        res.render('index', {User:result2[0].name});
                    }
                })
            }
        })

    })
})


router.post('/login-user', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const maxAge = 3 * 24 * 60 * 60;
    db.query('SELECT * FROM USERS WHERE EMAIL=?', [email], async (err, results, fields) => {

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
                let email = results[0].email;
                db.query(`SELECT * FROM APPOINT WHERE EMAIL =?`, [email], (err, data, fields)=>{
                    if(err){
                        throw err;
                    }
                    else{
                        console.log(data);
                        if(data.length!=0){
                            res.render('user-acc', {data : data, user: data[0].first });
                        }
                        else{
                            res.redirect('/');
                        }
                    }
                })
            }
            else {
                res.render('login-user', {
                    message: 'Incorrect Email and Password.'
                });
            }
        }
        else {
            res.render('login-user', {
                message: "Email doesn't Exists."
            });
        }
    })


})


router.post('/login/artist', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const maxAge = 3 * 24 * 60 * 60;
    db.query('SELECT * FROM WORKER WHERE EMAIL=?', [email], async (err, results, fields) => {

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
                let artist = results[0].name;
                let table;
                if (artist == "Martin Luther") {
                    table = 'ARTIST1';
                }
                else if (artist == "John Lamba") {
                    table = "ARTIST2";
                }
                else if (artist == "Bill Gates") {
                    table = "ARTIST3";
                }
                db.query(`SELECT * FROM ${table}`, (err, result, fields)=>{
                    if(err){
                        throw err;
                    }
                    console.log(result);
                    return res.render('artist-acc', { artist:artist,  data : result});
                })
            }
            else {
                res.render('loginArt', {
                    message: 'Incorrect Email and Password.'
                });
            }
        }
        else {
            res.render('loginArt', {
                message: "Email doesn't Exists."
            });
        }
    })


})

router.get('/logout', (req, res)=>{
    res.cookie('jwt', '', {maxAge:1});
    res.redirect('/');
})


module.exports = router;