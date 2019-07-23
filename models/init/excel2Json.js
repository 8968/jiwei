//transform excel to json, the extended name must be xlsx.

let fs = require('fs');
let path = require('path');
let program = require('commander');
let convertExcel = require('excel-as-json').processFile;

program
    .version('0.1.0')
    .option('-d, --dir <string>', ' 转换整个目录下的excel文件', String)
    .option('-f, --file <string>', '转换单个excel文件', String)
    .parse(process.argv);

// if(!program.dir && !program.file)
//     program.help();
if(program.dir)
    walkDirSync(program.dir, convertFile);
else if(program.file)
    convertFile(program.file);

function convertFile(path) {
    let des = path.replace('.xlsx', '.json');
    convertExcel(path,des);
}
function walkDirSync(dir, handleFile) {
    let entrys = fs.readdirSync(dir,{withFileTypes: true});

    for(let entry of entrys) {
        if(entry.isFile() && path.extname(entry.name) == '.xlsx')
            handleFile(path.join(dir,entry.name));
        if(entry.isDirectory())
            walkDirSync(path.join(dir, entry.name), handleFile);
    }
}