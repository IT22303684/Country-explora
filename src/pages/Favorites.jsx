import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchCountryByCode } from '../services/countryService';
import CountryCard from '../components/CountryCard';
import { FiHeart, FiLogIn } from 'react-icons/fi';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      duration: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const Favorites = () => {
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, getFavorites } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const favoriteIds = getFavorites();
        
        if (favoriteIds.length === 0) {
          setFavoriteCountries([]);
          setLoading(false);
          return;
        }
        
        // Fetch all favorite countries in parallel
        const countriesPromises = favoriteIds.map(code => fetchCountryByCode(code));
        const countries = await Promise.all(countriesPromises);
        
        setFavoriteCountries(countries);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [currentUser, getFavorites]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <FiHeart className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Favorites</h2>
          <p className="text-gray-600 text-lg mb-8">
            Sign in to save and track your favorite countries
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiLogIn className="mr-2" />
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Favorite Countries</h2>
          <p className="text-gray-600">
            {favoriteCountries.length > 0
              ? 'Countries you have saved'
              : 'You have not saved any countries yet'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : favoriteCountries.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {favoriteCountries.map((country) => (
              <motion.div
                key={`country-${country.alpha3Code}`}
                variants={itemVariants}
              >
                <CountryCard country={country} viewMode="grid" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 mb-6">
              You haven't added any countries to your favorites yet.
            </p>
            <Link
              to="/countries"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Explore Countries
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites; 