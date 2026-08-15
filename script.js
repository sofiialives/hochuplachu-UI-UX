/* ==========================================================================
   KOMETA × ХочуПлачу! — частицы, reveal-анимации, калькулятор набора
   ========================================================================== */
(function () {
  'use strict';
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Частицы в hero ---- */
  function initParticles() {
    var container = document.getElementById('particles');
    if (!container || prefersReducedMotion) return;
    var BLUE = '#504CFF';
    var PURPLE = '#854CFF';
    var particles = [
      { l: '6%', dur: 18, del: 0, c: BLUE }, { l: '13%', dur: 24, del: 3.5, c: PURPLE },
      { l: '21%', dur: 20, del: 6, c: BLUE }, { l: '29%', dur: 22, del: 1.5, c: PURPLE },
      { l: '38%', dur: 17, del: 8, c: BLUE }, { l: '46%', dur: 25, del: 4, c: PURPLE },
      { l: '54%', dur: 19, del: 9.5, c: BLUE }, { l: '63%', dur: 23, del: 2.5, c: PURPLE },
      { l: '71%', dur: 21, del: 7, c: BLUE }, { l: '79%', dur: 18, del: 5.5, c: PURPLE },
      { l: '87%', dur: 26, del: 11, c: BLUE }, { l: '94%', dur: 16, del: 13, c: PURPLE }
    ];
    var fragment = document.createDocumentFragment();
    particles.forEach(function (p, i) {
      var el = document.createElement('div');
      el.className = 'particle';
      var size = i % 3 === 0 ? 2.5 : 1.5;
      el.style.left = p.l;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.background = p.c;
      el.style.animation = 'particleRise ' + p.dur + 's ' + p.del + 's linear infinite';
      fragment.appendChild(el);
    });
    container.appendChild(fragment);
  }

  /* ---- 2. Появление блоков при скролле ---- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (prefersReducedMotion) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
            setTimeout(function () { el.classList.add('is-visible'); }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---- 3. Калькулятор набора ----
     Пакеты 4+5 вместе считаются как вау-пакет за $1990 вместо $2850 */
  var BUNDLE_PRICE = 1990;
  function initCart() {
    var inputs = document.querySelectorAll('.pkg__input');
    var cart = document.getElementById('cart');
    var countEl = document.getElementById('cartCount');
    var totalEl = document.getElementById('cartTotal');
    var bundleEl = document.getElementById('cartBundle');
    if (!inputs.length || !cart) return;

    var byId = {};
    inputs.forEach(function (i) {
      var id = i.getAttribute('data-id');
      (byId[id] = byId[id] || []).push(i);
    });

    function update() {
      var checked = [];
      Object.keys(byId).forEach(function (id) {
        if (byId[id][0].checked) checked.push(byId[id][0]);
      });

      var bundleItems = checked.filter(function (i) { return i.hasAttribute('data-bundle'); });
      var isBundle = bundleItems.length === 2;
      var total = 0;
      checked.forEach(function (i) {
        if (isBundle && i.hasAttribute('data-bundle')) return;
        total += parseInt(i.getAttribute('data-price'), 10) || 0;
      });
      if (isBundle) total += BUNDLE_PRICE;

      countEl.textContent = checked.length;
      totalEl.textContent = '$' + total;
      bundleEl.hidden = !isBundle;
      cart.hidden = checked.length === 0;
    }

    function onChange(e) {
      // зеркалим состояние на все чекбоксы с тем же data-id (смета + секция пакета)
      var group = byId[e.target.getAttribute('data-id')] || [];
      group.forEach(function (i) { i.checked = e.target.checked; });
      update();
    }

    inputs.forEach(function (i) { i.addEventListener('change', onChange); });
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initReveal();
    initCart();
  });
})();
