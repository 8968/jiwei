const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const tangyin = require('../countys/fudao');

//乡镇和村级数据结构一样，以collection为单位，下面的12个分项对应document

//type: 1 text 2 图片url

var paragraphSchema = new mongoose.Schema({ type: Number, content: String});
var newsSchema = new mongoose.Schema({
    type: Number,
    date: {type: Date, default: Date.now},
    title: String,
    body: [paragraphSchema]
});

//县级collection，名称无前缀
//县，乡，村 管理员以baseUrl来区分类型 collection name: admins
var adminSchema = new mongoose.Schema({
    //以req.baseUrl来判断用户的类型
    baseUrl: {type: String, index: true, unique: true},
    psd: String,    //默认为本级单位的tag
});

//把shop当作乡级单位来看（记录全乡的总分值）, collection name: shops
let shopSchema = new mongoose.Schema({
    //town.tag
    town: {type: String, index: true, unique: true},
    income: Int32,
    expense: Int32,
});

//乡级collection，名称前有各乡镇的tag前缀
//collection name: ${town}.pkhs
var pkhSchema = new mongoose.Schema({
    //身份证
    id: {type: String, index: true, unique: true},
    name: String,
    village: String,    //village.tag
    income: Int32,    //收入 正值
    expense: Int32,   //花销 正值
});

//村记录总分用 collection name: ${town}.villages
var villageSchema = new mongoose.Schema({
    //village.tag
    village: {type: String, index: true, unique: true},
    income: Int32,    //收入 正值
    expense: Int32,   //支出 正值
});

//交易记录，加减分详细记录 collection name: ${town}.details
var detailSchema = new mongoose.Schema({
    village: String,
    //用户的id
    id: String,
    name: String,
    //正值表加分，负值表消费
    type: Int32, //1 表示income，2 表示expense
    value: Int32,
    //init income, init expense, income, expense,
    description: String,
});

var pkhModels = new Map(), villageModels = new Map(), detailModels = new Map();
for(let town of tangyin.towns) {
    pkhModels.set(town.tag, mongoose.model(`${town.tag}.Pkh`, pkhSchema));
    villageModels.set(town.tag, mongoose.model(`${town.tag}.Village`, villageSchema));
    detailModels.set(town.tag, mongoose.model(`${town.tag}.Detail`, detailSchema));
}

function pinkunhuModel(townTag) {
    // return mongoose.model(`${townTag}.Pkh`, pkhSchema);
    return pkhModels.get(townTag);
}

function villageModel(townTag) {
    // return mongoose.model(`${townTag}.Village`, villageSchema);
    return villageModels.get(townTag);
}

function detailModel(townTag) {
    // return mongoose.model(`${townTag}.Detail`, detailSchema);
    return detailModels.get(townTag);
}

var AdminModel = mongoose.model('Admin', adminSchema);
var ShopModel = mongoose.model('Shop', shopSchema);

module.exports = {
    //
    AdminModel: AdminModel,
    ShopModel: ShopModel,
    //
    getPkhModel: pinkunhuModel,
    getVillageModel: villageModel,
    getDetailModel: detailModel,
};