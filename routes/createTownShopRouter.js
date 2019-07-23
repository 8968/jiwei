var express = require('express');
var session = require('cookie-session');
var Fawn = require('fawn');

const {maxAge, checkLogin, postLogin} = require('./loginMiddleware');
const {ShopModel, getVillageModel, getPkhModel} = require('../models/models');

module.exports = function createTownShopRouter(town) {
    const shop = {
        tag: town.tag,
        name: `${town.name} shop`,
    };

    let PkhModel = getPkhModel(town.tag);

    var router = express.Router();

    router.use(session({
        name: 'shop',
        secret: 'shop',
        maxAge: maxAge,
    }));

    router.use(checkLogin(shop));

    router.get('/', (req, res) => {
        ShopModel.findOne({town: shop.tag})
            .then( (shop) => {
                let VillageModel = getVillageModel(town.tag);
                VillageModel.find().then((villages) => {
                    res.render('townShop.ejs', {shop: shop, villages: villages});
                });
            });
    });

    router.get('/login', function(req, res, next) {
        res.render('login', shop);
    });

    router.post('/login', express.urlencoded({extended: false}), postLogin(shop));

    router.get('/villageList', (req, res) => {
        res.render('shopVillageList.ejs', {villages: town.villages} );
    });

    // router.get('/:village', (req, res) => {
    // });

    router.get('/pkh', (req, res) => {
        // let task = Fawn.Task();
        // task.update(PkhModel, {id: req.params.pkhid}, {$inc: {income: -5}})
        //     .update(PkhModel, {id: req.params.pkhid}, {$inc: {expense: 5}})
        //     .run()
        //     .then((result) => {
        //     res.send(result);
        //     }).catch((err) => {
        //     res.send(err);
        //     });
            PkhModel.findOne({id: req.query.id}).then( (pkh) => {
                res.render('shopPkh.ejs', {pkh: pkh});
            });
    });

    router.post('/pkh', express.urlencoded({extended: false}), (req, res) => {
        return PkhModel.findOne({id: pkhId}).then( pkh => {
            let task = Fawn.Task();
            task.update(PkhModel, {id: pkh.id}, {$inc: {expense: req.body.value}})
                .update(VillageModel, {village: village.tag}, {$inc: {expense: req.body.value}})
                .update(ShopModel, {town: town.tag}, {$inc: {expense: value}})
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
        res.send(req.body);
    });

    return router;
};