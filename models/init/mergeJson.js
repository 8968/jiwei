//合并各村贫困户到 pkhs.json, 并产生villages.json
let fs = require('fs');
let path = require('path');
let program = require('commander');

program
    .version('0.1.0')
    .option('-d, --dir <string>', ' 县级目录', String)
    .parse(process.argv);

// if(!program.dir)
//     program.help();
program.dir = 'tangyin';
let townDirs = fs.readdirSync(program.dir);

for(let townDir of townDirs) {
    if(townDir.startsWith('.'))
        continue;

    let villageFiles = fs.readdirSync(path.join(program.dir, townDir));

    let pkhs = [];
    let villages = [];
    for(let villageFile of villageFiles) {
        if(!villageFile.endsWith('json'))
            continue;

        let content = fs.readFileSync(path.join(program.dir, townDir, villageFile), 'utf8');
        let jsons = JSON.parse(content);
        let incomeAmount = expenseAmount = 0;

        for(let json of jsons) {
            keys = Object.keys(json);
            if(keys.length != 4 ||
                typeof(json[keys[2]]) != 'number' ||
                typeof(json[keys[3]]) != 'number' ) {
                console.log(`err: ${program.dir}/${townDir}/${villageFile}` + JSON.stringify(json));
                process.exit(-1);
            }
            incomeAmount += json[keys[2]];
            expenseAmount += json[keys[3]];
            if(isNaN(incomeAmount) || isNaN(expenseAmount)){
                console.log(`err: ${program.dir}/${townDir}/${villageFile}` + JSON.stringify(json));
                console.log(incomeAmount);
                console.log(expenseAmount);
                process.exit(-1);
            }
            let pkh = {};
            pkh.id = String(json[keys[0]]);
            pkh.name = json[keys[1]];
            pkh.village = path.basename(villageFile, '.json');
            pkh.income = json[keys[2]];
            pkh.expense = json[keys[3]];
            pkhs.push(pkh);
        }

        let village = {};
        village.village = path.basename(villageFile, '.json');
        village.income = incomeAmount;
        village.expense = expenseAmount;
        villages.push(village);
    }

    if(!fs.existsSync(path.join(program.dir, '.out')))
        fs.mkdirSync(path.join(program.dir, '.out'));

    fs.writeFileSync(path.join(program.dir, '.out', `${townDir}-pkhs.json`), JSON.stringify(pkhs));
    fs.writeFileSync(path.join(program.dir, '.out', `${townDir}-villages.json`), JSON.stringify(villages));
}

let villageFiles = fs.readdirSync(path.join(program.dir, '.out')).filter( file => file.indexOf('villages') != -1);

let shops = [];

for( let villageFile of villageFiles) {
    let content = fs.readFileSync(path.join(program.dir, '.out', villageFile));
    let villages = JSON.parse(content);

    let shop = {};
    shop.income = 0;
    shop.expense = 0;
    shop.town = villageFile.split('-')[0];
    for(let village of villages) {
        shop.income += village.income;
        shop.expense += village.expense;
    }

    shops.push(shop);
}

fs.writeFileSync(path.join(program.dir, '.out', 'shops.json'), JSON.stringify(shops))