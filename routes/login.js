var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');

/* GET catàlogo login. */
router.get('/', (req, res, next)=> {
    req.session.destroy(()=>{
    res.render('login', { title: 'Iniciar Sesión'});
    });
});

router.post('/', async (req, res, next)=> {
    const { username, password } = req.body;
    if (!username) 
    {
        return res.status(400).render('login', {error: "Debe ingresar un nombre de usuario"});
    }
    else if (!password) 
    {
        return res.status(400).render('login', {error: "Debe ingresar una contraseña"});
    }

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

        if (rows.length !== 1) 
        {
            return res.status(403).render('login', {error: "Usuario y/o contraseña inválido"})
        }

        const user = rows[0];

        const pass = await bcrypt.compare(password, user.hash);
        if (!pass) 
        {
            return res.status(403).render('login', {error: "Contraseña inválida"})
        }

        req.session.user_id = user.id;
        res.redirect('home');
    }
    catch (err)
    {
        console.log(err);
        res.status(500).render('login', {error: "error del servidor"});
    }
    
    
});

module.exports = router;
