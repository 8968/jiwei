const express = require('express');
const session = require('cookie-session');
const mongoose = require('mongoose');
const Fawn = require('fawn');

const {maxAge, checkLogin, postLogin} = require('./loginMiddleware.js');

const {getPinkunhuModel} = require('../models/models');

Fawn.init(mongoose);

module.exports = function createVillageRouter(town, village) {
    const router = express.Router();
    const PinkunhuModel = getPinkunhuModel(town);

    router.use(session({
        name: 'town',
        secret: 'town',
        maxAge: maxAge,
    }));

    router.use(checkLogin(village));

    router.get('/', function(req, res) {
        // PinkunhuModel.find({village: village.tag}).then((pkhs) => {
        //     res.send(pkhs);
        // });
        let task = Fawn.Task();
        task.update(PinkunhuModel, {id: '123'}, {$inc: {count: -5}})
            .update(PinkunhuModel, {id: '456'}, {$inc: {count: 5}})
            .run()
            .then((result) => {
            res.send(result);
            }).catch((err) => {
            res.send(err);
            });
    });

    router.get('/login', function (req, res) {
        res.render('login', village);
    });

    router.post('/login', express.urlencoded({extended: false}), postLogin(village));

    router.get('/:pinKunHuId', function (req, res) {
        res.send(req.params)
    });

    return router;
};