const {
  getAll,
  addProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const { requireAuth, requireAdmin } = require("../middleware/auth");

function productRoutes(req, res) {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const urlParts = req.url.split("/");
    const id = urlParts.length === 4 ? urlParts[3] : null;

    let parsedBody = {};
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        res.writeHead(400);
        return res.end(JSON.stringify({ message: "Invalid JSON body" }));
      }
    }

    // Mock user injection from request header or body
    const userId = parsedBody.userId || req.headers["x-user-id"];
    if (!userId) {
      res.writeHead(401);
      return res.end(JSON.stringify({ message: "User ID missing" }));
    }

    // Add req.user to simulate middleware-style
    req.user = { id: userId }; // Middleware will overwrite with full user

    // GET All Products (any authenticated user)
    if (req.method === "GET" && req.url === "/api/products") {
      requireAuth(req, res, () => {
        getAll(req, res);
      });
    }

    // POST Add Product (admin only)
    else if (req.method === "POST" && req.url === "/api/products") {
      requireAuth(req, res, () => {
        requireAdmin(req, res, () => {
          addProduct(req, res, body);
        });
      });
    }

    // PUT Update Product by ID (admin only)
    else if (req.method === "PUT" && id) {
      requireAuth(req, res, () => {
        requireAdmin(req, res, () => {
          updateProduct(req, res, body, id);
        });
      });
    }

    // DELETE Product by ID (admin only)
    else if (req.method === "DELETE" && id) {
      requireAuth(req, res, () => {
        requireAdmin(req, res, () => {
          deleteProduct(req, res, id);
        });
      });
    }

    // Route not found
    else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Route not found" }));
    }
  });
}

module.exports = productRoutes;