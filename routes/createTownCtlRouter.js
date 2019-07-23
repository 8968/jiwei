const express = require('express');
const session = require('cookie-session');

var {maxAge, checkLogin, postLogin } = require('./loginMiddleware.js');

const {getVillageModel} = require('../models/models');

module.exports = function createTownCtlRouter(town) {
    const router = express.Router();
    router.use(session({
        name: 'town',
        secret: 'town',
        maxAge: maxAge,
    }));

    router.use(checkLogin(town));

    let VillageModel = getVillageModel(town.tag);
    router.get('/', (req, res) => {
        VillageModel.find().then( (villages) => {
            res.render('townCtl.ejs', {villages: villages});
        });
    });

    router.get('/login', function(req, res, next) {
        res.render('login', town);
    });

    router.post('/login', express.urlencoded({extended: false}), postLogin(town));

    return router;
}