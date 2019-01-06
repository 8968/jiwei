const db = require('../connect');
const {getShopModel} = require('../models');
const county = require('../../countys/tangyin');

for(const town of county.towns) {
    const ShopModel = getShopModel(town);
    const shop = new ShopModel({
        count: Math.random() * 100,
        deals: null,
    });

    shop.save((err, shop) => {
        if(err)
            console.log(err);
    });
}