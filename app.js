const productsElement = document.querySelector("#products");
const statusElement = document.querySelector("#status");
const refreshButton = document.querySelector("#refreshButton");

// 未来前端容器和后端走同一个域名/ALB 时，直接请求相对路径即可。
// 本地临时测试其他 API 地址时，可以改成你的 ALB 地址，例如 "http://xxx.elb.amazonaws.com"。
const API_BASE_URL = "";

async function loadProducts() {
  statusElement.textContent = "Loading products...";
  statusElement.classList.remove("error");
  productsElement.replaceChildren();

  try {
    const response = await fetch(`${API_BASE_URL}/api/getAllProducts`);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    const products = data.products ?? [];

    if (products.length === 0) {
      statusElement.textContent = "No products found.";
      return;
    }

    statusElement.textContent = `Loading inventory and user data for ${products.length} products...`;

    const productDetails = await Promise.all(
      products.map((product) => loadProductDetails(product))
    );

    statusElement.textContent = `${products.length} products loaded with inventory and user data.`;
    productsElement.replaceChildren(...productDetails.map(renderProduct));
  } catch (error) {
    statusElement.textContent = `Failed to load products. ${error.message}`;
    statusElement.classList.add("error");
  }
}

async function loadProductDetails(product) {
  const response = await fetch(`${API_BASE_URL}/api/products/${product.id}/details`);

  if (!response.ok) {
    throw new Error(`Details request failed for product ${product.id}: ${response.status}`);
  }

  return response.json();
}

function renderProduct(productDetails) {
  const product = productDetails.product ?? {};
  const inventory = productDetails.inventory ?? {};
  const userProfile = productDetails.userProfile ?? {};

  const article = document.createElement("article");
  article.className = "product";

  const image = document.createElement("img");
  image.src = product.path ?? "";
  image.alt = product.title ?? "Product image";
  image.loading = "lazy";

  const title = document.createElement("h2");
  title.textContent = product.title ?? "Untitled product";

  const path = document.createElement("p");
  path.textContent = product.path ?? "";

  const meta = document.createElement("dl");
  meta.className = "product-meta";

  appendMeta(meta, "Inventory", formatInventory(inventory));
  appendMeta(meta, "Warehouse", inventory.warehouseRegion ?? "unknown");
  appendMeta(meta, "Member", userProfile.name ?? "unknown");
  appendMeta(meta, "Level", userProfile.membershipLevel ?? "unknown");
  appendMeta(meta, "Region", userProfile.region ?? "unknown");

  article.append(image, title, path, meta);
  return article;
}

function appendMeta(container, label, value) {
  const term = document.createElement("dt");
  term.textContent = label;

  const description = document.createElement("dd");
  description.textContent = value;

  container.append(term, description);
}

function formatInventory(inventory) {
  const quantity = inventory.quantityAvailable ?? 0;
  return inventory.available ? `${quantity} available` : "Out of stock";
}

refreshButton.addEventListener("click", loadProducts);
loadProducts();
