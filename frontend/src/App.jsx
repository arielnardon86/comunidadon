import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./components/Dashboard";
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUsername(decodedToken.username);
    }
  }, [token]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? <Navigate to="/vow" replace /> : <Navigate to="/vow/login" replace />
        }
      />
      <Route
        path="/:building/login"
        element={
          !token ? (
            <Login setToken={setToken} />
          ) : (
            <Navigate to={`/${token ? JSON.parse(atob(token.split(".")[1])).building : "vow"}`} replace />
          )
        }
      />
      <Route
        path="/:building"
        element={
          token ? (
            <Dashboard
              token={token}
              username={username}
              tables={[]}
              reservations={[]}
              setReservations={() => {}}
            />
          ) : (
            <Navigate to={`/${token ? JSON.parse(atob(token.split(".")[1])).building : "vow"}/login`} replace />
          )
        }
      />
    </Routes>
  );
}

export default App;