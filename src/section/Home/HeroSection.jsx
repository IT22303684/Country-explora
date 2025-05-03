import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { FaSearch, FaFilter, FaHeart } from "react-icons/fa";
import { fetchAllCountries } from "../../services/countryService";

const HeroSection = () => {
  const [featuredCountries, setFeaturedCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const loadFeaturedCountries = async () => {
      try {
        const countries = await fetchAllCountries();
        // Get 5 random countries for the slider
        const randomCountries = countries
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        setFeaturedCountries(randomCountries);
      } catch (error) {
        console.error("Error loading featured countries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCountries();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCountries.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredCountries.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredCountries.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredCountries.length) % featuredCountries.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero_bg.webp"
          alt="World Map Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-600/90 opacity-60" />
      </div>

      <div className="container mt-20 mb-20 xl:mt-0 mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
            >
              Explore the World's Countries
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8 text-white/90"
            >
              Discover detailed information about every country, from population
              statistics to regional insights.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
              >
                <FaSearch className="text-3xl mx-auto mb-4 text-white" />
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Search Countries
                </h3>
                <p className="text-white/80">
                  Find any country quickly with our powerful search
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
              >
                <FaFilter className="text-3xl mx-auto mb-4 text-white" />
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Filter by Region
                </h3>
                <p className="text-white/80">
                  Explore countries by their regions
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
              >
                <FaHeart className="text-3xl mx-auto mb-4 text-white" />
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Save Favorites
                </h3>
                <p className="text-white/80">
                  Keep track of your favorite countries
                </p>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            >
              <Link
                to="/countries"
                className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Explore Countries
              </Link>
              <Link
                to="/favorites"
                className="px-8 py-3 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors text-white"
              >
                View Favorites
              </Link>
            </motion.div>
          </motion.div>

          {/* Slider Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl"
          >
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <div className="h-full relative">
                      <img
                        src={
                          featuredCountries[currentSlide]?.flags?.png ||
                          featuredCountries[currentSlide]?.flags?.svg
                        }
                        alt={featuredCountries[currentSlide]?.name?.common}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {featuredCountries[currentSlide]?.name?.common}
                          </h3>
                          <p className="text-white/80">
                            {featuredCountries[currentSlide]?.region} •{" "}
                            {Array.isArray(
                              featuredCountries[currentSlide]?.capital
                            )
                              ? featuredCountries[currentSlide]?.capital[0]
                              : "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <FiArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <FiArrowRight className="w-6 h-6" />
                </button>

                {/* Dots Navigation */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {featuredCountries.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? "bg-white w-8"
                          : "bg-white/50 hover:bg-white/75 w-3"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
