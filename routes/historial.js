var express = require('express');
var router = express.Router();
var pool = require('../db');

function loginRequerido(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  next();
}

router.get('/', loginRequerido, async (req, res, next)=> {
    let user_id = req.session.user_id;
    let [rows] = await pool.execute("SELECT symbol, shares, price, type, date FROM transactions WHERE user_id = ?", [user_id]);


    res.render('historial', { title: 'Historial', transactions:rows, error: 'Usuario inválido' });
});


module.exports = router;
