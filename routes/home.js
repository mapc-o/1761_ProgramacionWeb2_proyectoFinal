var express = require('express');
var router = express.Router();
var pool = require('../db');
var lookup = require('../helpers/lookup');
var formato = require('../helpers/formato');

function loginRequerido(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  next();
}

router.get('/', loginRequerido, async (req, res, next)=> {
    let user_id = req.session.user_id;
    let [symbols] = await pool.execute("SELECT symbol FROM purchases WHERE user_id = ? GROUP BY symbol", [user_id]);
    let data = [];
    for (let symbol of symbols) {
        let curr = symbol.symbol;
        let [sharesQuery] = await pool.execute("SELECT SUM(shares) AS shares FROM purchases WHERE user_id = ? AND symbol = ?", [user_id, curr]);
        let shares = parseInt(sharesQuery[0].shares) || 0;
        let stock = await lookup(curr);
        let price = stock.price;
        data.push({
            symbol: curr,
            shares, price,
            total: formato(price * shares)
        });


    }
    let nuevo_user = req.session.nuevo_user;
    req.session.nuevo_user = false;

    res.render('home', { title: 'Home', stocks:data, nuevo_user, error: 'Usuario inválido'});
});


module.exports = router;
