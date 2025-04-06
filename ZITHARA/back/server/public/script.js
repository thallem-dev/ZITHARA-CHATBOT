let isLogin = true;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("auth-form").addEventListener("submit", handleAuth);
});

function toggleForm() {
  isLogin = !isLogin;

  const formContainer = document.getElementById("form-container");

  formContainer.innerHTML = isLogin
    ? `
    <h2>Login</h2>
    <form id="auth-form">
      <input type="text" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Password" required />
      <div class="remember">
        <input type="checkbox" id="remember" />
        <label for="remember">Remember Me</label>
      </div>
      <button type="submit">Submit</button>
    </form>
    <div class="toggle" onclick="toggleForm()">Don't have an account? Register</div>`
    : `
    <h2>Register</h2>
    <form id="auth-form">
      <input type="text" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Password" required />
      <select id="role" required>
        <option value="">Select Role</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <div class="remember">
        <input type="checkbox" id="remember" />
        <label for="remember">Remember Me</label>
      </div>
      <button type="submit">Submit</button>
    </form>
    <div class="toggle" onclick="toggleForm()">Already have an account? Login</div>`;

  document.getElementById("auth-form").addEventListener("submit", handleAuth);
}

function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const remember = document.getElementById("remember").checked;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (isLogin) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      alert("Login successful");
      if (remember) localStorage.setItem("user", JSON.stringify(user));
      window.location.href = user.role === "admin" ? "/admin" : "/chat";
    } else {
      alert("Invalid credentials");
    }
  } else {
    const role = document.getElementById("role").value;
    if (!role) return alert("Please select a role");
    if (users.some(u => u.email === email)) return alert("User already exists");
    const newUser = { email, password, role };
    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    if (remember) localStorage.setItem("user", JSON.stringify(newUser));
    alert("Registration successful! Please log in.");
    toggleForm(); // Switch back to login form
  }
}