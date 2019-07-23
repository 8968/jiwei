//初始化${town}.pkhs ${town}.villages shops
const db = require('../connect.js');
const models = require('../models.js');
const fs = require('fs');
const path = require('path');

let program = require('commander');

program
    .version('0.1.0')
    .option('-d, --dir <string>', ' 县级目录', String)
    .parse(process.argv);

async function insertDatas() {
    let shops = JSON.parse(fs.readFileSync(path.join(program.dir, '.out', 'shops.json')));
    const ShopModel = models.ShopModel;
    await ShopModel.insertMany(shops);

    let files = fs.readdirSync(path.join(program.dir, '.out'))
        .filter((file) => file.indexOf('-') != -1);

    for(let file of files) {
        let arr = file.split('-');
        let content = await fs.promises.readFile(path.join(program.dir, '.out', file));
        if('pkhs.json' == arr[1]) {
            const PkhModel = models.getPkhModel(arr[0]);
            await PkhModel.insertMany(JSON.parse(content));
        } else if('villages.json' == arr[1]) {
            const VillageModel = models.getVillageModel(arr[0]);
            await VillageModel.insertMany(JSON.parse(content));
        }
    }
    db.close();
}

insertDatas();