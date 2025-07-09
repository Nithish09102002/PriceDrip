const searchInput = document.getElementById("search");
const productContainer = document.getElementById("product-container");
const sortToggle = document.querySelector(".sort-toggle");

let allProducts = [];
let currentPlatform = "all";
let currentSort = "default";

// Load products from JSON
fetch("products.json")
  .then((res) => res.json())
  .then((data) => {
    allProducts = data;
    renderProducts(allProducts);
  });

// Render product cards
function renderProducts(products) {
  productContainer.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-card-content">
        <h3>${product.name}</h3>
        <p>₹${product.price} ${
      product.lowest ? '<span style="color: green;">🔥 Lowest Ever</span>' : ""
    }</p>
        <p>⭐ ${product.rating} | ${product.platform}</p>
        <a href="${product.link}" target="_blank">Buy Now</a>
      </div>
    `;
    productContainer.appendChild(card);
  });
}

// Apply filters: search, platform, sort
function applyFilters(platformOverride = null) {
  let filtered = [...allProducts];

  const keyword = searchInput.value.toLowerCase();
  filtered = filtered.filter((p) => p.name.toLowerCase().includes(keyword));

  const platform = platformOverride || currentPlatform;
  if (platform !== "all") {
    filtered = filtered.filter((p) => p.platform === platform);
  }

  // Sort based on currentSort value
  if (currentSort === "lowToHigh") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "highToLow") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered);
}

// Handle sort toggle (icon click)
sortToggle.addEventListener("click", () => {
  const icon = sortToggle.querySelector("svg");
  const label = sortToggle.querySelector("span");

  if (currentSort === "lowToHigh") {
    currentSort = "highToLow";
    sortToggle.classList.remove("asc");
    sortToggle.classList.add("desc");
    label.textContent = "Price: High to Low";
  } else {
    currentSort = "lowToHigh";
    sortToggle.classList.remove("desc");
    sortToggle.classList.add("asc");
    label.textContent = "Price: Low to High";
  }

  applyFilters();
});

// Live search
searchInput.addEventListener("input", () => applyFilters());

// Filter icon toggle
const filterToggle = document.getElementById("filterToggle");
const platformOptions = document.getElementById("platformOptions");

filterToggle.addEventListener("click", () => {
  platformOptions.style.display =
    platformOptions.style.display === "block" ? "none" : "block";
});

// Handle platform clicks
platformOptions.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentPlatform = btn.getAttribute("data-platform");
    applyFilters(currentPlatform);
    platformOptions.style.display = "none";
  });
});
