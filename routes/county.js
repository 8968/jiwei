var express = require('express');
var createTownRouter = require('./createTownRouter');
var countyCtlRouter = require('./countyCtl');

var county = require('../countys/tangyin.js');

var router = express.Router();
router.use('/ctl', countyCtlRouter);

//
for(var town of county.towns) {
      router.use('/' + town.tag, createTownRouter(town));
}

module.exports = router;