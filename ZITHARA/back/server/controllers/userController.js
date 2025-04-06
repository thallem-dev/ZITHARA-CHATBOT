const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { hashPassword, comparePassword } = require("../utils/hash");

const usersFile = path.join(__dirname, "../data/users.json");

function getUsers() {
  return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function registerUser(req, res, body) {
  const { name, email, password, role } = JSON.parse(body);
  const users = getUsers();

  if (users.find(u => u.email === email)) {
    res.writeHead(400);
    return res.end(JSON.stringify({ message: "User already exists" }));
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashPassword(password),
    role: role || "user"
  };

  users.push(newUser);
  saveUsers(users);

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "User registered successfully" }));
}

function loginUser(req, res, body) {
  const { email, password } = JSON.parse(body);
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user || !comparePassword(password, user.password)) {
    res.writeHead(401);
    return res.end(JSON.stringify({ message: "Invalid credentials" }));
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  );
}

module.exports = { registerUser, loginUser };