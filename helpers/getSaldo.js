var pool = require('../db');

async function getSaldo(req, res, next) {
  if (req.session.user_id) {
    const [user] = await pool.query("SELECT cash FROM users WHERE id = ?", [req.session.user_id]);
    res.locals.saldo = parseFloat(user[0].cash);
  }
  next();
}

module.exports = getSaldo;
