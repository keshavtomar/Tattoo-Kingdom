const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path : './.env'});



function connectdb(){
    const db = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    });
    db.connect((err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Database Connected Successfully...");
        }
    });
}

module.exports = connectdb;