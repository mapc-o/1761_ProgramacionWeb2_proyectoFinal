const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/saldo', async (req, res) => {
  try {
    const premio = req.body.premio;
    const user_id = req.session.user_id;

    if (!user_id) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const [rows] = await pool.query("SELECT cash FROM users WHERE id = ?", [user_id]);
    let saldo = parseFloat(rows[0].cash);

    saldo += premio;
    await pool.query("UPDATE users SET cash = ? WHERE id = ?", [saldo, user_id]);

    res.json({ saldo });
  } catch (err) {
    console.error("Error en /saldoQuiz:", err);
    res.status(500).json({ error: "Error al actualizar saldo" });
  }
});

module.exports = router;