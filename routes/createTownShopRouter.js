var express = require('express');
var session = require('cookie-session');
const {maxAge, checkLogin, postLogin} = require('./loginMiddleware');

const {getShopModel} = require('../models/models');

module.exports = function createTownShopRouter(town) {
    const shop = {
        tag: town.tag,
        name: `${town.name} shop`,
    };

    const ShopModel = getShopModel(town);

    var router = express.Router();

    router.use(session({
        name: 'shop',
        secret: 'shop',
        maxAge: maxAge,
    }));

    router.use(checkLogin(shop));

    router.get('/', (req, res) => {
        ShopModel.findOne((err, shop) => {
            if(err)
                res.send(err);
            else
                res.send(shop);
        });
    });

    router.get('/login', function(req, res, next) {
        res.render('login', shop);
    });

    router.post('/login', express.urlencoded({extended: false}), postLogin(shop));

    return router;
};