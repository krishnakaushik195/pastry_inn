(() => {
  'use strict';
  const WA = '919849520218';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => '₹' + n.toLocaleString('en-IN');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const waLink = text => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
  const { MENU, GALLERY } = window;

  /* ---------- retry an image once if it fails to load ---------- */
  document.addEventListener('error', e => {
    const img = e.target;
    if (img.tagName !== 'IMG' || !img.getAttribute('src') || img.dataset.retried) return;
    img.dataset.retried = '1';
    const src = img.getAttribute('src');
    setTimeout(() => { img.src = src + (src.includes('?') ? '&' : '?') + 'r=' + Date.now(); }, 800);
  }, true);

  /* ---------- loader / misc ---------- */
  const done = () => document.body.classList.add('loaded');
  window.addEventListener('load', () => setTimeout(done, 900));
  setTimeout(done, 3000);
  $('#yr').textContent = new Date().getFullYear();

  let toastT;
  const toast = msg => {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200);
  };

  /* ---------- nav ---------- */
  const nav = $('#nav'), links = $('#navLinks'), burger = $('#burger');
  const setNav = open => { links.classList.toggle('open', open); nav.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : ''; };
  burger.addEventListener('click', () => setNav(!links.classList.contains('open')));
  links.addEventListener('click', e => { if (e.target.closest('a')) setNav(false); });
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), { passive: true });
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('a', links).forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* ---------- open / closed ---------- */
  const OPEN = 8 * 60 + 30, CLOSE = 23 * 60;
  const ist = () => {
    const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false }).formatToParts(new Date());
    const g = t => p.find(x => x.type === t).value;
    return { mins: (+g('hour') % 24) * 60 + +g('minute'), day: g('weekday') };
  };
  const renderStatus = () => {
    const { mins } = ist();
    const open = mins >= OPEN && mins < CLOSE;
    const txt = open ? 'Open now · till 11 PM' : (mins < OPEN ? 'Closed · opens 8:30 AM' : 'Closed · opens tomorrow 8:30 AM');
    ['', '2'].forEach(s => {
      $('#statusPill' + s).classList.toggle('closed', !open);
      $('#statusText' + s).textContent = txt;
    });
  };
  renderStatus(); setInterval(renderStatus, 60000);
  const days = [['Mon', 'Monday'], ['Tue', 'Tuesday'], ['Wed', 'Wednesday'], ['Thu', 'Thursday'], ['Fri', 'Friday'], ['Sat', 'Saturday'], ['Sun', 'Sunday']];
  $('#hours').innerHTML = days.map(([a, f]) => `<li data-d="${a}"><span>${f}</span><span>8:30 AM – 11:00 PM</span></li>`).join('');
  const todayLi = $(`#hours li[data-d="${ist().day}"]`); if (todayLi) todayLi.classList.add('today');

  /* ---------- reveal + counters ---------- */
  const countUp = el => {
    const to = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, t0 = performance.now(), dur = 1400;
    const tick = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = (to * e).toFixed(dec); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    const c = $('[data-count]', e.target); if (c) countUp(c);
  }), { threshold: .12 });
  const observeReveals = () => $$('.reveal:not(.in)').forEach(el => io.observe(el));
  $$('.bento .tile, .stats .stat, .hero .reveal').forEach((el, i) => el.style.setProperty('--d', (i % 6) * .08 + 's'));
  observeReveals();

  /* ---------- hero: slideshow, sparkles, parallax ---------- */
  const slides = $$('#slides .slide');
  if (slides.length > 1) {
    let si = 0;
    setInterval(() => {
      slides[si].classList.remove('on'); si = (si + 1) % slides.length; slides[si].classList.add('on');
    }, 3200);
  }
  const starsBox = $('#stars');
  if (starsBox && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    const r = (a, b) => a + Math.random() * (b - a), COL = ['#ff3d6b', '#ffd36e', '#bfe0a8', '#7bb8ff', '#ffffff'];
    let html = '';
    for (let i = 0; i < 26; i++) html += `<span class="st" style="left:${r(2, 98)}%;top:${r(4, 96)}%;font-size:${r(10, 22)}px;--t:${r(2.5, 5)}s;--d:${r(0, 4)}s">✦</span>`;
    for (let i = 0; i < 22; i++) html += `<span class="fall" style="left:${r(0, 100)}%;background:${COL[i % COL.length]};--t:${r(7, 14)}s;--d:${-r(0, 14)}s"></span>`;
    starsBox.innerHTML = html;
  }
  const heroArt = $('#heroArt');
  if (heroArt && matchMedia('(pointer:fine)').matches) {
    $('#home').addEventListener('pointermove', e => {
      const x = e.clientX - innerWidth / 2, y = e.clientY - innerHeight / 2;
      $$('[data-depth]', heroArt).forEach(a => {
        const d = parseFloat(a.dataset.depth);
        a.style.setProperty('--px', (x * d) + 'px'); a.style.setProperty('--py', (y * d) + 'px');
      });
    });
  }

  /* ---------- click sprinkles ---------- */
  const SPR = ['#d62e4f', '#ffd36e', '#bfe0a8', '#7bb8ff', '#ff9bb0', '#ffffff'];
  addEventListener('pointerdown', e => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    for (let i = 0; i < 9; i++) {
      const s = document.createElement('span'); s.className = 'sprinkle';
      const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 50;
      s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;background:${SPR[i % SPR.length]};--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d + 20}px;--r:${Math.random() * 360}deg`;
      document.body.appendChild(s); setTimeout(() => s.remove(), 900);
    }
  });

  /* ---------- WhatsApp links ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-wa]');
    if (a) { e.preventDefault(); window.open(waLink(a.dataset.wa), '_blank', 'noopener'); }
  });

  /* ---------- cake wall ---------- */
  const cakes = GALLERY.cakes;
  const masonry = $('#masonry');
  let shown = cakes;
  const renderWall = (f = 'all') => {
    masonry.innerHTML = cakes.map((c, i) => `<button class="cake${f === 'all' || c.tags.split(' ').includes(f) ? '' : ' hide'}" data-i="${i}" style="animation-delay:${(i % 8) * 45}ms" aria-label="${esc(c.alt)} — view larger"><img src="${c.src}" width="${c.w}" height="${c.h}" alt="${esc(c.alt)}" loading="lazy"></button>`).join('');
  };
  renderWall();
  $('#cakeFilters').addEventListener('click', e => {
    const b = e.target.closest('.fchip'); if (!b) return;
    $$('.fchip').forEach(x => x.classList.toggle('is-on', x === b));
    renderWall(b.dataset.f);
  });

  /* ---------- lightbox ---------- */
  const lb = $('#lightbox'); let lbList = [], lbIdx = 0;
  const lbShow = () => { const c = lbList[lbIdx]; $('#lbImg').src = c.src; $('#lbImg').alt = c.alt; $('#lbCap').textContent = c.alt; };
  const lbOpen = (list, i) => { lbList = list; lbIdx = i; lbShow(); lb.hidden = false; document.body.style.overflow = 'hidden'; $('#lbClose').focus(); };
  const lbClose = () => { lb.hidden = true; document.body.style.overflow = ''; };
  const lbStep = d => { lbIdx = (lbIdx + d + lbList.length) % lbList.length; lbShow(); };
  masonry.addEventListener('click', e => {
    const b = e.target.closest('.cake'); if (!b) return;
    const visible = $$('.cake:not(.hide)', masonry);
    lbOpen(visible.map(v => cakes[+v.dataset.i]), visible.indexOf(b));
  });
  $('#lbClose').onclick = lbClose; $('#lbPrev').onclick = () => lbStep(-1); $('#lbNext').onclick = () => lbStep(1);
  $('#lbCta').onclick = lbClose;
  lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
  addEventListener('keydown', e => {
    if (!lb.hidden) { if (e.key === 'Escape') lbClose(); if (e.key === 'ArrowLeft') lbStep(-1); if (e.key === 'ArrowRight') lbStep(1); }
    else if (e.key === 'Escape') { closeCart(); setNav(false); }
  });

  /* ---------- inside polaroids ---------- */
  const caps = { outside: ['Our front door', 'Look for the sign!', 'Come say hi!', 'Lit up at night'], shop: ['Counter full of treats', 'Cakes, cakes, cakes', 'Pick your favourite', 'Fresh every day', 'Sweet & savoury'], snack: ['Warm & golden'] };
  const pol = [...GALLERY.shop.filter(s => s.tags !== 'card'), ...GALLERY.food.filter(f => f.tags === 'snack')];
  const used = {};
  $('#polaroids').innerHTML = pol.map(p => { const l = caps[p.tags], n = used[p.tags] = (used[p.tags] || 0) + 1; return `<figure class="pol"><img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" draggable="false"><figcaption>${l[(n - 1) % l.length]}</figcaption></figure>`; }).join('');
  (() => {
    const el = $('#polaroids'); let down = false, sx = 0, sl = 0, moved = false;
    el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; el.classList.add('drag'); } el.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { down = false; el.classList.remove('drag'); });
  })();

  /* ---------- menu ---------- */
  const CATS = [['pizza', 'Pizzas'], ['burger', 'Burgers'], ['sandwich', 'Sandwiches']];
  const PHOTO = {
    pizza: { img: 'assets/img/site/food/food-01.webp', cap: 'Fresh from the oven' },
    burger: { emoji: '🍔', cap: 'Stacked & juicy' },
    sandwich: { img: 'assets/img/site/food/food-05.webp', cap: 'Grilled to golden' }
  };
  const extras = MENU.filter(m => m.cat === 'extra');
  let cat = 'pizza', diet = 'all', q = '';
  const byId = Object.fromEntries(MENU.map(m => [m.id, m]));
  const tabs = $('#menuTabs');
  tabs.innerHTML = CATS.map(([k, l]) => `<button class="tab${k === cat ? ' is-on' : ''}" data-c="${k}" role="tab">${l}<small>${MENU.filter(m => m.cat === k).length}</small></button>`).join('');
  const cart = JSON.parse(localStorage.getItem('pastryinn_cart') || '{}');
  const saveCart = () => localStorage.setItem('pastryinn_cart', JSON.stringify(cart));

  const buyHTML = m => cart[m.id]
    ? `<div class="stepper" data-id="${m.id}"><button data-a="dec" aria-label="Remove one">−</button><b>${cart[m.id]}</b><button data-a="inc" aria-label="Add one">+</button></div>`
    : `<button class="add" data-a="add" data-id="${m.id}">Add +</button>`;

  const renderMenu = () => {
    let list;
    if (q) list = MENU.filter(m => (m.name + ' ' + m.desc).toLowerCase().includes(q));
    else list = MENU.filter(m => m.cat === cat).concat(extras);
    list = list.filter(m => diet === 'all' || (diet === 'veg' ? m.veg : !m.veg));
    const seen = new Set(); list = list.filter(m => !seen.has(m.id) && seen.add(m.id));
    $('#menuList').innerHTML = list.map((m, i) => `
      <li class="mi" data-id="${m.id}" style="animation-delay:${Math.min(i, 12) * 30}ms">
        <div class="mi__name"><i class="dot ${m.veg ? 'dot--veg' : 'dot--non'}" title="${m.veg ? 'Vegetarian' : 'Non-vegetarian'}"></i>${esc(m.name)}${m.grill ? ' <small>GRILL</small>' : ''}${m.cat === 'extra' ? ' <small>ADD-ON</small>' : ''}</div>
        ${m.desc ? `<div class="mi__desc">${esc(m.desc)}</div>` : ''}
        <div class="mi__buy"><span class="mi__price">${money(m.price)}</span><span class="buy">${buyHTML(m)}</span></div>
      </li>`).join('');
    $('#menuEmpty').hidden = list.length > 0;
  };
  const renderPhoto = () => {
    const p = PHOTO[cat], box = $('#menuPhoto');
    box.innerHTML = p.img ? `<img src="${p.img}" alt=""><b>${p.cap}</b>` : `<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:9rem;background:linear-gradient(135deg,#ffd36e,#ff9bb0)">${p.emoji}</div><b>${p.cap}</b>`;
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b) return;
    cat = b.dataset.c; q = ''; $('#menuSearch').value = '';
    $$('.tab', tabs).forEach(t => t.classList.toggle('is-on', t === b)); renderMenu(); renderPhoto();
  });
  $('#vegSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    diet = b.dataset.v; $$('#vegSeg button').forEach(x => x.classList.toggle('is-on', x === b)); renderMenu();
  });
  $('#menuSearch').addEventListener('input', e => {
    q = e.target.value.trim().toLowerCase();
    $$('.tab', tabs).forEach(t => t.classList.toggle('is-on', !q && t.dataset.c === cat)); renderMenu();
  });

  /* ---------- cart ---------- */
  const drawer = $('#drawer'), scrim = $('#scrim');
  let mode = 'Delivery';
  const cartItems = () => Object.entries(cart).map(([id, qty]) => ({ ...byId[id], qty })).filter(i => i.name);
  const refreshBuy = id => { const li = $(`#menuList .mi[data-id="${id}"] .buy`); if (li) li.innerHTML = buyHTML(byId[id]); };
  const renderCart = () => {
    const items = cartItems(), count = items.reduce((s, i) => s + i.qty, 0), total = items.reduce((s, i) => s + i.qty * i.price, 0);
    $('#cartCount').textContent = count;
    $('#cartList').innerHTML = items.map(i => `<li data-id="${i.id}"><b>${esc(i.name)}${i.grill ? ' (Grill)' : ''}</b><div class="stepper"><button data-a="dec" aria-label="Remove one">−</button><b>${i.qty}</b><button data-a="inc" aria-label="Add one">+</button></div><small>${money(i.price)} each</small><span class="line">${money(i.price * i.qty)}</span></li>`).join('');
    $('#cartEmpty').hidden = items.length > 0; $('#checkout').hidden = $('#drawerFoot').hidden = !items.length;
    $('#cartTotal').textContent = money(total);
    $('#coAddrWrap').hidden = mode !== 'Delivery';
  };
  const setQty = (id, d) => {
    cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id];
    saveCart(); renderCart(); refreshBuy(id);
    if (d > 0) { const b = $('#cartOpen'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  };
  const act = e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const id = b.dataset.id || b.closest('[data-id]').dataset.id, a = b.dataset.a;
    setQty(id, a === 'dec' ? -1 : 1);
    if (a === 'add') toast(`Added ${byId[id].name} 🎉`);
  };
  $('#menuList').addEventListener('click', act); $('#cartList').addEventListener('click', act);
  const openCart = () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); scrim.hidden = false; document.body.style.overflow = 'hidden'; };
  function closeCart() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); scrim.hidden = true; document.body.style.overflow = ''; }
  $('#cartOpen').onclick = openCart; $('#cartClose').onclick = closeCart; scrim.onclick = closeCart;
  drawer.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeCart(); });
  $('#modeSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    mode = b.dataset.m; $$('#modeSeg button').forEach(x => x.classList.toggle('is-on', x === b)); $('#coAddrWrap').hidden = mode !== 'Delivery';
  });
  $('#sendOrder').onclick = () => {
    const name = $('#coName').value.trim(), addr = $('#coAddr').value.trim();
    if (!name) { $('#coName').focus(); return toast('Please add your name'); }
    if (mode === 'Delivery' && !addr) { $('#coAddr').focus(); return toast('Please add your delivery address'); }
    const items = cartItems(), total = items.reduce((s, i) => s + i.qty * i.price, 0);
    const lines = items.map((i, n) => `${n + 1}. ${i.name}${i.grill ? ' (Grill)' : ''} x${i.qty} — ${money(i.price * i.qty)}`);
    const msg = ['Hi Pastry Inn! 🍕 I would like to place an order.', '', `Type: ${mode}`, `Name: ${name}`, mode === 'Delivery' ? `Address: ${addr}` : '', '', ...lines, '', `Total: ${money(total)}`, $('#coNote').value.trim() ? `Notes: ${$('#coNote').value.trim()}` : ''].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n').trim();
    window.open(waLink(msg), '_blank', 'noopener');
  };
  renderMenu(); renderPhoto(); renderCart();

  /* ---------- cake studio ---------- */
  const FLAV = {
    blackforest: { n: 'Black Forest', sponge: '#5a2d1c', cream: '#fff4ea', top: '#fff4ea', text: '#4a2518', deco: 'cherry', sw: '#5a2d1c' },
    redvelvet: { n: 'Red Velvet', sponge: '#b3122f', cream: '#fff6f1', top: '#fff6f1', text: '#a81d3a', deco: 'crumb', sw: '#b3122f' },
    butter: { n: 'Butter Cake', sponge: '#f0c06a', cream: '#fff1cf', top: '#ffeab8', text: '#7a4a12', deco: 'none', sw: '#f0c06a' },
    chocolate: { n: 'Chocolate Truffle', sponge: '#4b2a1d', cream: '#7a4630', top: '#2f170f', text: '#ffe6c7', deco: 'drip', sw: '#2f170f' },
    fruit: { n: 'Fresh Fruit', sponge: '#f6dfa6', cream: '#fffaf0', top: '#fffaf0', text: '#7a4a12', deco: 'fruit', sw: '#ff7a59' },
    butterscotch: { n: 'Butterscotch', sponge: '#d9953a', cream: '#f9dca0', top: '#f6d28c', text: '#6b3d0f', deco: 'caramel', sw: '#d9953a' }
  };
  const SHAPES = { round: 'Round', square: 'Square', heart: 'Heart ♥' };
  const SIZES = [['0.5 kg', '4–6 servings'], ['1 kg', '8–10 servings'], ['1.5 kg', '12–15 servings'], ['2 kg', '16–20 servings'], ['3 kg', '25–30 servings']];
  const TOPPERS = { none: 'Plain', hearts: 'Hearts', stars: 'Stars', candles: 'Candles', roses: 'Roses' };
  const S = { flavor: 'blackforest', shape: 'round', tiers: 1, size: 1, topper: 'hearts', msg: 'Happy Birthday!' };

  const heartD = 'M0,70 C-20,52 -100,18 -100,-28 C-100,-62 -74,-82 -48,-82 C-26,-82 -8,-70 0,-52 C8,-70 26,-82 48,-82 C74,-82 100,-62 100,-28 C100,18 20,52 0,70 Z';
  const lines = msg => {
    const m = msg.trim(); if (m.length <= 14) return [m];
    const mid = m.length / 2; let best = -1;
    for (let i = 0; i < m.length; i++) if (m[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
    return best < 0 ? [m] : [m.slice(0, best), m.slice(best + 1)];
  };
  const dotsOnArc = (cx, cy, rx, ry, n, col, r = 4) => {
    let s = ''; for (let i = 0; i <= n; i++) { const a = Math.PI * i / n; s += `<circle cx="${(cx + rx * Math.cos(a)).toFixed(1)}" cy="${(cy + ry * Math.sin(a) + 1).toFixed(1)}" r="${r}" fill="${col}"/>`; }
    return s;
  };
  const topper = (type, cx, y, w) => {
    const sw = w * .3;
    const stick = (h, i) => `<rect x="-1.5" y="${-h}" width="3" height="${h}" fill="#c9a36a" rx="1.5"/>`;
    if (type === 'hearts') return [-1, 0, 1].map((k, i) => { const h = i === 1 ? 44 : 30; return `<g transform="translate(${cx + k * sw},${y})">${stick(h)}<path d="M0,-4 C-13,-18 -25,-3 0,14 C25,-3 13,-18 0,-4Z" transform="translate(0,${-h - 10}) scale(1.05)" fill="${i === 1 ? '#d62e4f' : '#ff6b81'}"/></g>`; }).join('');
    if (type === 'stars') return [-1, 0, 1].map((k, i) => { const h = i === 1 ? 46 : 30; return `<g transform="translate(${cx + k * sw},${y})">${stick(h)}<path d="M0,-26 7,-10 24,-9 11,2 15,19 0,10 -15,19 -11,2 -24,-9 -7,-10Z" transform="translate(0,${-h - 8}) scale(.8)" fill="${i === 1 ? '#ffd36e' : '#fff'}" stroke="#e6a92b" stroke-width="1.5"/></g>`; }).join('');
    if (type === 'candles') return [-1, 0, 1].map((k, i) => `<g transform="translate(${cx + k * sw * .8},${y})"><rect x="-4" y="-30" width="8" height="32" rx="2" fill="${['#7bb8ff', '#ff9bb0', '#bfe0a8'][i]}"/><path d="M-4,-20 8,-14M-4,-10 8,-4" stroke="#fff" stroke-width="2" opacity=".7"/><path d="M0,-52 C-8,-42 -6,-34 0,-32 C6,-34 8,-42 0,-52Z" fill="#ffb02e"/><path d="M0,-44 C-3,-39 -2,-35 0,-34 C2,-35 3,-39 0,-44Z" fill="#fff3b0"/></g>`).join('');
    if (type === 'roses') return [-1, 0, 1].map((k, i) => { const r = i === 1 ? 17 : 13; return `<g transform="translate(${cx + k * sw * .75},${y - r + 4})"><circle r="${r}" fill="#ff6b81"/><path d="M0,-9 A9,9 0 1 1 -8,3 A6,6 0 1 1 3,-4" fill="none" stroke="#c4163a" stroke-width="2.5" stroke-linecap="round" transform="scale(${r / 13})"/><path d="M${r - 2},3 q10,-4 14,3 q-8,6 -14,-3Z" fill="#6bb56b"/></g>`; }).join('');
    return '';
  };
  const deco = (kind, cx, y, rx) => {
    let s = '';
    if (kind === 'cherry') [-.6, -.2, .2, .6].forEach((k, i) => { s += `<g transform="translate(${cx + rx * k},${y + (i % 2 ? 6 : 0)})"><circle r="9" fill="#c1121f"/><circle cx="-3" cy="-3" r="2.6" fill="#ff8a8a" opacity=".8"/><path d="M0,-8 q4,-10 10,-12" stroke="#4a7a2a" stroke-width="2" fill="none"/></g>`; });
    if (kind === 'fruit') [[-.6, '#e63946'], [-.2, '#7bc043'], [.2, '#ff9f1c'], [.6, '#e63946']].forEach(([k, c], i) => { const yy = y + (i % 2 ? 6 : 0); s += `<circle cx="${cx + rx * k}" cy="${yy}" r="9" fill="${c}"/><circle cx="${cx + rx * k - 3}" cy="${yy - 3}" r="2.4" fill="#fff" opacity=".6"/>`; });
    if (kind === 'caramel') s += `<path d="M${cx - rx * .7},${y + 6} q${rx * .35},${-10} ${rx * .7},0 t${rx * .7},0 t${rx * .7},0" fill="none" stroke="#b8661a" stroke-width="5" stroke-linecap="round" opacity=".85"/>`;
    if (kind === 'crumb') for (let i = 0; i < 9; i++) s += `<circle cx="${cx - rx * .7 + i * rx * .175}" cy="${y + 6 + ((i * 7) % 5 - 2) * 2}" r="3" fill="#b3122f"/>`;
    return s;
  };
  const drip = (cx, yt, rx, h, col) => { let s = ''; [-.8, -.55, -.25, .05, .35, .62, .85].forEach((k, i) => { const x = cx + rx * k, d = 14 + (i * 13 % 22); s += `<rect x="${x - 6}" y="${yt}" width="12" height="${d + 8}" rx="6" fill="${col.top}"/>`; }); return s; };

  const renderCake = () => {
    const c = FLAV[S.flavor], scale = .8 + S.size * .06, cx = 200;
    const tiers = S.shape === 'heart' ? 1 : S.tiers;
    const W = 230 * scale, H = 60;
    let svg = `<defs><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs>`;
    const bottom = 338;
    svg += `<ellipse cx="${cx}" cy="${bottom + 6}" rx="${W / 2 + 44}" ry="20" fill="#fff" opacity=".95"/><ellipse cx="${cx}" cy="${bottom + 4}" rx="${W / 2 + 44}" ry="20" fill="none" stroke="#f3c6d0" stroke-width="3"/>`;
    let topW, msgY, baseY, decoY, decoRx, frontY;
    const frontMsg = S.shape === 'square' || (S.shape === 'round' && tiers > 1);
    if (S.shape === 'heart') {
      const sx = W / 200 * 1.02, sy = sx * .6, h = 56, cy = bottom - h - 30;
      for (let i = h; i >= 0; i -= 2) {
        const band = i > h * .42 && i < h * .6;
        svg += `<path d="${heartD}" transform="translate(${cx},${cy + i}) scale(${sx},${sy})" fill="${band ? c.cream : c.sponge}"/>`;
      }
      svg += `<path d="${heartD}" transform="translate(${cx},${cy + h}) scale(${sx},${sy})" fill="url(#sh)" opacity=".7"/>`;
      svg += `<path d="${heartD}" transform="translate(${cx},${cy}) scale(${sx},${sy})" fill="${c.top}"/>`;
      svg += `<path d="${heartD}" transform="translate(${cx},${cy}) scale(${sx * .97},${sy * .97})" fill="none" stroke="${c.cream}" stroke-width="${7 / sx}" stroke-dasharray="0 ${13 / sx}" stroke-linecap="round"/>`;
      topW = W * .8; msgY = cy + 2 * sy; baseY = cy - 42 * sy; decoY = cy - 58 * sy; decoRx = W * .3;
    } else {
      for (let k = 0; k < tiers; k++) {
        const w = W * (1 - .22 * k), yb = bottom - k * H, yt = yb - H, rx = w / 2, ry = Math.max(9, w * .1);
        if (S.shape === 'round') {
          svg += `<path d="M${cx - rx},${yt} V${yb} A${rx},${ry} 0 0 0 ${cx + rx},${yb} V${yt}Z" fill="${c.sponge}"/>`;
          const top = k === tiers - 1 && frontMsg, by = yt + H * (top ? .28 : .4), bh = H * (top ? .44 : .17);
          svg += `<path d="M${cx - rx},${by} A${rx},${ry} 0 0 0 ${cx + rx},${by} V${by + bh} A${rx},${ry} 0 0 1 ${cx - rx},${by + bh}Z" fill="${c.cream}"/>`;
          svg += `<path d="M${cx - rx},${yt} V${yb} A${rx},${ry} 0 0 0 ${cx + rx},${yb} V${yt}Z" fill="url(#sh)"/>`;
          svg += `<ellipse cx="${cx}" cy="${yt}" rx="${rx}" ry="${ry}" fill="${c.top}"/>`;
          if (c.deco === 'drip') svg += drip(cx, yt + ry * .55, rx * .9, H, c);
          svg += dotsOnArc(cx, yt, rx - 3, ry - 3, 18, c.cream, 3.6) + dotsOnArc(cx, yb, rx - 3, ry - 2, 18, c.cream, 3.6);
          if (k === tiers - 1) { frontY = yt; topW = w; msgY = yt + ry * .25; baseY = yt - ry * .35; decoY = yt - ry * .5; decoRx = rx * .7; }
        } else {
          const d = w * .1, hd = w * .17;
          svg += `<rect x="${cx - rx}" y="${yt}" width="${w}" height="${H}" fill="${c.sponge}" rx="3"/>`;
          svg += `<rect x="${cx - rx}" y="${yt + H * .28}" width="${w}" height="${H * .44}" fill="${c.cream}"/>`;
          svg += `<rect x="${cx - rx}" y="${yt}" width="${w}" height="${H}" fill="url(#sh)" rx="3"/>`;
          svg += `<path d="M${cx - rx},${yt} L${cx + rx},${yt} L${cx + rx - d},${yt - hd} L${cx - rx + d},${yt - hd}Z" fill="${c.top}"/>`;
          if (c.deco === 'drip') svg += drip(cx, yt, rx * .92, H, c);
          for (let i = 0; i <= 12; i++) svg += `<circle cx="${cx - rx + 8 + i * (w - 16) / 12}" cy="${yt + 1}" r="3.6" fill="${c.cream}"/>`;
          if (k === tiers - 1) { frontY = yt; topW = w; msgY = yt - hd * .35; baseY = yt - hd * .6; decoY = yt - hd * .65; decoRx = rx * .7; }
        }
      }
    }
    if ((S.topper === 'none' || ['caramel', 'crumb'].includes(c.deco)) && !['drip', 'none'].includes(c.deco)) svg += deco(c.deco, cx, decoY, decoRx);
    const ls = lines(S.msg || ' ');
    if (frontMsg && S.msg.trim()) {
      const ffs = Math.max(9, Math.min(20, topW * .8 / Math.max(...ls.map(l => l.length), 1) * 1.9, 20 / ls.length));
      svg += `<g transform="translate(${cx},${frontY + H * .5})" fill="${c.text}" font-family="Kaushan Script,cursive" font-size="${ffs}" text-anchor="middle">${ls.map((l, i) => `<text y="${(i - (ls.length - 1) / 2) * ffs * 1.05 + ffs * .32}">${esc(l)}</text>`).join('')}</g>`;
    }
    const maxW = topW * .72, fs = Math.max(13, Math.min(30, maxW / Math.max(...ls.map(l => l.length), 1) * 2.15));
    if (!frontMsg && S.msg.trim()) svg += `<g transform="translate(${cx},${msgY}) scale(1,.5)" fill="${c.text}" font-family="Kaushan Script,cursive" font-size="${fs}" text-anchor="middle">${ls.map((l, i) => `<text y="${(i - (ls.length - 1) / 2) * fs * 1.05 + fs * .3}">${esc(l)}</text>`).join('')}</g>`;
    svg += topper(S.topper, cx, baseY, topW);
    const svgEl = $('#cakeSvg'); svgEl.innerHTML = svg;
    const vt = bottom - Math.max(tiers * H + 100, S.shape === 'heart' ? 215 : 0);
    svgEl.setAttribute('viewBox', `40 ${vt} 320 ${bottom + 38 - vt}`);
    svgEl.classList.remove('pop'); void svgEl.getBoundingClientRect(); svgEl.classList.add('pop');
    $('#cakeCaption').textContent = `${c.n} · ${SHAPES[S.shape].replace(' ♥', '')} · ${tiers > 1 ? tiers + ' tiers · ' : ''}${SIZES[S.size][0]}`;
  };

  const opts = (id, items, key, fmt) => {
    $('#' + id).innerHTML = items.map(([v, label, extra]) => `<button type="button" class="opt" data-k="${key}" data-v="${v}">${extra || ''}${label}</button>`).join('');
  };
  opts('optFlavor', Object.entries(FLAV).map(([k, f]) => [k, f.n, `<i class="sw" style="background:${f.sw}"></i>`]), 'flavor');
  opts('optShape', Object.entries(SHAPES), 'shape');
  opts('optTiers', [[1, '1'], [2, '2'], [3, '3']], 'tiers');
  opts('optSize', SIZES.map((s, i) => [i, s[0]]), 'size');
  opts('optTopper', Object.entries(TOPPERS), 'topper');
  const syncOpts = () => {
    $$('#cakeForm .opt').forEach(b => {
      const k = b.dataset.k; b.classList.toggle('is-on', String(S[k]) === b.dataset.v);
      if (k === 'tiers') b.disabled = S.shape === 'heart' && b.dataset.v !== '1';
    });
    $$('#cakeForm .opt[data-k=size]').forEach(b => b.title = SIZES[+b.dataset.v][1]);
  };
  $('#cakeForm').addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b || b.disabled) return;
    const k = b.dataset.k; S[k] = ['tiers', 'size'].includes(k) ? +b.dataset.v : b.dataset.v;
    if (k === 'shape' && S.shape === 'heart') S.tiers = 1;
    syncOpts(); renderCake();
  });
  const msgIn = $('#cakeMsg');
  msgIn.addEventListener('input', () => { S.msg = msgIn.value; $('#msgCount').textContent = `${msgIn.value.length}/28`; renderCake(); });
  $('#msgCount').textContent = `${msgIn.value.length}/28`;
  const dateIn = $('#cakeDate'); dateIn.min = new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
  $('#cakeForm').addEventListener('submit', e => {
    e.preventDefault();
    const c = FLAV[S.flavor], tiers = S.shape === 'heart' ? 1 : S.tiers;
    const msg = ['Hi Pastry Inn! 🎂 I would like to order a custom cake.', '',
      `Flavour: ${c.n}`, `Shape: ${SHAPES[S.shape].replace(' ♥', '')}`, `Tiers: ${tiers}`, `Size: ${SIZES[S.size][0]} (${SIZES[S.size][1]})`, `Topper: ${TOPPERS[S.topper]}`,
      `Message on cake: "${S.msg.trim()}"`,
      dateIn.value ? `Needed on: ${dateIn.value}` : '', $('#cakeName').value.trim() ? `Name: ${$('#cakeName').value.trim()}` : '',
      $('#cakeNote').value.trim() ? `Notes: ${$('#cakeNote').value.trim()}` : '', '', 'Please confirm price & availability. Thank you!'].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n').trim();
    window.open(waLink(msg), '_blank', 'noopener'); toast('Opening WhatsApp… 🎂');
  });
  syncOpts(); renderCake();
})();

