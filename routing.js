import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> |
      <Link to="/login">Login</Link> |
      <Link to="/register">Register</Link> |
      <Link to="/dashboard">Dashboard</Link> |
      <Link to="/courses">Courses</Link>
    </nav>
  );
}

function Home() {
  return <h2>Home Page</h2>;
}

function Login() {
  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" />
      <br />
      <input placeholder="Password" type="password" />
      <br />
      <button>Login</button>
    </div>
  );
}

function Register() {
  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" />
      <br />
      <input placeholder="Email" />
      <br />
      <input placeholder="Password" type="password" />
      <br />
      <button>Register</button>
    </div>
  );
}

function Dashboard() {
  return <h2>Dashboard</h2>;
}

function CourseCard({ name }) {
  return (
    <div>
      <h3>{name}</h3>
      <button>View Course</button>
    </div>
  );
}

function Courses() {
  return (
    <div>
      <h2>Courses</h2>
      <CourseCard name="React JS" />
      <CourseCard name="Python" />
      <CourseCard name="Artificial Intelligence" />
    </div>
  );
}

function Footer() {
  return <footer>© 2026 React Application</footer>;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;