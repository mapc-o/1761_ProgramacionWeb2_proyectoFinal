var express = require('express');
var router = express.Router();
var lookup = require('../helpers/lookup');
var formato = require('../helpers/formato');
const pool = require('../db');

function loginRequerido(req, res, next) {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
}

async function getSym(user_id) {
    let [symbols] = await pool.execute("SELECT symbol FROM purchases WHERE user_id = ? GROUP BY symbol", [user_id]);
    let new_sym = [];
    for (let row of symbols) {
        new_sym.push(row.symbol);
    }
    return new_sym
}

router.get('/', loginRequerido, async (req, res, next) => {
    let curr_syms = await getSym(req.session.user_id);
    res.render('vender', { title: 'Venta', new_sym: curr_syms });
});

router.post('/', async (req, res, next) => {
    let user_id = req.session.user_id;
    let symbol = req.body.symbol;
    let shares = parseInt(req.body.shares);
    let curr_syms = await getSym(req.session.user_id);

    if (!symbol) {
        return res.render('vender', { title: 'Venta', new_sym: curr_syms, error: 'No se seleccionó ninguna acción' });

    } else if (isNaN(shares) || shares <= 0) {
        return res.render('vender', { title: 'Venta', new_sym: curr_syms, error: 'Debe ser un número positivo' });

    }

    const [rows] = await pool.execute("SELECT SUM(shares) AS total_shares FROM purchases WHERE user_id = ? AND symbol = ?", [user_id, symbol]);
    let total_shares = rows[0].total_shares;
    if (total_shares < shares) {
        return res.render('vender', { title: 'Venta', new_sym: curr_syms, error: 'No posees tantas acciones' });
    }

    symbol = symbol.trim().toUpperCase();
    let stock = await lookup(symbol);
    let price = stock.price;
    let ret = shares * price;

    let shares_left = shares;
    while (shares_left > 0) {
        let [curr_row] = await pool.execute("SELECT id, shares FROM purchases WHERE user_id = ? AND symbol = ?", [user_id, symbol]);

        let curr = curr_row[0];
        if (shares_left >= curr.shares) {
            shares_left -= curr.shares;
            await pool.execute("DELETE FROM purchases WHERE id = ?", [curr.id]);
        } else {
            await pool.execute("UPDATE purchases SET shares = shares - ? WHERE id = ?", [shares_left, curr.id]);
            shares_left = 0;
        }
    }

    let [checker] = await pool.execute("SELECT SUM(shares) AS total_shares FROM purchases WHERE user_id = ? AND symbol = ?", [user_id, symbol]);
    if (checker[0].total_shares == 0) {
        await pool.execute("DELETE FROM purchases WHERE user_id = ? AND symbol = ?", [user_id, symbol]);

    }


    await pool.execute("INSERT INTO transactions (user_id, symbol, shares, price, type) VALUES (?, ?, ?, ?, 'VENDIDO')", [user_id, symbol, shares, price]);
    await pool.execute("UPDATE users SET cash = cash + ? WHERE id = ?", [ret, user_id]
    );
    return res.render('vender', { title: 'Venta', success: '¡Venta realizada exitosamente!' });
});

module.exports = router;