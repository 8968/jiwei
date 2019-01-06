const express = require('express');
const session = require('cookie-session');

var {maxAge, checkLogin, postLogin } = require('./loginMiddleware.js');

module.exports = function createTownCtlRouter(town) {
    const router = express.Router();
    router.use(session({
        name: 'town',
        secret: 'town',
        maxAge: maxAge,
    }));

    router.use(checkLogin(town));

    router.get('/', (req, res) => {
        res.send('town ctl');
    });

    router.get('/login', function(req, res, next) {
        res.render('login', town);
    });

    router.post('/login', express.urlencoded({extended: false}), postLogin(town));

    return router;
}