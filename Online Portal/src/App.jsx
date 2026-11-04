import React, { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("register");
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const API = "http://localhost:5000/api/auth";

  async function register() {
    if (!name || !roll || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          roll,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Registration Successful!");

      setName("");
      setRoll("");
      setPassword("");
      setPage("login");

    } catch (error) {
      alert("Server connection failed");
    }
  }

  async function login() {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setToken(data.token);
      localStorage.setItem("token", data.token);

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      setPage("dashboard");

      setPassword("");

    } catch (error) {
      alert("Server connection failed");
    }
  }

  async function accessRoute() {
    try {
      const response = await fetch(`${API}/student`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

    } catch (error) {
      alert("Unable to access route");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);
    setEmail("");
    setPassword("");

    setPage("login");
  }

  return (
    <div className="app">

      <header>
        <h1>Online Student Portal</h1>
        <p>Welcome to Student Management System</p>
      </header>

      <div className="container">

        {page === "register" && (
          <>
            <h2>Student Registration</h2>

            <input
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <input
              placeholder="Roll Number"
              value={roll}
              onChange={e => setRoll(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button onClick={register}>
              Register
            </button>

            <p>
              Already registered?
              <span onClick={() => setPage("login")}>
                Login
              </span>
            </p>
          </>
        )}

        {page === "login" && (
          <>
            <h2>Student Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button onClick={login}>
              Login
            </button>

            <p>
              New Student?
              <span onClick={() => setPage("register")}>
                Register Here
              </span>
            </p>
          </>
        )}

        {page === "dashboard" && user && (
          <>
            <h2>Student Dashboard</h2>

            <h3>Welcome, {user.name}!</h3>

            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>

            <h3>Authentication Status</h3>
            <p>JWT Token Generated Successfully</p>

            <h3>Route Authorization</h3>

            <button onClick={accessRoute}>
              Access Student Route
            </button>

            <button onClick={logout}>
              Logout
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default App;