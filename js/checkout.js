m,../m,..// js/checkout.js
// Basic checkout validation, demo only
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Very small demo validation
    const name = form.querySelector('input[placeholder="Full name"]').value.trim();
    const addr = form.querySelector('input[placeholder="Address"]').value.trim();
    if (!name || !addr) { alert('Please fill required fields'); return; }
    alert('Order placed (demo). Thank you!');
    // clear cart
    localStorage.removeItem('eyeson_cart_v1');
    window.location.href = 'index.html';
  });
});jkkkkkkkkkkkkkkk