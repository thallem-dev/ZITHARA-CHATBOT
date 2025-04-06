const fs = require("fs");
const path = require("path");

const productFile = path.join(__dirname, "../data/products.json");

function getProducts() {
  return JSON.parse(fs.readFileSync(productFile, "utf-8"));
}

function saveProducts(products) {
  fs.writeFileSync(productFile, JSON.stringify(products, null, 2));
}

function getAll(req, res) {
  const products = getProducts();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(products));
}

function addProduct(req, res, body) {
  const { title, description } = JSON.parse(body);
  const products = getProducts();

  const newProduct = {
    id: Date.now(),
    title,
    description,
  };

  products.push(newProduct);
  saveProducts(products);

  res.writeHead(201);
  res.end(JSON.stringify({ message: "Product added" }));
}

function updateProduct(req, res, body, id) {
  const { title, description } = JSON.parse(body);
  const products = getProducts();
  const index = products.findIndex(p => p.id == id);

  if (index === -1) {
    res.writeHead(404);
    return res.end(JSON.stringify({ message: "Not found" }));
  }

  products[index] = { id, title, description };
  saveProducts(products);
  res.writeHead(200);
  res.end(JSON.stringify({ message: "Product updated" }));
}

function deleteProduct(req, res, id) {
  const products = getProducts();
  const updated = products.filter(p => p.id != id);

  if (products.length === updated.length) {
    res.writeHead(404);
    return res.end(JSON.stringify({ message: "Not found" }));
  }

  saveProducts(updated);
  res.writeHead(200);
  res.end(JSON.stringify({ message: "Product deleted" }));
}

module.exports = { getAll, addProduct, updateProduct, deleteProduct };