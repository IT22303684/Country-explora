import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const CountryCard = ({ country, viewMode = "grid" }) => {
  // Ensure country has all expected properties with fallback values
  const name = country?.name || "Unknown Country";
  const flag = country?.flag || "https://via.placeholder.com/150";
  const population = country?.population || 0;
  const region = country?.region || "Unknown";
  const capital = country?.capital || "Unknown";
  const alpha3Code = country?.alpha3Code || country?.cca3 || "unknown";

  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { currentUser, addToFavorites, removeFromFavorites, checkFavorite } =
    useAuth();

  useEffect(() => {
    // Check if this country is in favorites when component mounts
    if (currentUser && alpha3Code && alpha3Code !== "unknown") {
      const checkFavoriteStatus = async () => {
        try {
          const isInFavorites = await checkFavorite(alpha3Code);
          setIsFavorite(isInFavorites);
        } catch (error) {
          console.error("Error checking favorite status:", error);
          setIsFavorite(false);
        }
      };

      checkFavoriteStatus();
    }
  }, [currentUser, alpha3Code, checkFavorite]);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      // If not logged in, redirect to login page
      navigate("/login");
      return;
    }

    if (!alpha3Code || alpha3Code === "unknown") {
      console.error("Cannot add/remove favorite: Missing country code");
      return;
    }

    try {
      let success;

      if (isFavorite) {
        success = await removeFromFavorites(alpha3Code);
      } else {
        success = await addToFavorites(alpha3Code);
      }

      if (success) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleExplore = (e) => {
    e.preventDefault();
    navigate(`/country/${alpha3Code}`);
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <img
            src={flag}
            alt={`${name} flag`}
            className="w-16 h-12 object-cover rounded-md shadow-sm"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Population: {population.toLocaleString()}</span>
              <span>Region: {region}</span>
              <span>Capital: {capital}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleFavorite}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            {isFavorite ? (
              <IoHeart className="w-5 h-5 text-red-500" />
            ) : (
              <IoHeartOutline className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
            )}
          </button>
          <button
            onClick={handleExplore}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
          >
            <span>Explore</span>
            <FiExternalLink className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={flag}
          alt={`${name} flag`}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {isFavorite ? (
            <IoHeart className="w-5 h-5 text-red-500" />
          ) : (
            <IoHeartOutline className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-300" />
          )}
        </button>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-neutral-800 group-hover:text-primary-500 transition-colors duration-300">
          {name}
        </h2>
        <div className="space-y-2 text-neutral-600 mb-6">
          <p className="flex items-center">
            <span className="font-semibold w-24">Population:</span>
            <span>{population.toLocaleString()}</span>
          </p>
          <p className="flex items-center">
            <span className="font-semibold w-24">Region:</span>
            <span>{region}</span>
          </p>
          <p className="flex items-center">
            <span className="font-semibold w-24">Capital:</span>
            <span>{capital}</span>
          </p>
        </div>
        <button
          onClick={handleExplore}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all duration-300 group/button shadow-md hover:shadow-lg"
        >
          <span>Explore</span>
          <FiExternalLink className="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </motion.div>
  );
};

export default CountryCard;
