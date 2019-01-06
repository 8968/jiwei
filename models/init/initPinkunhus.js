/*
贫困户信息文件结构
tangyin
    fudao
        sima.xlsx
        huiquan.xlsx
    yigou
        yijie.xlsx
        erjie.xlsx

贫困户xlsx文件结构:
excel第一行 生份证号 姓名 收入 花销
           123     zs  12  10
           234     ls  10  5
最后一行内容 共计         xxx xxx

运行命令格式：
node initPinkunhus.js -d tangyinDir
*/

const program = require('commander');
const parseXlsx = require('excel').default;
// const db = require('../connect');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const {getPinkunhuModel} = require('../models');

program
    .version('0.1.0')
    .option('-d, --dir <string>', '县级目录', String)
    .option('-s, --save-to-db', '存储到数据库，如无此参数则默认生成json文件')
    .parse(process.argv);

//必须是dir，没有d
if (!program.dir)
    program.help();

let towns = readdirSync(program.dir);

function toJson(source, destination) {

}
for (let town of towns) {
    if (!town.startsWith('.')) {
        console.log('town: ' + town);
        let townDir = path.join(program.dir, town);

        let villages = fs.readdir(townDir);
        for (let village of villages) {
            if(!program.saveToDb) {
                if (!village.startsWith('.') && vilalge.endsWith('.xlsx')) {
                    console.log('village: ' + village);

                parseXlsx(program.source).then((data) => {
                    //去除头部说明文字的一行
                    let count = data[data.length-1];
                    let pinkunhus = data.slice(1, -1);

                    //检查总数
                    let incomeCount = 0;
                    let expenseCount = 0;

                    for(let pkh of pinkunhus) {
                        incomeCount += pkh[2];
                        expenseCount += pkh[3];
                    }

                    if(count[2] != incomeCount || count[3] != expenseCount) {
                        console.log(`village: ${village} count err`);
                        return;
                    }

                    let json = {};
                    json.pinkunhus = pinkunhus;
                    json.count = {income: incomeCount, expenseCount: expenseCount};
                    json.vilalge = village;

                    fs.writeFile(path.json())


                const PinkunhuModel = getPinkunhuModel({tag: town});

                for (const pinkunhu of pinkunhus) {
                    let pkh = new PinkunhuModel({
                        id: pinkunhu[0],
                        name: pinkunhu[1],
                        village: village,
                        income: pinkunhu[2],
                        expense: pinkunhu[3],
                    });

                    pkh.save().catch((err) => {
                        console.log(`village: ${village} save err`);
                        console.log(err);
                    });
                }
            });
        }
    }
}

