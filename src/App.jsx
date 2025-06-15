import { Routes, Route, Navigate } from "react-router-dom";
import React, { createContext, useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Conversation from "./pages/Conversation";
import SingleConversation from "./pages/SingleConversation";
import { baseUrl } from "./api";
import { ToastProvider } from "./components/ToastSystem";
import DashboardLayout from "./components/Layout";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <AppContainer>{/* <LoadingText>Loading...</LoadingText> */}</AppContainer>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #000000;

  /* background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%); */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const LoadingText = styled.div`
  /* color: white; */
  font-size: 1.25rem;
`;

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <AppContainer>{/* <LoadingText>Loading...</LoadingText> */}</AppContainer>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = JSON.parse(sessionStorage.getItem("user") || "null");
      if (savedUser) {
        setIsAuthenticated(true);
        setCurrentUser(savedUser);
      }
      setLoading(false);
    };

    setTimeout(checkAuth, 500);
  }, []);

  const login = async (formData) => {
    // const user = { id: 1, email, name: email.split("@")[0] };
    // setCurrentUser(user);
    // setIsAuthenticated(true);
    // sessionStorage.setItem("user", JSON.stringify(user));

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        // Store token, navigate, or update context/state

        setCurrentUser(data.user);
        setIsAuthenticated(true);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("token", JSON.stringify(data.token));
        localStorage.setItem("token", JSON.stringify(data.token));
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("An error occurred while logging in.");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {/* <DashboardLayout> */}
                <Home />
                {/* </DashboardLayout> */}
              </ProtectedRoute>
            }
          />
          <Route path="/conversations" element={<Conversation />} />
          <Route path="/conversations/:id" element={<SingleConversation />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
