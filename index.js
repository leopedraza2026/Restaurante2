// Pollos Rápidos — index.js
// Lógica de aplicación: menú editable, pedidos con número incremental, ventas del día.
// Todo se guarda en localStorage para persistencia local.

(() => {
  // --- Helpers ---
  const qs = sel => document.querySelector(sel);
  const qsa = sel => Array.from(document.querySelectorAll(sel));
  const fmtMoney = v => parseFloat(v).toFixed(2);
  const todayKey = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  // --- Storage keys ---
  const KEY_MENU = 'pr_menu';
  const KEY_ORDERS = 'pr_orders';
  const KEY_INV = 'pr_inventory';
  const KEY_LAST = 'pr_lastOrderNumber';

  // --- Initial sample data ---
  const SAMPLE_MENU = [
    { id: 1, name: 'Pollo Asado (entero)', price: 12.50, category: 'plato' },
    { id: 2, name: 'Medio Pollo', price: 7.50, category: 'plato' },
    { id: 3, name: 'Alitas (6)', price: 6.00, category: 'plato' },
    { id: 4, name: 'Arroz', price: 2.00, category: 'otro' },
    { id: 5, name: 'Gaseosa 500ml', price: 1.80, category: 'gaseosa' }
  ];

  // --- Read / Write storage ---
  function loadJSON(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }
  function saveJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  // --- App state ---
  let menu = loadJSON(KEY_MENU, SAMPLE_MENU);
  let orders = loadJSON(KEY_ORDERS, []);
  let inventory = loadJSON(KEY_INV, {}); // { "YYYY-MM-DD": { productId: { qty, revenue } } }
  let lastOrderNumber = parseInt(localStorage.getItem(KEY_LAST) || '0', 10);

  // --- UI references ---
  const menuList = qs('#menu-list');
  const addForm = qs('#add-item-form');
  const orderMenu = qs('#order-menu');
  const cartList = qs('#cart-list');
  const cartTotalEl = qs('#cart-total');
  const placeBtn = qs('#place-order');
  const ordersList = qs('#orders-list');
  const todayDateEl = qs('#today-date');
  const inventoryList = qs('#inventory-list');
  const nextOrderEl = qs('#next-order');

  // Cart object
  let cart = [];

  // --- Rendering functions ---
  function renderMenuManagement() {
    menuList.innerHTML = '';
    if (menu.length === 0) {
      menuList.innerHTML = '<div class="empty">No hay productos. Agrega uno abajo.</div>';
      return;
    }
    menu.forEach(item => {
      const row = document.createElement('div');
      row.className = 'menu-item';
      row.innerHTML = `
        <div class="meta">
          <div class="label">${escapeHTML(item.name)} <span class="small">(${item.category})</span></div>
          <div class="small">Precio: $${fmtMoney(item.price)}</div>
        </div>
        <div class="controls">
          <button data-id="${item.id}" class="edit">Editar</button>
          <button data-id="${item.id}" class="del">Eliminar</button>
        </div>
      `;
      menuList.appendChild(row);
    });

    // attach events
    qsa('#menu-list .edit').forEach(btn => btn.addEventListener('click', onEditItem));
    qsa('#menu-list .del').forEach(btn => btn.addEventListener('click', onDeleteItem));
  }

  function renderOrderMenu() {
    orderMenu.innerHTML = '';
    if (menu.length === 0) {
      orderMenu.innerHTML = '<div class="empty">No hay productos en el menú.</div>';
      return;
    }
    // Group by category
    const categories = {};
    menu.forEach(it => {
      categories[it.category] = categories[it.category] || [];
      categories[it.category].push(it);
    });

    for (const cat of Object.keys(categories)) {
      const catDiv = document.createElement('div');
      catDiv.innerHTML = `<h4>${escapeHTML(cat.charAt(0).toUpperCase() + cat.slice(1))}</h4>`;
      categories[cat].forEach(item => {
        const line = document.createElement('div');
        line.className = 'order-item';
        line.innerHTML = `
          <div class="meta">
            <label>${escapeHTML(item.name)}</label>
            <div class="small">$${fmtMoney(item.price)}</div>
          </div>
          <div class="controls">
            <input type="number" min="1" value="1" data-id="${item.id}" class="qty" style="width:72px"/>
            <button data-id="${item.id}" class="add-to-cart">Agregar</button>
          </div>
        `;
        catDiv.appendChild(line);
      });
      orderMenu.appendChild(catDiv);
    }

    qsa('.add-to-cart').forEach(btn => btn.addEventListener('click', onAddToCart));
  }

  function renderCart() {
    cartList.innerHTML = '';
    if (cart.length === 0) {
      cartList.innerHTML =