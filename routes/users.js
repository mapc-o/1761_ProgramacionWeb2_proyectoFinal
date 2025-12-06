const express = require('express');
const router = express.Router();
const pool = require('../db');

function loginRequerido(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  next();
}

router.get('/', loginRequerido, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT users.username, COUNT(transactions.id) AS transacciones
      FROM users
      LEFT JOIN transactions ON users.id = transactions.user_id
      GROUP BY users.username
      ORDER BY transacciones DESC
    `);

    res.render('users', { users: rows });
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
