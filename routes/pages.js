const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const path = require('path');



router.get('/', (req, res)=>{
    res.render('index');   
})


router.get('/contactus', (req, res)=>{
    res.render('contactus');
})

router.get('/form', (req,res)=>{
    res.render('Form');
})

router.get('/artists', (req,res)=>{
    res.render('artists');
})

module.exports = router;
