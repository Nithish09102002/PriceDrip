const products = []; // Will be loaded from JSON
const productList = document.getElementById("product-list");
const search = document.getElementById("search");
const filterPlatform = document.getElementById("filter-platform");

fetch("products.json")
  .then((res) => res.json())
  .then((data) => {
    products.push(...data);
    renderProducts(products);
  });

function renderProducts(items) {
  productList.innerHTML = "";
  items.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₹${product.price} ${
      product.lowest ? '<span style="color: green;">🔥 Lowest Ever</span>' : ""
    }</p>
      <p>⭐ ${product.rating} | ${product.platform}</p>
      <a href="${product.link}" target="_blank">Buy Now</a>
    `;
    productList.appendChild(card);
  });
}

function applyFilters() {
  const keyword = search.value.toLowerCase();
  const platform = filterPlatform.value;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(keyword) &&
      (platform ? p.platform === platform : true)
  );

  renderProducts(filtered);
}

search.addEventListener("input", applyFilters);
filterPlatform.addEventListener("change", applyFilters);
