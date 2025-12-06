var express = require('express');
var router = express.Router();
var lookup = require('../helpers/lookup');
var formato = require('../helpers/formato');

function loginRequerido(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  next();
}

router.get('/', (req, res, next)=> {
    res.render('consultar', { title: 'Consulta' });
});

router.post('/', async (req, res, next)=>{
	var symbol = req.body.symbol;
	if (!symbol) 
	{
		return res.render('consultar', { title: 'Consulta', error: 'No se seleccionó ninguna acción'});

	}
	try
	{
		const stock = await lookup(symbol);
    	res.render('consultado', {
      		title: 'Resultados de la Consulta',
      		name: stock.name,
      		symbol: stock.symbol,
      		price: formato(stock.price),
      		currency: stock.currency
    	});
	}
	catch (err)
	{
		console.log(err);
		res.render('consultar', { title: 'Consulta', error: 'Símbolo inválido'});
	}
});


module.exports = router;
