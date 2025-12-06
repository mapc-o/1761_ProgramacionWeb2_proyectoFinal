const yahooFinance = require('yahoo-finance2').default;

async function lookup(symbol) {
  try {
    const consulta = await yahooFinance.quoteSummary(symbol, { modules: ['price'] });


    return {
      symbol: consulta.price.symbol,
      name: consulta.price.shortName,
      price: consulta.price.regularMarketPrice,
      currency: consulta.currency
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = lookup;
