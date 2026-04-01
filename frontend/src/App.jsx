import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import AppRouter from "./AppRouter";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LogoutButton from "./components/LogoutButton";

// Navigation bar with auth-aware links
function Navbar() {
  const { isAuthenticated, user } = useAuth();
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "1rem",
        background: "#222",
        color: "#fff",
      }}
    >
      <Link
        to="/"
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.2rem",
          textDecoration: "none",
          marginRight: 24,
        }}
      >
        CyberGuardian
      </Link>
      {isAuthenticated && <Link to="/">Screenshot Analyzer</Link>}
      {isAuthenticated && <Link to="/chatbot">Chatbot</Link>}
      {isAuthenticated && <Link to="/profile">Profile</Link>}
      {!isAuthenticated && <Link to="/login">Login</Link>}
      {!isAuthenticated && <Link to="/register">Register</Link>}
      {isAuthenticated && user && (
        <span style={{ marginLeft: "auto", marginRight: 8 }}>
          Hi, {user.full_name}
        </span>
      )}
      {isAuthenticated && <LogoutButton />}
    </nav>
  );
}

// Main App component with AuthProvider and routing
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
          <AppRouter />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
