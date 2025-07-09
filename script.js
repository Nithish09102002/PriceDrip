const searchInput = document.getElementById("search");
const productContainer = document.getElementById("product-container");
const sortToggle = document.querySelector(".sort-toggle");
const filterToggle = document.getElementById("filterToggle");
const platformOptions = document.getElementById("platformOptions");

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

// Apply search, platform filter, and sort
function applyFilters(platformOverride = null) {
  let filtered = [...allProducts];
  const keyword = searchInput.value.toLowerCase();

  // Filter by search keyword
  filtered = filtered.filter((p) => p.name.toLowerCase().includes(keyword));

  // Filter by platform
  const platform = platformOverride || currentPlatform;
  if (platform !== "all") {
    filtered = filtered.filter((p) => p.platform === platform);
  }

  // Apply sorting
  if (currentSort === "lowToHigh") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "highToLow") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered);
}

// Sort toggle button
sortToggle.addEventListener("click", () => {
  if (currentSort === "lowToHigh") {
    currentSort = "highToLow";
    sortToggle.classList.remove("asc");
    sortToggle.classList.add("desc");
  } else {
    currentSort = "lowToHigh";
    sortToggle.classList.remove("desc");
    sortToggle.classList.add("asc");
  }

  applyFilters();
});

// Live search
searchInput.addEventListener("input", () => applyFilters());

// Toggle platform dropdown
filterToggle.addEventListener("click", () => {
  platformOptions.style.display =
    platformOptions.style.display === "block" ? "none" : "block";
});

// Close dropdown on outside click
document.addEventListener("click", (e) => {
  if (!platformOptions.contains(e.target) && !filterToggle.contains(e.target)) {
    platformOptions.style.display = "none";
  }
});

// Platform filter button clicks
platformOptions.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentPlatform = btn.getAttribute("data-platform");
    applyFilters(currentPlatform);
    platformOptions.style.display = "none";
  });
});
