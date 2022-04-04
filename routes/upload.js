const express = require('express');
const router = express.Router();
const path = require('path');
const mysql = require('mysql');
// const connectdb = require('../config/db.js');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.post('/appoint', (req, res)=>{
    console.log(req.body);

    const first = req.body.first;
    const last = req.body.last;
    const gender = req.body.gender;
    const dob = req.body.dob;
    const email = req.body.email;
    const phone = req.body.phone;
    const timing = req.body.timing;
    const artist = req.body.artist;


    db.query('INSERT INTO APPOINT SET ?', { first:first, last:last, gender:gender, dob:dob, email:email, phone:phone, timing:timing, artist:artist}, (err, results)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(results);
            res.redirect('/');
        }
    })

    
})


module.exports = router;
