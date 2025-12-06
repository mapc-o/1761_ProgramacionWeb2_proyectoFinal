var express = require('express');
var router = express.Router();

function loginRequerido(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/');
  }
  next();
}

router.get('/', (req, res, next)=> {
  req.session.destroy((err)=> {
    if (err) {
      console.log(err);
      return res.status(500).send("Error al cerrar sesión");
    }

    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;