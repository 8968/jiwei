const express = require('express');
const session = require('cookie-session');
const mongoose = require('mongoose');
const Fawn = require('fawn');

const {maxAge, checkLogin, postLogin} = require('./loginMiddleware.js');

const {ShopModel, getPkhModel, getVillageModel, getDetailModel} = require('../models/models');

module.exports = function createVillageRouter(town, village) {
    const PkhModel = getPkhModel(town.tag);
    const VillageModel = getVillageModel(town.tag);
    const DetailModel = getDetailModel(town.tag);

    const router = express.Router();

    router.use(session({
        name: 'town',
        secret: 'town',
        maxAge: maxAge,
    }));

    router.use(checkLogin(village));

    router.get('/', function(req, res) {
        PkhModel.find({village: village.tag}).then( (pkhs) => {
            res.render('village.ejs', {pkhs: pkhs, village: village});
        });
    });

    router.get('/login', function (req, res) {
        res.render('login', {name: village.name});
    });

    router.post('/login', express.urlencoded({extended: false}), postLogin(village));

    router.get('/operate/:pkhId', function (req, res) {

        PkhModel.findOne({id: req.params.pkhId}).then( pkh => {
           res.render('villagePkh.ejs', {pkh: pkh});
        });
    // .then((result) => {
    //         res.send(result);
    //     }).catch((err) => {
    //         res.send(err);
    });

    router.post('/operate/:pkhId', express.urlencoded({extended: false}), (req, res) => {
        PkhModel.findOne({id: req.params.pkhId}).then( pkh => {
            let task = Fawn.Task();
            task.update(PkhModel, {id: pkh.id}, {$inc: {income: req.body.value}})
                .update(VillageModel, {village: village.tag}, {$inc: {income: req.body.value}})
                .update(ShopModel, {town: town.tag}, {$inc: {income: req.body.value}})
                .save(DetailModel,
                    {
                        village: pkh.village,
                        id: pkh.id,
                        name: pkh.name,
                        type: 1,
                        value: req.body.value,
                        description: req.body.des,
                    })
                .run({useMongoose: true})
                .then((result) => {
                    res.send(result);
                }).catch((err) => {
                    res.send(err);
                });
        });
    });

    function add (pkhId, value, des) {
        return PkhModel.findOne({id: pkhId}).then( pkh => {
        let task = Fawn.Task();
        task.update(PkhModel, {id: pkh.id}, {$inc: {income: value}})
            .update(VillageModel, {village: village.tag}, {$inc: {income: value}})
            .update(ShopModel, {town: town.tag}, {$inc: {income: value}})
            .save(DetailModel,
                {village: pkh.village,
                    id: pkh.id,
                    name: pkh.name,
                    type: 1,
                    value: value,
                    description: des
                })
            .run({useMongoose: true});
        });
    }

    return router;
};