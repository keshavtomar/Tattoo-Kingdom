const express = require('express');
const router = express.Router();
const path = require('path');
const mysql = require('mysql');
const { table } = require('console');
// const connectdb = require('../config/db.js');

const app = express();


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.post('/appoint', (req, res) => {
    // console.log(req.body);

    const first = req.body.first;
    const last = req.body.last;
    const gender = req.body.gender;
    const dob = req.body.dob;
    const email = req.body.email;
    const phone = req.body.phone;
    const timing = req.body.timing;
    const artist = req.body.artist;


    var table_name;
    if (artist == "Martin Luther") {
        table_name = 'ARTIST1';
    }
    else if (artist == "John Lamba") {
        table_name = "ARTIST2";
    }
    else if (artist == "Bill Gates") {
        table_name = "ARTIST3";
    }


    db.query(`SELECT * FROM ${table_name} WHERE TIMING=?`, [timing], async function (err, result2, fields) {
        if (err) {
            throw err;
        }
        if (result2.length > 0) {
            if (result2) {
                res.render("Form", { message: "Artist1 is busy, Try another time." });
            }
        }
        else {
            db.query('INSERT INTO APPOINT SET ?', { first: first, last: last, gender: gender, dob: dob, email: email, phone: phone, timing: timing, artist: artist }, (err, results) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(results);
                    res.redirect("/");
                }
            })

            db.query(`INSERT INTO ${table_name} SET ?`, { customer: first, email: email, phone: phone, dateofappointment:dob, timing: timing }, (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(result);
                }
            });
        }
    })


})




module.exports = router;
