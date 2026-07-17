/**
 * BUBO STRAP — Shared Sidebar Dropdown Logic
 * Handles collapsible nav items & prefetching for fast navigation
 */
(function () {
  'use strict';

  // ── 1. Dropdown toggle ──
  document.querySelectorAll('.nav-item.collapsible').forEach(function (item) {
    item.addEventListener('click', function (e) {
      // Only intercept if there is a sibling .nav-sub-items
      const next = item.nextElementSibling;
      if (!next || !next.classList.contains('nav-sub-items')) return;

      e.preventDefault();

      const isOpen = next.classList.contains('open');

      // Close all other open sub-menus
      document.querySelectorAll('.nav-sub-items.open').forEach(function (el) {
        el.classList.remove('open');
        const btn = el.previousElementSibling;
        if (btn) {
          const chev = btn.querySelector('.chevron');
          if (chev) chev.classList.remove('up');
        }
      });

      if (!isOpen) {
        next.classList.add('open');
        const chev = item.querySelector('.chevron');
        if (chev) chev.classList.add('up');
      }
    });
  });

  // Auto-open sub-menu for the active page's parent
  document.querySelectorAll('.nav-sub-items').forEach(function (sub) {
    if (sub.querySelector('.nav-sub-item.active')) {
      sub.classList.add('open');
      const btn = sub.previousElementSibling;
      if (btn) {
        const chev = btn.querySelector('.chevron');
        if (chev) chev.classList.add('up');
      }
    }
  });

  // ── 2. Prefetch pages on sidebar hover for instant navigation ──
  const pages = ['/', '/cctv', '/lokasi', '/pekerja', '/laporan'];
  const prefetched = new Set();

  function prefetchPage(url) {
    if (prefetched.has(url)) return;
    prefetched.add(url);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  // Prefetch all pages after 1 second idle (non-blocking)
  if ('requestIdleCallback' in window) {
    requestIdleCallback(function () {
      pages.forEach(prefetchPage);
    }, { timeout: 2000 });
  } else {
    setTimeout(function () {
      pages.forEach(prefetchPage);
    }, 1500);
  }

  // Also prefetch on hover
  document.querySelectorAll('.nav-item[href], .nav-sub-item[href]').forEach(function (a) {
    a.addEventListener('mouseenter', function () {
      if (a.href) prefetchPage(new URL(a.href).pathname);
    }, { once: true, passive: true });
  });

})();
