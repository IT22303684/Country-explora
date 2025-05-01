// Auth service to interact with the backend API
import api from "./api";

// Get stored user from localStorage
const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Store user in localStorage
const storeUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Store token in localStorage
const storeToken = (token) => {
  localStorage.setItem("token", token);
};

// Register a new user
export const registerUser = async (email, password, name) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    const { token, user } = response.data;

    // Store token and user data
    storeToken(token);
    storeUser(user);

    return user;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Registration failed");
    }
    throw new Error("Registration failed. Please try again later.");
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    // Store token and user data
    storeToken(token);
    storeUser(user);

    return user;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw new Error("Login failed. Please try again later.");
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Check if user is logged in
export const getCurrentUser = async () => {
  const storedUser = getStoredUser();

  if (!storedUser) return null;

  try {
    // Verify token is still valid by getting current user data
    const response = await api.get("/auth/me");
    const updatedUser = response.data;

    // Update stored user with latest data
    storeUser(updatedUser);

    return updatedUser;
  } catch (error) {
    // If token is invalid, clear storage
    if (error.response && error.response.status === 401) {
      logoutUser();
    }
    return null;
  }
};

// Add country to favorites
export const addFavoriteCountry = async (countryCode) => {
  try {
    const response = await api.post("/users/favorites", { countryCode });

    // Update user in localStorage with new favorites
    const user = getStoredUser();
    if (user) {
      user.favorites = response.data;
      storeUser(user);
    }

    return true;
  } catch (error) {
    console.error("Error adding favorite:", error);
    return false;
  }
};

// Remove country from favorites
export const removeFavoriteCountry = async (countryCode) => {
  try {
    const response = await api.delete(`/users/favorites/${countryCode}`);

    // Update user in localStorage with new favorites
    const user = getStoredUser();
    if (user) {
      user.favorites = response.data;
      storeUser(user);
    }

    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return false;
  }
};

// Get user's favorite countries
export const getFavoriteCountries = () => {
  const user = getStoredUser();
  return user && user.favorites ? user.favorites : [];
};

// Check if a country is in favorites
export const isCountryFavorite = async (countryCode) => {
  try {
    const response = await api.get(`/users/favorites/${countryCode}`);
    return response.data.isFavorite;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};
