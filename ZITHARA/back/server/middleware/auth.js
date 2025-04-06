const fs = require("fs");
const path = require("path");

function authenticate(req, callback) {
  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const { email, password } = JSON.parse(body);
      const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/users.json")));
      const user = users.find(u => u.email === email && u.password === password);
      if (user) callback(null, user);
      else callback("Invalid credentials", null);
    } catch (err) {
      callback("Authentication failed", null);
    }
  });
}

function authorize(role, user) {
  return user && user.role === role;
}

module.exports = { authenticate, authorize };