// js/theme.js
// Theme system for EYESON
// - Supports 'light', 'dark', 'system'
// - Persists selection in localStorage
// - When 'system' is selected, follows OS via prefers-color-scheme and updates on change
// - Exposes global window.EYESONTheme helpers for optional debugging

(function () {
  'use strict';

  // LocalStorage key
  const STORAGE_KEY = 'eyeson_theme_mode'; // values: 'light' | 'dark' | 'system'

  // DOM selectors
  const THEME_TOGGLE_ID = 'themeToggle';     // button id
  const THEME_TOGGLE_ATTR = 'data-mode';     // attribute on the button storing mode
  const ROOT = document.documentElement;     // <html> element

  // Default fallback
  const DEFAULT_MODE = 'system';

  // Helper: read OS preference
  const prefersDarkQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  // Read saved mode or return DEFAULT_MODE
  function getSavedMode() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'light' || v === 'dark' || v === 'system') return v;
    } catch (e) {
      // ignore
    }
    return DEFAULT_MODE;
  }

  // Persist selected mode
  function saveMode(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      // ignore
    }
  }

  // Apply 'appliedTheme' to document: set data-theme to 'light' or 'dark'
  function applyThemeToDocument(appliedTheme, mode) {
    // appliedTheme = 'light' or 'dark'
    ROOT.setAttribute('data-theme', appliedTheme);
    ROOT.setAttribute('data-theme-mode', mode); // 'system' | 'dark' | 'light'
    // Also set html attribute for convenience: html[data-theme="dark"] used by CSS
    // (we already set data-theme on root)
  }

  // Determine which theme to apply when mode is set
  function computeAppliedTheme(mode) {
    if (mode === 'light') return 'light';
    if (mode === 'dark') return 'dark';
    // system
    if (prefersDarkQuery && prefersDarkQuery.matches) return 'dark';
    return 'light';
  }

  // Update UI icons/labels for the toggle
  function updateToggleUI(mode) {
    const btn = document.getElementById(THEME_TOGGLE_ID);
    if (!btn) return;
    btn.setAttribute(THEME_TOGGLE_ATTR, mode);
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', `Theme: ${mode}`);

    // Set inner icon + label (accessible)
    // We use inline SVGs for crisp icons
    const icons = {
      light: `
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6" fill="currentColor"/>
          <g stroke="currentColor" stroke-width="1.6">
            <path d="M12 2v2"/>
            <path d="M12 20v2"/>
            <path d="M4.93 4.93l1.414 1.414"/>
            <path d="M17.657 17.657l1.414 1.414"/>
            <path d="M2 12h2"/>
            <path d="M20 12h2"/>
            <path d="M4.93 19.07l1.414-1.414"/>
            <path d="M17.657 6.343l1.414-1.414"/>
          </g>
        </svg>`,
      dark: `
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/>
        </svg>`,
      system: `
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6" fill="none"/>
          <path d="M8 20h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>`
    };

    // Optional text label that can be hidden on small screens
    const label = {
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    };

    btn.innerHTML = `${icons[mode]}<span class="label">${label[mode]}</span><span class="sr-only">Theme ${label[mode]}</span>`;
  }

  // Set theme mode (light|dark|system)
  function setTheme(mode, save = true) {
    if (!['light', 'dark', 'system'].includes(mode)) mode = DEFAULT_MODE;
    if (save) saveMode(mode);
    const applied = computeAppliedTheme(mode);
    applyThemeToDocument(applied, mode);
    updateToggleUI(mode);
  }

  // When OS preference changes and we are in 'system' mode, update document theme
  function onSystemThemeChange(e) {
    const currentMode = getSavedMode();
    if (currentMode !== 'system') return;
    const applied = e.matches ? 'dark' : 'light';
    applyThemeToDocument(applied, 'system');
  }

  // Cycle modes convenience (optional UX) - moves light -> dark -> system -> light
  function cycleMode() {
    const current = getSavedMode();
    const order = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(current) + 1) % order.length];
    setTheme(next, true);
  }

  // Initialize: read saved mode, apply; setup listeners; wire toggle btn
  function initTheme() {
    // 1) Determine mode to apply
    let saved = getSavedMode();

    // If no saved preference and browser supports OS preference, default to system
    if (!saved) saved = DEFAULT_MODE;

    // 2) Apply theme initially
    const applied = computeAppliedTheme(saved);
    applyThemeToDocument(applied, saved);

    // 3) Setup toggle UI if present
    const btn = document.getElementById(THEME_TOGGLE_ID);
    if (btn) {
      // render UI for the current mode
      updateToggleUI(saved);

      // Click: open small menu or cycle — here we will cycle through modes for simplicity
      // (You can change this to open a picker menu if desired.)
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        cycleMode();
      });

      // Keyboard: support Enter and Space
      btn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          cycleMode();
        }
      });
    }

    // 4) Listen for OS changes when 'system' selected. Use addEventListener for modern browsers
    if (prefersDarkQuery && typeof prefersDarkQuery.addEventListener === 'function') {
      prefersDarkQuery.addEventListener('change', onSystemThemeChange);
    } else if (prefersDarkQuery && typeof prefersDarkQuery.addListener === 'function') {
      // legacy
      prefersDarkQuery.addListener(onSystemThemeChange);
    }

    // 5) Expose API (optional) for debugging or other UI controls
    window.EYESONTheme = {
      set: setTheme,
      getMode: getSavedMode,
      apply: () => {
        const mode = getSavedMode();
        const applied = computeAppliedTheme(mode);
        applyThemeToDocument(applied, mode);
      }
    };
  }

  // On DOM ready, initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();