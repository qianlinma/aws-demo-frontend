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

    statusElement.textContent = `${products.length} products loaded.`;
    productsElement.replaceChildren(...products.map(renderProduct));
  } catch (error) {
    statusElement.textContent = `Failed to load products. ${error.message}`;
    statusElement.classList.add("error");
  }
}

function renderProduct(product) {
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

  article.append(image, title, path);
  return article;
}

refreshButton.addEventListener("click", loadProducts);
loadProducts();
