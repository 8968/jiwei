const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');

//collection name: ${town}.pinkunhus
var pinkunhuSchema = new mongoose.Schema({
    //身份证
    id: {type: String, index: true, unique: true},
    name: String,
    village: String,    //village.tag
    income: Int32,    //收入 正值
    expense: Int32,   //花销 正值
});

//村记录总分用 collection name: ${town}.villages
var villageSchema = new mongoose.Schema({
    //village.tag/'shop'
    village: {type: String, index: true, unique: true},
    income: Int32,    //收入 正值
    expense: Int32,   //支出 正值
});

//把shop当作乡级单位来看（记录全乡的总分值）, collection name: shops
let shopSchema = new mongoose.Schema({
    //town.tag
    town: {type: String, index: true, unique: true},
    income: Int32,
    expense: Int32,
});

//加减分详细记录 collection name: ${town}.details
//加分 s:village.tag d:贫困户id p:分值 d:des
//兑换商品 s:贫困户id d:'shop' p:分值 d:des
var detailSchema = new mongoose.Schema({
    source: String,
    destination: String,
    payment: Int32, //正值
    description: String,
});

//县，乡，村 管理员以baseUrl来区分类型 collection name: admins
var adminSchema = new mongoose.Schema({
    //以req.baseUrl来判断用户的类型
    baseUrl: {type: String, index: true, unique: true},
    psd: String,
});

function pinkunhuModel(town) {
    return mongoose.model(`${town.tag}.Pinkunhu`, pinkunhuSchema);
}

function villageModel(town) {
    return mongoose.model(`${town.tag}.Village`, villageSchema);
}

function detailModel(town) {
    return mongoose.model(`${town.tag}.Detail`, detailSchema);
}

module.exports = {
    getPinkunhuModel: pinkunhuModel,
    getVillageModel: villageModel,
    getDetailModel: detailModel,
    AdminModel: mongoose.model('Admin', adminSchema),
    ShopModel: mongoose.model('Shop', shopSchema),
};