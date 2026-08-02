// js/cart.js
// Basic cart demo using localStorage. Replace with real API integration in production.

const CART_KEY = 'eyeson_cart_v1';

function getCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; } }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCart(); }

function addToCart(item){
  const cart = getCart();
  const found = cart.find(i => i.id === item.id);
  if (found) found.qty += item.qty || 1; else cart.push(Object.assign({qty: item.qty || 1}, item));
  saveCart(cart);
  return cart;
}

function removeFromCart(id){
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  return cart;
}

function renderCart(){
  const el = document.getElementById('cartList');
  if (!el) return;
  const cart = getCart();
  el.innerHTML = '';
  let total = 0;
  cart.forEach(i => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.padding = '12px';
    row.style.border = '1px solid rgba(255,255,255,0.03)';
    row.innerHTML = `<div style="display:flex;gap:12px;align-items:center">
      <img src="${i.img}" alt="${i.name}" style="width:72px;height:72px;object-fit:cover;border-radius:8px">
      <div><strong>${i.name}</strong><div class="muted">Qty: ${i.qty}</div></div>
    </div>
    <div style="text-align:right">
      <div class="price">NPR ${i.price * i.qty}</div>
      <button class="btn" data-remove="${i.id}">Remove</button>
    </div>`;
    el.appendChild(row);
    total += i.price * i.qty;
  });
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = `NPR ${total}`;
  // attach remove handlers
  el.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', (e) => {
    removeFromCart(b.getAttribute('data-remove'));
  }));
}

// wire up add-cart buttons sitewide
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.add-cart')) {
      // find product-card context if present
      const card = e.target.closest('.product-card') || e.target.closest('.modal-inner');
      const id = card ? (card.dataset.id || card.querySelector('img')?.src) : Date.now().toString();
      const name = card ? (card.querySelector('.product-name')?.textContent || 'Product') : 'Product';
      const img = card ? (card.querySelector('img')?.src || 'images/placeholder.webp') : 'images/placeholder.webp';
      const priceText = card ? (card.querySelector('.price')?.textContent || '0') : '0';
      const price = Number((priceText.replace(/[^\d]/g,'')) || 0);
      addToCart({ id, name, img, price, qty:1 });
      // small feedback
      e.target.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:260});
    }
  });
  renderCart();
});