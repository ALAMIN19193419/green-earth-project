// javafile.js

// ========== Config & Selectors ==========
const API_BASE = 'https://openapi.programming-hero.com/api';
const endpoints = {
  allPlants: `${API_BASE}/plants`,
  categories: `${API_BASE}/categories`,
  category: (id) => `${API_BASE}/category/${id}`,
  plant: (id) => `${API_BASE}/plant/${id}`
};

const categoryContainer = document.getElementById('category-container');
const treeContainer = document.getElementById('tree-container');
const spinner = document.getElementById('spinner');
const modal = document.getElementById('plant_modal');
const modalContent = document.getElementById('modal-content');
const cartListEl = document.getElementById('cart-list');
const cartTotalEl = document.getElementById('cart-total');

let activeCategoryId = null;
let cart = [];

// ========== Helpers ==========
function showSpinner() {
  spinner.classList.remove('hidden');
}

function hideSpinner() {
  spinner.classList.add('hidden');
}

function safeImage(item) {
  // Try common image keys, otherwise return placeholder
  return item.image || item.image_url || item.Image || item.img || item.thumbnail || 'https://via.placeholder.com/400x300?text=No+Image';
}

function safeName(item) {
  return item.name || item.title || item.plantName || 'Unknown Plant';
}

function safeShortDesc(item) {
  return item.description || item.about || item.short_description || 'No description available.';
}

function safeCategoryName(item) {
  return item.category || item.category_name || item.cat || 'Uncategorized';
}

function parsePrice(value) {
  // Accept numbers or strings like "200", "৳ 200", "$200"
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const digits = String(value).replace(/[^\d.]/g, '');
  const num = parseFloat(digits);
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(n) {
  return `৳ ${n.toFixed(0)}`;
}

function setActiveCategoryButton(buttonEl, id) {
  // remove active from siblings
  Array.from(categoryContainer.children).forEach(btn => {
    btn.classList.remove('bg-green-600','text-white');
    btn.classList.add('btn','btn-ghost');
  });
  // add to this
  buttonEl.classList.remove('btn','btn-ghost');
  buttonEl.classList.add('bg-green-600','text-white');
  activeCategoryId = id;
}

// ========== Cart ==========
function addToCart(item) {
  const price = parsePrice(item.price);
  // If same item already in cart, just increase qty if you want. For now add duplicate as separate line:
  const cartItem = {
    id: item.id || item._id || `${Math.random()}`,
    name: safeName(item),
    price
  };
  cart.push(cartItem);
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  cartListEl.innerHTML = '';
  let total = 0;
  cart.forEach((c, i) => {
    total += Number(c.price || 0);
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center';
    li.innerHTML = `
      <div>
        <div class="font-semibold">${escapeHtml(c.name)}</div>
        <div class="text-sm text-gray-500">Price: ${formatCurrency(Number(c.price || 0))}</div>
      </div>
      <button class="btn btn-ghost" data-index="${i}" aria-label="remove">❌</button>
    `;
    const btn = li.querySelector('button');
    btn.addEventListener('click', () => {
      removeFromCart(i);
    });
    cartListEl.appendChild(li);
  });
  cartTotalEl.textContent = formatCurrency(total);
}

// simple escape for innerText safety
function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerText;
}

// ========== Render Category Buttons ==========
async function loadCategories() {
  try {
    showSpinner();
    const res = await fetch(endpoints.categories);
    const json = await res.json();
    // the API might return data in json.data or directly; handle both
    const cats = json.data || json.categories || [];
    categoryContainer.innerHTML = '';
    // Add "All" button
    const allBtn = document.createElement('button');
    allBtn.className = 'btn btn-ghost';
    allBtn.innerText = 'All';
    allBtn.addEventListener('click', async () => {
      setActiveCategoryButton(allBtn, null);
      await loadAllPlants();
    });
    categoryContainer.appendChild(allBtn);

    cats.forEach(cat => {
      // try various field names for id and name
      const id = cat.id || cat.category_id || cat._id || cat.category_id;
      const name = cat.name || cat.category_name || cat.title || cat;
      const btn = document.createElement('button');
      btn.className = 'btn btn-ghost';
      btn.innerText = name || 'Unnamed';
      btn.addEventListener('click', async () => {
        setActiveCategoryButton(btn, id);
        await loadPlantsByCategory(id);
      });
      categoryContainer.appendChild(btn);
    });
  } catch (err) {
    console.error('Failed to load categories', err);
    categoryContainer.innerHTML = '<div class="text-red-500">Failed to load categories.</div>';
  } finally {
    hideSpinner();
  }
}

// ========== Load Plants ==========
async function loadAllPlants() {
  try {
    showSpinner();
    treeContainer.innerHTML = '';
    const res = await fetch(endpoints.allPlants);
    const json = await res.json();
    const plants = json.data || json.plants || [];
    if (!plants.length) {
      treeContainer.innerHTML = '<div class="col-span-full text-center text-gray-500">No plants found.</div>';
    } else {
      renderPlantCards(plants);
    }
  } catch (err) {
    console.error('Failed to load plants', err);
    treeContainer.innerHTML = '<div class="col-span-full text-red-500">Failed to load plants.</div>';
  } finally {
    hideSpinner();
  }
}

async function loadPlantsByCategory(catId) {
  if (!catId) {
    return loadAllPlants();
  }
  try {
    showSpinner();
    treeContainer.innerHTML = '';
    const res = await fetch(endpoints.category(catId));
    const json = await res.json();
    const plants = json.data || json.plants || json || [];
    if (!plants || (Array.isArray(plants) && plants.length === 0)) {
      treeContainer.innerHTML = '<div class="col-span-full text-center text-gray-500">No plants in this category.</div>';
    } else {
      renderPlantCards(plants);
    }
  } catch (err) {
    console.error('Failed to load category plants', err);
    treeContainer.innerHTML = '<div class="col-span-full text-red-500">Failed to load plants for this category.</div>';
  } finally {
    hideSpinner();
  }
}

function renderPlantCards(plants) {
  treeContainer.innerHTML = '';
  plants.forEach(p => {
    const img = safeImage(p);
    const name = safeName(p);
    const short = safeShortDesc(p);
    const category = safeCategoryName(p);
    const price = parsePrice(p.price || p.price_amount || p.cost || p.price_eg || 250);

    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg overflow-hidden shadow-lg';
    card.innerHTML = `
      <img src="${img}" alt="${escapeHtml(name)}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="text-xl font-semibold cursor-pointer hover:underline" data-id="${p.id || p._id || p.plant_id || p.plantId || ''}">${escapeHtml(name)}</h3>
        <p class="text-sm text-gray-600 mt-2">${escapeHtml(short.slice(0,110))}${short.length>110?'...':''}</p>
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-500">${escapeHtml(category)}</div>
          <div class="font-bold">${formatCurrency(price)}</div>
        </div>
        <div class="mt-4 flex gap-2">
          <button class="btn btn-sm btn-outline w-full add-to-cart">Add to Cart</button>
          <button class="btn btn-sm w-full details-btn">Details</button>
        </div>
      </div>
    `;

    // Add event listeners
    const addBtn = card.querySelector('.add-to-cart');
    addBtn.addEventListener('click', () => {
      addToCart({ id: p.id || p._id || p.plant_id, name, price });
      // optional tiny feedback
      addBtn.innerText = 'Added';
      setTimeout(()=> addBtn.innerText = 'Add to Cart', 900);
    });

    const detailsBtn = card.querySelector('.details-btn');
    detailsBtn.addEventListener('click', () => {
      // If API has detailed endpoint, try fetching full details by id, else use provided object
      const id = p.id || p._id || p.plant_id || p.plantId || null;
      if (id) {
        openPlantModalById(id);
      } else {
        openPlantModalWithData(p);
      }
    });

    // Also open modal by clicking name
    const nameEl = card.querySelector('h3');
    nameEl.addEventListener('click', () => {
      const id = nameEl.getAttribute('data-id');
      if (id) openPlantModalById(id);
      else openPlantModalWithData(p);
    });

    treeContainer.appendChild(card);
  });
}

// ========== Modal ==========
async function openPlantModalById(id) {
  try {
    showSpinner();
    const res = await fetch(endpoints.plant(id));
    const json = await res.json();
    const plant = json.data || json || null;
    if (plant) {
      openPlantModalWithData(plant);
    } else {
      modalContent.innerHTML = `<div class="text-red-500">Details not available.</div>`;
      modal.showModal?.();
    }
  } catch (err) {
    console.error('Failed to fetch plant details', err);
    modalContent.innerHTML = `<div class="text-red-500">Failed to load details.</div>`;
    modal.showModal?.();
  } finally {
    hideSpinner();
  }
}

function openPlantModalWithData(p) {
  const img = safeImage(p);
  const name = safeName(p);
  const desc = p.description || p.details || p.about || safeShortDesc(p);
  const price = parsePrice(p.price || p.price_amount || p.cost || 0);
  const category = safeCategoryName(p);
  modalContent.innerHTML = `
    <div class="flex flex-col md:flex-row gap-6">
      <img src="${img}" alt="${escapeHtml(name)}" class="w-full md:w-1/3 h-48 object-cover rounded-lg">
      <div class="md:flex-1">
        <h3 class="text-2xl font-bold mb-2">${escapeHtml(name)}</h3>
        <div class="text-sm text-gray-500 mb-3">${escapeHtml(category)} • ${formatCurrency(price)}</div>
        <p class="text-gray-700 mb-4">${escapeHtml(typeof desc === 'string' ? desc : JSON.stringify(desc))}</p>
        <div class="flex gap-3">
          <button class="btn" id="modal-add-to-cart">Add to Cart</button>
          <button class="btn btn-outline" id="modal-close">Close</button>
        </div>
      </div>
    </div>
  `;
  // event listeners inside modal
  const addBtn = modalContent.querySelector('#modal-add-to-cart');
  addBtn.addEventListener('click', () => {
    addToCart({ id: p.id || p._id || p.plant_id, name, price });
    addBtn.innerText = 'Added';
    setTimeout(()=> addBtn.innerText = 'Add to Cart', 900);
  });
  const closeBtn = modalContent.querySelector('#modal-close');
  closeBtn.addEventListener('click', () => {
    if (modal.close) modal.close();
    else modal.style.display = 'none';
  });

  if (modal.showModal) {
    modal.showModal();
  } else {
    // fallback
    modal.style.display = 'block';
  }
}

// close modal when clicking X button or overlay (already present in HTML)
document.querySelectorAll('#plant_modal .btn-ghost').forEach(btn => {
  btn.addEventListener('click', () => {
    if (modal.close) modal.close();
    else modal.style.display = 'none';
  });
});

// ========== Initializers & Form Handling ==========
async function init() {
  // Load categories + all plants
  await loadCategories();
  await loadAllPlants();

  // Plant form simple handler (optional: show modal or thank you)
  const plantForm = document.getElementById('plant-form-data');
  if (plantForm) {
    plantForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // extract values
      const form = e.target;
      const name = form.querySelector('input[type="text"]').value.trim();
      const email = form.querySelector('input[type="email"]').value.trim();
      const select = form.querySelector('select');
      const qty = select ? select.value : '1';
      // show a simple confirmation modal (using existing modal)
      modalContent.innerHTML = `
        <h3 class="text-2xl font-bold mb-2">Thank you, ${escapeHtml(name)}!</h3>
        <p class="mb-4">We received your request to plant <strong>${escapeHtml(qty)}</strong> tree(s). A confirmation has been sent to <strong>${escapeHtml(email)}</strong> (demo).</p>
        <div class="flex gap-3">
          <button class="btn" id="thanks-ok">OK</button>
        </div>
      `;
      if (modal.showModal) modal.showModal();
      const ok = modalContent.querySelector('#thanks-ok');
      ok.addEventListener('click', () => {
        if (modal.close) modal.close();
      });
      form.reset();
    });
  }
}

// start
init();
