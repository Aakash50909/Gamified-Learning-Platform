import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Call your backend API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();

      // Store token and user
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      // Mock login for development
      console.log("API not available, using mock login");

      const mockUser = {
        id: "user123",
        email: email,
        username: "CodeNinja_Pro",
        avatar: "ninja",
        bio: "Passionate coder and problem solver. Love learning new algorithms and competitive programming.",
        location: "San Francisco, CA",
        joinedDate: "Jan 2024",
        xp: 2450,
        level: 12,
        streak: 7,
      };
      const mockToken = "mock-jwt-token-" + Date.now();

      localStorage.setItem("authToken", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      setToken(mockToken);
      setUser(mockUser);

      return { success: true };
    }
  };

  const signup = async (email, password, username) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) throw new Error("Signup failed");

      const data = await response.json();

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      // Mock signup for development
      console.log("API not available, using mock signup");

      const mockUser = {
        id: "user-" + Date.now(),
        email: email,
        username: username,
        avatar: "robot",
        bio: "New learner on LearnQuest!",
        location: "Unknown",
        joinedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        xp: 0,
        level: 1,
        streak: 0,
      };
      const mockToken = "mock-jwt-token-" + Date.now();

      localStorage.setItem("authToken", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      setToken(mockToken);
      setUser(mockUser);

      return { success: true };
    }
  };

  // NEW: Update profile function
  const updateProfile = async (profileData) => {
    try {
      // Call your backend API
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Profile update failed");

      const data = await response.json();

      // Update user in state and localStorage
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      // Mock profile update for development
      console.log("API not available, using mock profile update");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user in state and localStorage
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    signup,
    logout,
    updateProfile, // NEW: Add updateProfile to context
    getAuthHeader,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
