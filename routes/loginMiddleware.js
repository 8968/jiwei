//county , town , village 通用
const db = require('../models/connect.js');
const { AdminModel } = require('../models/models.js');

//将user 设置为baseUrl， 以此来判断是否登录
function checkLogin(target) {
    return (req, res, next) => {
        if (req.session.user == req.baseUrl || req.path == '/login')
            next();
        else
            res.redirect(req.baseUrl + '/login');
    }
}

function postLogin(target) {
    return (req, res, next) => {
        AdminModel.findOne({baseUrl: req.baseUrl})
            .then((admin) => {
                if (admin == null || admin.psd != req.body.psd) {
                    req.session.user = null;
                    res.render('login', target);
                }
                else {
                    req.session.user = req.baseUrl;
                    res.redirect(req.baseUrl);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

module.exports = {
    //cookie magAge 30 minute
    maxAge: 30 * 60 * 1000,
    checkLogin: checkLogin,
    postLogin: postLogin,
};