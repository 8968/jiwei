const express = require('express');
const {AdminModel} = require('../models/models');

const path = require('path');

let router = express.Router();

router.get('/', (req, res) => {
    res.render('changePassword',{name: 'abc'});
});

router.post('/', express.urlencoded({extended: false}), (req, res) => {
    console.log(req.body.psd);
    console.log(req.body.newpsd);
    console.log(req.baseUrl);
    let psd = req.body.psd, newpsd = req.body.newpsd;
    let ctlPath = path.dirname(req.baseUrl);

    AdminModel.findOne({baseUrl: ctlPath}, (err, admin) => {
        console.log(err);
    });

    //返回上级目录
    res.redirect(path.join(req.baseUrl, './'));
});

module.exports = router;