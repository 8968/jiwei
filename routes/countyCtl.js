const express = require('express');
const session = require('cookie-session');
const {maxAge, checkLogin, postLogin} = require('./loginMiddleware.js');

const county = require('../countys/fudao');
const {ShopModel} = require('../models/models');

const router = express.Router();
/* GET users listing. */
router.use(session({
    name: 'county',
    secret: 'county',
    maxAge: maxAge,
}));

router.use(checkLogin(county));

router.get('/', function(req, res, next) {
    // res.send('county ctl');
    ShopModel.find().then((shops) => {
        res.render('countyCtl.ejs', {shops: shops});
    })
});

router.get('/login', function (req, res, next) {
    res.render('login', county);
});

router.post('/login', express.urlencoded({extended: false}), postLogin(county));

module.exports = router;