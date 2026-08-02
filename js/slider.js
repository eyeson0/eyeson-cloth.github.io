// js/slider.js
// Simple horizontal slider logic for the New Arrivals section
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('newSlider');
  if (!slider) return;
  const next = document.querySelector('.slider-next');
  const prev = document.querySelector('.slider-prev');
  const step = () => {
    const s = slider.querySelector('.slide');
    return s ? s.offsetWidth + 16 : 320;
  };
  next && next.addEventListener('click', ()=> slider.scrollBy({left: step(), behavior:'smooth'}));
  prev && prev.addEventListener('click', ()=> slider.scrollBy({left: -step(), behavior:'smooth'}));
  // optional: autoplay subtle scroll
  let autoplay = true;
  setInterval(()=> { if (autoplay) slider.scrollBy({left: step(), behavior:'smooth'}); }, 7000);
  slider.addEventListener('mouseenter', ()=> autoplay = false);
  slider.addEventListener('mouseleave', ()=> autoplay = true);
});