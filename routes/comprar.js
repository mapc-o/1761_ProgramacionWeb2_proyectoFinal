var express = require('express');
var router = express.Router();
var lookup = require('../helpers/lookup');
var pool = require('../db');

function loginRequerido(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  next();
}

router.get('/', loginRequerido, async (req, res, next)=> {
    let user_id = req.session.user_id;
    res.render('comprar', { title: 'Compra'});
});

router.post('/', async (req, res, next)=>{
    let user_id = req.session.user_id;
    let symbol = req.body.symbol;
    let shares = req.body.shares;
    let stock;

    if (!symbol){
        return res.render('comprar', { title: 'Compra', error: 'No se seleccionó ninguna acción'});
    
    }  else if (isNaN(shares) || shares <= 0) {
        return res.render('comprar', { title: 'Compra', error: 'Debe ser un número positivo'});
    }

    symbol = symbol.trim().toUpperCase()
    console.log(symbol);
    console.log( await lookup(symbol));

    try {
        stock = await lookup(symbol);
        if (!stock || !stock.price) {
            return res.render('comprar', { title: 'Compra', error: 'Ticker inválido'});
        }

    } catch (err) {
        console.log(err);
        return res.render('comprar', { title: 'Compra', error: 'Símbolo inválido'});
    }

    let price = parseFloat(stock.price);
    var cost = price * shares;

    const [user] = await pool.query("SELECT cash FROM users WHERE id = ?", [req.session.user_id]);
    let cash = parseFloat(user[0].cash);

    if (isNaN(cash) || cash < cost) {
        return res.render('comprar', { title: 'Compra', error: 'Fondos insuficientes'});
    }

    await pool.query("UPDATE users SET cash = ? WHERE id = ?", [cash - cost, req.session.user_id]);
    await pool.query("INSERT INTO purchases(user_id, symbol, shares) VALUES (?, ?, ?)", [req.session.user_id, symbol, shares]);
    await pool.execute("INSERT INTO transactions (user_id, symbol, shares, price, type) VALUES (?, ?, ?, ?, 'COMPRADO')", [user_id, symbol, shares, price]);
    return res.render('comprar', { title: 'Compra', success: '¡Compra realizada exitosamente!'});

});


module.exports = router;
