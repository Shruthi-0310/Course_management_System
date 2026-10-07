import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:3001";

const AppContext = createContext();

function AppProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getData = async () => {
    try {
      setLoading(true);
      setError("");

      const student = await axios.get(`${API_URL}/students/1`);
      const courses = await axios.get(`${API_URL}/courses`);

      setStudent(student.data);
      setCourses(courses.data);
    } catch (error) {
      setError("Unable to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        student,
        courses,
        loading,
        error,
        getData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function Dashboard() {
  const { student, courses, loading, error, getData } =
    useContext(AppContext);

  if (loading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center">
        <h2>{error}</h2>
        <button onClick={getData}>Retry</button>
      </div>
    );
  }

  const completed = courses.filter(
    (course) => course.status === "Completed"
  ).length;

  const progress = courses.filter(
    (course) => course.status === "In Progress"
  ).length;

  const enrolled = courses.filter(
    (course) => course.status === "Enrolled"
  ).length;

  return (
    <div className="app">

      <header>
        <h1>Student Learning Portal</h1>
        <p>Dashboard</p>
      </header>

      <main>

        <h2>Welcome, {student.name} 👋</h2>

        <div className="card">
          <h2>Student Information</h2>

          <p>
            <b>Name:</b> {student.name}
          </p>

          <p>
            <b>Email:</b> {student.email}
          </p>

          <p>
            <b>Course:</b> {student.course}
          </p>

          <p>
            <b>Year:</b> {student.year}
          </p>
        </div>

        <h2>My Courses</h2>

        <div className="courses">

          {courses.map((course) => (

            <div className="course" key={course.id}>

              <h3>{course.title}</h3>

              <p>
                Instructor: {course.instructor}
              </p>

              <span className="status">
                {course.status}
              </span>

            </div>

          ))}

        </div>

        <h2>Enrollment Status</h2>

        <div className="stats">

          <div>
            <h3>{courses.length}</h3>
            <p>Total Courses</p>
          </div>

          <div>
            <h3>{completed}</h3>
            <p>Completed</p>
          </div>

          <div>
            <h3>{progress}</h3>
            <p>In Progress</p>
          </div>

          <div>
            <h3>{enrolled}</h3>
            <p>Enrolled</p>
          </div>

        </div>

        <button onClick={getData}>
          Refresh Data
        </button>

      </main>

    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

export default App;
