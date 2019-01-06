var express = require('express');
var session = require('express-session');

var createTownShopRouter = require('./createTownShopRouter');
var createTownCtlRouter = require('./createTownCtlRouter');
var createVillageRouter = require('./createVillageRouter');

module.exports = function createTownRouter(town) {
    var router = express.Router();

    router.get('/', function(req, res, next) {
        res.send('town');
        // res.render('villageLogin', town);
    });

    router.use('/ctl', createTownCtlRouter(town));
    router.use('/shop', createTownShopRouter(town));

    for(var village of town.villages)
    router.use('/' + village.tag, createVillageRouter(town, village));

    return router;
};