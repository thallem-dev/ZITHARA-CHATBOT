// Catch unexpected errors globally
process.on("uncaughtException", console.error);

const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const chatRoutes = require("./routes/chatRoutes"); // Chat route added

function startServer() {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    // Handle CORS for frontend access
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      return res.end();
    }

    // Root Route for base URL
    if (pathname === "/" && req.method === "GET") {
      const filePath = path.join(__dirname, "public", "index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // ✅ Custom route to serve chat.html at /chat
    if (pathname === "/chat" && req.method === "GET") {
      const filePath = path.join(__dirname, "public", "chat.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // ✅ Serve static frontend files (style.css, script.js, etc.)
    const staticFilePath = path.join(__dirname, "public", pathname);
    if (fs.existsSync(staticFilePath) && fs.lstatSync(staticFilePath).isFile()) {
      const ext = path.extname(staticFilePath).toLowerCase();
      const contentTypeMap = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript"
      };
      const contentType = contentTypeMap[ext] || "text/plain";

      res.writeHead(200, { "Content-Type": contentType });
      fs.createReadStream(staticFilePath).pipe(res);
      return;
    }

    // ✅ API Routes
    if (pathname.startsWith("/api/users")) {
      userRoutes(req, res);
    } else if (pathname.startsWith("/api/products")) {
      productRoutes(req, res);
    } else if (pathname.startsWith("/api/chat")) {
      chatRoutes(req, res);
    }

    // ❌ Fallback for undefined routes
    else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Not Found" }));
    }
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = startServer;