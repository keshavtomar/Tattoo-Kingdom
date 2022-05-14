const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const path = require('path');
const { requireAuth, checkUser } = require('../middleware/auth_middleware');

router.get('*', checkUser);

router.get('/', (req, res)=>{
    res.render('index');
})

router.get('/contactus', (req, res)=>{
    res.render('contactus');
})

router.get('/form', (req,res)=>{
    res.render('Form');
})

router.get('/login-artist', (req,res)=>{
    res.render('loginArt');
})

router.get('/check', (req,res)=>{
    res.render('check');
})

router.get('/login-user', (req,res)=>{
    res.render('login-user');
})

router.get('/register', (req,res)=>{
    res.render('register');
})

router.get('/', (req,res)=>{
  res.render('index');
})

module.exports = router;
