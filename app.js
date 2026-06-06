// The Street Café — Norwich (vanilla JS, multi-page)
(() => {
  'use strict';

  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // Opening hours in minutes from midnight. 0 = Sunday … 6 = Saturday.
  const HOURS = {
    0: [8 * 60, 13 * 60 + 30], // Sun 08:00–13:30
    1: [8 * 60, 14 * 60],
    2: [8 * 60, 14 * 60],
    3: [8 * 60, 14 * 60],
    4: [8 * 60, 14 * 60],
    5: [8 * 60, 14 * 60],
    6: [8 * 60, 14 * 60],
  };
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const fmt = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // ---------- Footer year ----------
  function setYear() {
    const yr = $('#year');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  // ---------- Live open / closed status ----------
  function setStatus() {
    const chips = $$('[data-status]');
    if (!chips.length) return;

    const now = new Date();
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const today = HOURS[day];

    let open = false;
    let text = '';

    if (today && mins < today[0]) {
      text = `Opens today at ${fmt(today[0])}`;
    } else if (today && mins >= today[0] && mins < today[1]) {
      open = true;
      text = `Open now · until ${fmt(today[1])}`;
    } else {
      // Closed for the day. We open every day, so the next opening is always tomorrow.
      const next = HOURS[(day + 1) % 7];
      text = `Closed · opens tomorrow at ${fmt(next[0])}`;
    }

    chips.forEach((chip) => {
      chip.classList.toggle('is-open', open);
      const t = chip.querySelector('[data-status-text]');
      if (t) t.textContent = text;
    });
  }

  // ---------- Mobile nav ----------
  function bindNav() {
    const burger = $('#burger');
    const nav = $('#nav');
    if (!burger || !nav) return;

    const close = () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
    const open  = () => { nav.classList.add('is-open');    burger.setAttribute('aria-expanded', 'true');  };

    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.contains('is-open') ? close() : open();
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // ---------- Photo drop-in fallbacks ----------
  // Until the real photo file exists in assets/photos/, show the labelled placeholder.
  function wireImages() {
    $$('.sc-shotImg').forEach((img) => {
      const fail = () => {
        const fig = img.closest('.sc-shot');
        if (fig) fig.classList.add('is-missing');
      };
      // Already failed (e.g. cached error) or fails on load.
      if (img.complete && img.naturalWidth === 0) fail();
      img.addEventListener('error', fail);
    });
  }

  // ---------- Highlight today's row (Visit page) ----------
  function highlightToday() {
    const table = $('#hours');
    if (!table) return;
    const row = table.querySelector(`tr[data-day="${new Date().getDay()}"]`);
    if (row) row.classList.add('is-today');
  }

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    setStatus();
    bindNav();
    wireImages();
    highlightToday();
  });
})();
