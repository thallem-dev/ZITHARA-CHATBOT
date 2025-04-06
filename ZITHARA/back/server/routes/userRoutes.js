const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "../data/users.json");

function readUsers() {
  if (!fs.existsSync(usersFilePath)) return [];
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

module.exports = (req, res) => {
  if (req.url === "/api/users/register" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { email, password } = JSON.parse(body);
      const users = readUsers();

      const exists = users.find(user => user.email === email);
      if (exists) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "User already exists" }));
      }

      users.push({ email, password });
      writeUsers(users);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Registration successful" }));
    });
  }

  else if (req.url === "/api/users/login" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { email, password } = JSON.parse(body);
      const users = readUsers();

      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Invalid email or password" }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Login successful" }));
    });
  }

  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User route not found" }));
  }
};