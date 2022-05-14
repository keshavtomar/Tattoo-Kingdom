const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
dotenv.config({ path: './.env'});

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended:true }));
// app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');
// const imgDirectory = path.join(__dirname, './public/img')
const publicDirectory = path.join(__dirname, './public');
// app.use(express.static(imgDirectory));
app.use(express.static(publicDirectory));


app.use(express.json());         // now it parse JSON data too.


const connectdb = require('./config/db.js');
const { dirname } = require('path');
connectdb();




//  define routes
app.use('/', require('./routes/pages'));
app.use('/form', require('./routes/upload'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/administration'));
app.get('/artists',(req,res)=>{
    res.render('artists');
})


const PORT = process.env.PORT || 3005;
app.listen(PORT, ()=>{
    console.log(`Server is stated at Port : ${PORT}`);
});
