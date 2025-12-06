function extraCash() {
  let btn = document.getElementById('btn');
  if (Math.random() < 0.9) {
    btn.classList.remove('d-none');
  } else {
    btn.classList.add('d-none');
  }
}
setInterval(extraCash, 10000);

const tickers = [{ symbol: "AAPL", name: "Apple" },
{ symbol: "MSFT", name: "Microsoft" },
{ symbol: "GOOGL", name: "Alphabet" },
{ symbol: "TSLA", name: "Tesla" },
{ symbol: "MCD", name: "McDonalds" }];
let respuesta;

function pregunta() {
  let res = tickers[Math.floor(Math.random() * tickers.length)];
  respuesta = res.symbol;

  let pregunta = document.getElementById('pregunta');
  if (pregunta) {
    pregunta.textContent = `¿Cuál es el ticker de ${res.name}?`
  }

  let resultado = document.getElementById('resultado');
  document.getElementById('resultado').innerHTML = "";
}

for (let ticker of tickers) {
  let select = document.getElementById(`drag_${ticker.symbol}`);
  if (select) {
    select.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', ticker.symbol);
    });
  }
}

let drop_zone = document.getElementById('drop_zone');
let resultado = document.getElementById('resultado');

drop_zone.addEventListener('dragover', (e) => {
  e.preventDefault();
  drop_zone.classList.add('drag-over');
});

drop_zone.addEventListener('dragleave', () => {
  drop_zone.classList.remove('drag-over');
});

drop_zone.addEventListener('drop', (e) => {
  e.preventDefault();
  drop_zone.classList.remove('drag-over');
  let ticker = e.dataTransfer.getData('text/plain');
  if (ticker === respuesta) {
    resultado.innerHTML = '<span class="text-success">¡Correcto! Ganaste $5</span>';
    (async () => {
      try {
        let res = await fetch('/saldo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ premio: 5 })
        });

        let data = await res.json();
        let saldo = document.getElementById('saldo')
        if (saldo) {
          saldo.textContent = `${data.saldo}`;
        }

      } catch (err) {
        console.log("Error al actualizar saldo", err);
      }
    })();

  } else {
    resultado.innerHTML = '<span class="text-danger">Respuesta incorrecta. Intenta de nuevo.</span>';
  }
});


document.getElementById('container').addEventListener('show.bs.modal', pregunta);