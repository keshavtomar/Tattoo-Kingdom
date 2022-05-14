const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
dotenv.config({ path: './.env'});
const mysql = require('mysql');



const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt; 
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
            if(err){
                console.log(' You are not logged in.');
                res.redirect("/");
            }
            else{
                console.log(decoded);
                next();
            }
        });
    }   
    else{
        res.redirect('/');
    }
}


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
            if(err){
                console.log(err);       // if there are err, then there is no user loggedin so we just moved on to next handler.
                res.locals.user = null;
                next();
            }
            else{
                let user = decoded.name;
                res.locals.user = user;
                next(); 
            }
        })
    }
    else{
        res.locals.user = null;  
        next();
    }
}


module.exports = { requireAuth, checkUser };