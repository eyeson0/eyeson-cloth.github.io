// js/wishlist.js
// Simple wishlist demo persisted to localStorage
const WKEY = 'eyeson_wishlist_v1';
function getWish(){ try { return JSON.parse(localStorage.getItem(WKEY)) || []; } catch(e){ return []; } }
function saveWish(w){ localStorage.setItem(WKEY, JSON.stringify(w)); renderWishButtons(); }
function toggleWish(id, title){
  const w = getWish();
  const idx = w.findIndex(x => x.id === id);
  if (idx === -1) w.push({id, title}); else w.splice(idx,1);
  saveWish(w);
}
function renderWishButtons(){
  document.querySelectorAll('.toggle-wish').forEach(btn => {
    const card = btn.closest('.product-card');
    const id = card ? (card.dataset.id || card.querySelector('img')?.src) : null;
    const w = getWish();
    if (id && w.find(x => x.id === id)) { btn.textContent = '♥'; btn.setAttribute('aria-pressed','true'); } else { btn.textContent = '♡'; btn.setAttribute('aria-pressed','false'); }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  renderWishButtons();
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-wish');
    if (!btn) return;
    const card = btn.closest('.product-card');
    const id = card ? (card.dataset.id || card.querySelector('img')?.src) : Date.now().toString();
    const title = card ? (card.querySelector('.product-name')?.textContent || '') : '';
    toggleWish(id, title);
  });
});