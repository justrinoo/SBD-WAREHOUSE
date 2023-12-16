var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    const username = req.session.username;

    // res.render('users/index', {
    //     title: '',
    //     message: '',
    // });
    return res.render('index', {
        title: 'Warehouse | Home',
        message: '',
        username,
    });
});
module.exports = router;
