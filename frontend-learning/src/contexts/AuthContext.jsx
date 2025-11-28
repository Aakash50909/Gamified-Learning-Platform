import React, { createContext, useContext, useState, useEffect } from "react";

// ✅ FIXED: Use VITE_API_BASE_URL if available (Vercel), otherwise use Localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and user
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      console.log("✅ Login successful:", data.user.username);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Store token and user
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      console.log("✅ Signup successful:", data.user.username);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    if (!user?.id) {
      return { success: false, error: "User not logged in" };
    }

    try {
      // Call your backend API
      const response = await fetch(`${API_BASE_URL}/user/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Profile update failed");

      // Update user in state and localStorage
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      console.log("✅ Profile updated successfully");
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

  // ✨ NEW: Update user stats after completing problems
  const updateStats = (newStats) => {
    if (user) {
      const updatedUser = {
        ...user,
        dsaPoints: newStats.dsaPoints ?? user.dsaPoints,
        dsaRank: newStats.dsaRank ?? user.dsaRank,
        dsaStats: newStats.dsaStats ?? user.dsaStats,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("✅ User stats updated:", updatedUser);
    }
  };

  // ✨ NEW: Refresh user data from server
  const refreshUser = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/learning/progress?userId=${user.id}`
      );

      if (!response.ok) {
        console.log("Could not fetch user progress");
        return;
      }

      const data = await response.json();

      const updatedUser = {
        ...user,
        dsaPoints: data.points ?? user.dsaPoints,
        dsaRank: data.rank ?? user.dsaRank,
        dsaStats: data.stats ?? user.dsaStats,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("✅ User data refreshed from server");
    } catch (error) {
      console.error("Error refreshing user data:", error);
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
    updateProfile,
    updateStats,
    refreshUser,
    getAuthHeader,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};