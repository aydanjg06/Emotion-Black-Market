const products = [
  {
    id: 1,
    name: "Joy",
    category: "Joy",
    price: 24.99,
    image: "assets/Happiness potion.png",
    desc: "Feel pure happiness."
  },
  {
    id: 2,
    name: "Anger",
    category: "Anger",
    price: 19.99,
    image: "assets/Anger potion.png",
    desc: "Unleash your rage."
  },
  {
    id: 3,
    name: "Sadness",
    category: "Sadness",
    price: 29.99,
    image: "assets/Sadness potion.png",
    desc: "Experience deep emotions."
  },
  {
    id: 4,
    name: "Love",
    category: "Love",
    price: 39.99,
    image: "assets/Love potion.png",
    desc: "Feel connected."
  },
  {
    id: 5,
    name: "Calm",
    category: "Calm",
    price: 22.99,
    image: "assets/Calm Potion.png",
    desc: "Inner peace in a bottle."
  },
  {
    id: 6,
    name: "Curiousity",
    category: "Curiousity",
    price: 27.99,
    image: "assets/Curiousity Potion.png",
    desc: "Discover the unknown."
  },
  {
    id: 7,
    name: "Growth",
    category: "Growth",
    price: 34.99,
    image: "assets/Growth.png",
    desc: "Become your best self."
  },
  {
    id: 8,
    name: "Your Choice",
    category: "All",
    price: 49.99,
    image: "assets/Your choice potion.png",
    desc: "Create your own emotion."
  }
];

let cart = [];
let wishlist = [];
let currentCategory = "All";

const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");

function showPage(id) {
  pages.forEach(page => {
    page.classList.remove("active");
  });

  const selectedPage = document.getElementById(id);

  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.dataset.page === id) {
      link.classList.add("active");
    }
  });

  closeCart();

  const searchModal = document.getElementById("searchModal");
  if (searchModal) {
    searchModal.classList.add("hidden");
  }

  window.scrollTo(0, 0);

  if (id === "wishlist") renderWishlist();
  if (id === "checkout") renderCheckout();
  if (id === "payment") updatePaymentSummary();
}

function renderHomeProducts() {
  const container = document.getElementById("homeEmotionList");
  if (!container) return;

  container.innerHTML = "";

  products.slice(0, 7).forEach(product => {
    const div = document.createElement("div");
    div.className = "small-product";

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
    `;

    div.addEventListener("click", () => {
      showPage("shop");
      filterProducts(product.category === "All" ? "All" : product.category);
    });

    container.appendChild(div);
  });
}

function renderProducts(productArray = products) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = "";

  if (productArray.length === 0) {
    grid.innerHTML = `<p>No emotions found.</p>`;
    return;
  }

  productArray.forEach(product => {
    const liked = wishlist.includes(product.id);

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Limited edition</p>
      <p>€${product.price.toFixed(2)}</p>

      <div class="product-actions">
        <button class="icon-btn ${liked ? "active" : ""}" onclick="toggleWishlist(${product.id})">♥</button>
        <button class="icon-btn" onclick="addToCart(${product.id})">+</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

function filterProducts(category) {
  currentCategory = category;

  document.querySelectorAll(".category").forEach(btn => {
    btn.classList.remove("active");

    const label = btn.textContent.toLowerCase();

    if (
      (category === "All" && label.includes("all")) ||
      label.includes(category.toLowerCase())
    ) {
      btn.classList.add("active");
    }
  });

  applyFilters();
}

function applyFilters() {
  const priceRange = document.getElementById("priceRange");
  const sortSelect = document.getElementById("sortSelect");

  const priceLimit = priceRange ? parseFloat(priceRange.value) : 100;
  const sort = sortSelect ? sortSelect.value : "popular";

  let filtered = [...products];

  if (currentCategory !== "All") {
    filtered = filtered.filter(product => product.category === currentCategory);
  }

  filtered = filtered.filter(product => product.price <= priceLimit);

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (sort === "newest") {
    filtered.reverse();
  }

  renderProducts(filtered);
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  showToast("ITEM SUCCESSFULLY ADDED");
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const subtotal = document.getElementById("cartSubtotal");

  if (!cartItems || !subtotal) return;

  cartItems.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p>Your bag is empty.</p>`;
  }

  cart.forEach((product, index) => {
    const lineTotal = product.price * product.quantity;
    total += lineTotal;

    const item = document.createElement("div");
    item.className = "cart-item";

    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h4>${product.name}</h4>
        <p>Qty: ${product.quantity}</p>
        <strong>€${lineTotal.toFixed(2)}</strong>
      </div>
      <button onclick="removeCartItem(${index})">✕</button>
    `;

    cartItems.appendChild(item);
  });

  subtotal.textContent = `€${total.toFixed(2)}`;
}

function removeCartItem(index) {
  cart.splice(index, 1);

  updateCart();
  renderCheckout();
  updatePaymentSummary();
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  if (drawer) drawer.classList.add("open");
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  if (drawer) drawer.classList.remove("open");
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
  } else {
    wishlist.push(id);
  }

  applyFilters();
  renderWishlist();
}

function renderWishlist() {
  const grid = document.getElementById("wishlistGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const favourites = products.filter(product => wishlist.includes(product.id));

  if (favourites.length === 0) {
    grid.innerHTML = `<p>No favourites added yet.</p>`;
    return;
  }

  favourites.forEach(product => {
    const item = document.createElement("div");
    item.className = "wishlist-item";

    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <p>Limited edition</p>
        <strong>€${product.price.toFixed(2)}</strong>
      </div>
      <button class="icon-btn active" onclick="toggleWishlist(${product.id})">♥</button>
    `;

    grid.appendChild(item);
  });
}

function renderCheckout() {
  const container = document.getElementById("checkoutItems");
  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p>Your checkout is empty.</p>`;
  }

  let subtotal = 0;

  cart.forEach((product, index) => {
    const lineTotal = product.price * product.quantity;
    subtotal += lineTotal;

    const item = document.createElement("div");
    item.className = "checkout-item";

    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <p>Limited edition</p>
        <p>Quantity: ${product.quantity}</p>
      </div>
      <strong>€${lineTotal.toFixed(2)}</strong>
      <button onclick="removeCartItem(${index})">Remove</button>
    `;

    container.appendChild(item);
  });

  const checkoutSubtotal = document.getElementById("checkoutSubtotal");
  const checkoutTotal = document.getElementById("checkoutTotal");

  if (checkoutSubtotal) checkoutSubtotal.textContent = `€${subtotal.toFixed(2)}`;
  if (checkoutTotal) checkoutTotal.textContent = `€${(subtotal + 4.99).toFixed(2)}`;
}

function updatePaymentSummary() {
  const shippingSelect = document.getElementById("shippingSelect");
  const shipping = shippingSelect ? parseFloat(shippingSelect.value) : 4.99;

  const productTotal = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const total = productTotal + shipping;

  const payProductTotal = document.getElementById("payProductTotal");
  const payShipping = document.getElementById("payShipping");
  const payTotal = document.getElementById("payTotal");

  if (payProductTotal) payProductTotal.textContent = `€${productTotal.toFixed(2)}`;
  if (payShipping) payShipping.textContent = `€${shipping.toFixed(2)}`;
  if (payTotal) payTotal.textContent = `€${total.toFixed(2)}`;
}

function placeOrder() {
  if (cart.length === 0) {
    showToast("YOUR BAG IS EMPTY");
    return;
  }

  showToast("ORDER PLACED");

  cart = [];
  updateCart();

  setTimeout(() => {
    showPage("home");
  }, 2400);
}

function sendContact(event) {
  event.preventDefault();
  showToast("SUCCESSFULLY SEND");
  event.target.reset();
}

function showToast(text) {
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toastText");

  if (!toast || !toastText) return;

  toastText.textContent = text;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2200);
}

function openSearch() {
  const searchModal = document.getElementById("searchModal");
  const searchInput = document.getElementById("searchInput");

  if (searchModal) searchModal.classList.remove("hidden");
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }

  const results = document.getElementById("searchResults");
  if (results) results.innerHTML = "";
}

function closeSearch() {
  const searchModal = document.getElementById("searchModal");
  if (searchModal) searchModal.classList.add("hidden");
}

function searchProducts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const results = document.getElementById("searchResults");

  if (!results) return;

  results.innerHTML = "";

  if (!input.trim()) return;

  const found = products.filter(product => {
    return (
      product.name.toLowerCase().includes(input) ||
      product.category.toLowerCase().includes(input) ||
      product.desc.toLowerCase().includes(input)
    );
  });

  if (found.length === 0) {
    results.innerHTML = `<p>No emotions found.</p>`;
    return;
  }

  found.forEach(product => {
    const div = document.createElement("div");
    div.className = "search-result";

    div.innerHTML = `
      <strong>${product.name}</strong>
      <p>${product.desc}</p>
      <p>€${product.price.toFixed(2)}</p>
    `;

    div.addEventListener("click", () => {
      closeSearch();
      showPage("shop");
      filterProducts(product.category === "All" ? "All" : product.category);
    });

    results.appendChild(div);
  });
}

function changeLanguage(language) {
  showToast(`LANGUAGE SET TO ${language.toUpperCase()}`);
}

function toggleContrast(enabled) {
  if (enabled) {
    document.body.classList.add("high-contrast");
  } else {
    document.body.classList.remove("high-contrast");
  }
}

function toggleDark(enabled) {
  if (enabled) {
    document.body.classList.remove("light-mode");
  } else {
    document.body.classList.add("light-mode");
  }
}

function setColorMode(mode) {
  document.body.style.filter = "";

  if (mode === "protanopia") {
    document.body.style.filter = "hue-rotate(-20deg)";
  }

  if (mode === "deuteranopia") {
    document.body.style.filter = "saturate(0.7)";
  }

  if (mode === "tritanopia") {
    document.body.style.filter = "hue-rotate(90deg)";
  }

  if (mode === "off") {
    document.body.style.filter = "";
  }
}

function changeTextSize(change) {
  const body = document.body;
  const current = parseFloat(getComputedStyle(body).fontSize);
  body.style.fontSize = `${current + change}px`;
}

function showSettingsPanel(type) {
  showToast(`${type.toUpperCase()} SETTINGS`);
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeSearch();
    closeCart();
  }
});

renderHomeProducts();
renderProducts();
updateCart();