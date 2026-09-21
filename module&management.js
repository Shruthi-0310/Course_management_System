import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar({ loggedIn, setLoggedIn }) {
  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      {!loggedIn ? (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <button onClick={() => setLoggedIn(false)}>Logout</button>
        </>
      )}
    </nav>
  );
}

function Home() {
  return <h2>Home Page</h2>;
}

function Login({ setLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function login(e) {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    setError("");
    setSuccess("Login successful!");
    setLoggedIn(true);

    setTimeout(() => navigate("/dashboard"), 1000);
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={login}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      <p>{error}</p>
      <p>{success}</p>
    </div>
  );
}

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function register(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("All fields are required");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setError("Phone number must contain 10 digits");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    setError("");
    setSuccess("Registration successful!");
  }

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={register}>
        <input
          placeholder="Name"
          onChange={(e) => setForm({...form, name: e.target.value})}
        />
        <br /><br />

        <input
          placeholder="Email"
          onChange={(e) => setForm({...form, email: e.target.value})}
        />
        <br /><br />

        <input
          placeholder="Phone"
          onChange={(e) => setForm({...form, phone: e.target.value})}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({...form, password: e.target.value})}
        />
        <br /><br />

        <button type="submit">Register</button>
      </form>

      <p>{error}</p>
      <p>{success}</p>
    </div>
  );
}

function Dashboard() {
  return <h2>Welcome to Dashboard!</h2>;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login setLoggedIn={setLoggedIn} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;