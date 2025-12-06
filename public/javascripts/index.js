// 2 de teclado
document.addEventListener('keydown', function(event) {
  const key = event.key.toLowerCase();

  if (event.ctrlKey && key === 'c') {
    window.location.href = '/comprar';
  }

  if (event.ctrlKey && key === 'v') {
    window.location.href = '/vender';
  }
});

// 1 de ratón
document.addEventListener('contextmenu', (e)=> {
    e.preventDefault();
    window.location.href = '/consultar'; 
});

// 1 de animación
function transactionAlert() {
  const toastEl = document.getElementById('transaction_toast');
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
  }
}
document.addEventListener('DOMContentLoaded', transactionAlert);



