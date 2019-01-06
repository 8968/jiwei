//初始化用户和密码
const db = require('../connect.js');
const models = require('../models.js');

//读取配置文件
const county = require('../../countys/tangyin');

//add county admin
var countyAdmin = new models.AdminModel({
    baseUrl: `/${county.tag}/ctl`,
    psd: county.tag,
});
countyAdmin.save((err, admin) => {
    if(err)
        console.log(err);
});

//add town admins
for(const town of county.towns) {
    let townAdmin = new models.AdminModel({
        //tangying/ctl/login    tangyin/fudao/ctl/login     tangyin/fudao/huiquan/login
        baseUrl: `/${county.tag}/${town.tag}/ctl`,
        psd: town.tag,
    });
    townAdmin.save((err, user) => {
        if(err)
            console.log(err);
    });

    let shopAdmin = new models.AdminModel({
        baseUrl: `/${county.tag}/${town.tag}/shop/ctl`,
        psd: town.tag,
    });
    shopAdmin.save((err, admin) => {
        if(err)
            console.log(err);
    });

    //add village admins
    for(const village of town.villages) {
        let villageAdmin = new models.AdminModel({
            baseUrl: `/${county.tag}/${town.tag}/${village.tag}`,
            psd: village.tag,
        });
        villageAdmin.save((err, admin) => {
            if(err)
                console.log(err);
        })
    }
}