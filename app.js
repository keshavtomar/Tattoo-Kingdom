const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: './.env'});

const app = express();

app.use(express.urlencoded({ extended:true }));
// app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');
// const imgDirectory = path.join(__dirname, './public/img')
const publicDirectory = path.join(__dirname, './public');  
// app.use(express.static(imgDirectory));
app.use(express.static(publicDirectory));  


app.use(express.json());         // now it parse JSON data too.

//  define routes
app.use('/', require('./routes/pages'));



const PORT = process.env.PORT || 3005;
app.listen(PORT, ()=>{
    console.log(`Server is stated at Port : ${PORT}`);
});