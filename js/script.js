// js/script.js
// Shared behaviors: preloader, cursor, header dropdowns, quick view base
document.addEventListener('DOMContentLoaded', () => {
  // Preloader removal on window load handled in load event below
  // Dropdown accessibility - show/hide on hover/focus
  document.querySelectorAll('.has-dropdown').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const dd = el.querySelector('.dropdown'); if (dd) dd.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      const dd = el.querySelector('.dropdown'); if (dd) dd.style.opacity = '';
    });
  });

  // Custom cursor
  (function(){
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
    document.addEventListener('mousemove', (e)=> {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });
    const interactive = 'a, button, .btn, .product-card, .slide, .wish';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactive)) {
        cursor.style.width = '36px'; cursor.style.height = '36px'; cursor.style.background = 'rgba(255,255,255,0.04)';
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactive)) {
        cursor.style.width = '16px'; cursor.style.height = '16px'; cursor.style.background = 'transparent';
      }
    });
  })();

  // Quick view open (delegated)
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.quick-view')) {
      const card = e.target.closest('.product-card');
      const modal = document.getElementById('quickView');
      if (!modal || !card) return;
      const img = card.querySelector('img');
      const title = card.querySelector('.product-name') ? card.querySelector('.product-name').textContent : '';
      const price = card.querySelector('.price') ? card.querySelector('.price').textContent : '';
      document.getElementById('qvImage').src = img ? img.src : '';
      document.getElementById('qvTitle').textContent = title;
      document.getElementById('qvPrice').textContent = price;
      document.getElementById('qvDesc').textContent = 'High quality materials · Limited run';
      modal.classList.add('show'); modal.setAttribute('aria-hidden','false');
    }
    if (e.target.closest('.modal-close')) {
      const modal = e.target.closest('.modal');
      if (modal) { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }
    }
  });

  // Close quick view when clicking overlay
  document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', (ev) => {
    if (ev.target === m) { m.classList.remove('show'); m.setAttribute('aria-hidden','true'); }
  }));
});

// Window load: remove page loader and initialize hero backgrounds
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) { loader.style.opacity = '0'; setTimeout(()=> loader.remove(), 600); }
  document.body.classList.remove('preload');

  // Initialize hero backgrounds (if present)
  const slides = document.querySelectorAll('.bg-slide');
  slides.forEach(s => {
    const src = s.dataset.src;
    if (src) s.style.backgroundImage = `url('${src}')`;
  });
  if (slides.length) {
    slides[0].classList.add('active');
    // basic interval fallback if no scroll
    let idx = 0;
    setInterval(()=>{
      slides[idx].classList.remove('active');
      idx = (idx+1) % slides.length;
      slides[idx].classList.add('active');
    }, 6500);
  }
});