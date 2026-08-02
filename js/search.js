// js/search.js
// Lightweight client-side search demo: searches product-name text on collections page
document.addEventListener('DOMContentLoaded', () => {
  const searchEl = document.getElementById('siteSearch');
  if (!searchEl) return;
  const cards = Array.from(document.querySelectorAll('.product-card'));
  searchEl.addEventListener('input', (e) => {
    const q = (e.target.value || '').trim().toLowerCase();
    cards.forEach(c => {
      const name = (c.querySelector('.product-name')?.textContent || '').toLowerCase();
      c.style.display = q ? (name.includes(q) ? '' : 'none') : '';
    });
  });
});