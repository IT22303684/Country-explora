import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getCurrentUser,
  loginUser as login,
  registerUser as register,
  logoutUser as logout,
  addFavoriteCountry,
  removeFavoriteCountry,
  getFavoriteCountries,
  isCountryFavorite,
} from "../services/authService";

// Create the context
const AuthContext = createContext(null);

// Auth context provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // Ensure user has all required properties
          const safeUser = {
            ...user,
            name: user.name || "User",
            favorites: user.favorites || [],
          };
          setCurrentUser(safeUser);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login functionality
  const loginUser = async (email, password) => {
    try {
      setError("");
      setLoading(true);
      const user = await login(email, password);
      // Ensure user has name property
      const safeUser = {
        ...user,
        name: user.name || "User",
        favorites: user.favorites || [],
      };
      setCurrentUser(safeUser);
      return safeUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register functionality
  const registerUser = async (email, password, name) => {
    try {
      setError("");
      setLoading(true);
      const user = await register(email, password, name);
      // Ensure user has name property
      const safeUser = {
        ...user,
        name: user.name || name || "User",
        favorites: user.favorites || [],
      };
      setCurrentUser(safeUser);
      return safeUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout functionality
  const logoutUser = () => {
    logout();
    setCurrentUser(null);
  };

  // Add a country to favorites
  const addToFavorites = async (countryCode) => {
    if (!currentUser) return false;

    try {
      const success = await addFavoriteCountry(countryCode);

      // If successful, get updated favorites from the API response
      // The user object is already updated in localStorage by the authService
      const updatedUser = {
        ...currentUser,
        favorites: await getFavoriteCountries(),
      };

      setCurrentUser(updatedUser);
      return success;
    } catch (error) {
      console.error("Add to favorites error:", error);
      return false;
    }
  };

  // Remove a country from favorites
  const removeFromFavorites = async (countryCode) => {
    if (!currentUser) return false;

    try {
      const success = await removeFavoriteCountry(countryCode);

      // If successful, get updated favorites from the API response
      // The user object is already updated in localStorage by the authService
      const updatedUser = {
        ...currentUser,
        favorites: await getFavoriteCountries(),
      };

      setCurrentUser(updatedUser);
      return success;
    } catch (error) {
      console.error("Remove from favorites error:", error);
      return false;
    }
  };

  // Check if a country is in favorites
  const checkFavorite = async (countryCode) => {
    try {
      return await isCountryFavorite(countryCode);
    } catch (error) {
      console.error("Check favorite error:", error);
      return false;
    }
  };

  // Get all favorite countries
  const getFavorites = () => {
    return getFavoriteCountries();
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    addToFavorites,
    removeFromFavorites,
    checkFavorite,
    getFavorites,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
