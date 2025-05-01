import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiClock,
  FiArrowRight,
  FiFlag,
  FiInfo,
} from "react-icons/fi";
import { FaGlobeAmericas } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";

// Mock country data with codes for search suggestions
const COUNTRY_DATA = [
  { name: "Afghanistan", code: "AFG" },
  { name: "Albania", code: "ALB" },
  { name: "Algeria", code: "DZA" },
  { name: "United States", code: "USA" },
  { name: "Canada", code: "CAN" },
  { name: "United Kingdom", code: "GBR" },
  { name: "Australia", code: "AUS" },
  { name: "Germany", code: "DEU" },
  { name: "France", code: "FRA" },
  { name: "Japan", code: "JPN" },
  { name: "China", code: "CHN" },
  { name: "Brazil", code: "BRA" },
  { name: "Mexico", code: "MEX" },
  { name: "India", code: "IND" },
  { name: "Spain", code: "ESP" },
  { name: "Jordan", code: "JOR" },
  { name: "Jamaica", code: "JAM" },
  { name: "Jersey", code: "JEY" },
  { name: "Kazakhstan", code: "KAZ" },
  { name: "Kenya", code: "KEN" },
  { name: "Kiribati", code: "KIR" },
  { name: "Kuwait", code: "KWT" },
  { name: "Kyrgyzstan", code: "KGZ" },
];

function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const mobileMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAuth();

  // Get recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search suggestions logic
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);

      // Check if the search query looks like a country code (3 letters)
      const isCountryCode = /^[A-Za-z]{3}$/.test(searchQuery);
      const query = searchQuery.toLowerCase().trim();

      let filteredResults = [];

      if (isCountryCode) {
        // Search by country code
        filteredResults = COUNTRY_DATA.filter(
          (country) => country.code.toLowerCase() === query
        );
      } else if (query.length === 1) {
        // If only one letter is typed, find countries starting with that letter
        filteredResults = COUNTRY_DATA.filter((country) =>
          country.name.toLowerCase().startsWith(query)
        ).slice(0, 10);
      } else {
        // For longer queries, search for countries containing the query anywhere in the name
        // But prioritize those that start with the query
        const startsWithMatches = COUNTRY_DATA.filter((country) =>
          country.name.toLowerCase().startsWith(query)
        );

        const containsMatches = COUNTRY_DATA.filter(
          (country) =>
            !country.name.toLowerCase().startsWith(query) &&
            country.name.toLowerCase().includes(query)
        );

        filteredResults = [...startsWithMatches, ...containsMatches].slice(
          0,
          10
        );
      }

      setSearchResults(filteredResults);
      setIsSearching(false);
      setShowSearchResults(
        filteredResults.length > 0 || recentSearches.length > 0
      );
    } else {
      setSearchResults([]);
      setShowSearchResults(recentSearches.length > 0);
    }
  }, [searchQuery, recentSearches.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Check if query might be a country code (3 letters)
      const isCountryCode = /^[A-Za-z]{3}$/.test(searchQuery.trim());

      // Find exact country match if possible
      const exactMatch = COUNTRY_DATA.find(
        (country) =>
          country.name.toLowerCase() === searchQuery.trim().toLowerCase() ||
          country.code.toLowerCase() === searchQuery.trim().toLowerCase()
      );

      // Save to recent searches
      const searchItem = exactMatch
        ? {
            query: searchQuery.trim(),
            name: exactMatch.name,
            code: exactMatch.code,
          }
        : { query: searchQuery.trim() };

      const newRecentSearches = [
        searchItem,
        ...recentSearches.filter(
          (s) =>
            (s.query || s) !== searchQuery.trim() && s.code !== searchItem.code
        ),
      ].slice(0, 5);

      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

      // Navigate to the appropriate page
      if (exactMatch) {
        navigate(`/country/${exactMatch.code}`);
      } else if (isCountryCode) {
        navigate(`/country/${searchQuery.trim().toUpperCase()}`);
      } else {
        navigate(`/search/${searchQuery.trim()}`);
      }

      setIsMobileMenuOpen(false);
      setSearchQuery("");
      setShowSearchResults(false);
    }
  };

  const handleSearchItemClick = (result) => {
    // Save to recent searches
    const searchItem =
      typeof result === "string"
        ? { query: result }
        : { query: result.name, name: result.name, code: result.code };

    const newRecentSearches = [
      searchItem,
      ...recentSearches.filter(
        (s) => (s.query || s) !== searchItem.query && s.code !== searchItem.code
      ),
    ].slice(0, 5);

    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

    // Navigate to the appropriate page
    if (typeof result === "string") {
      // Handle case when result is just a string from old recent searches
      const isCountryCode = /^[A-Za-z]{3}$/.test(result);
      if (isCountryCode) {
        navigate(`/country/${result.toUpperCase()}`);
      } else {
        navigate(`/search/${result}`);
      }
    } else {
      // Handle case when result is a country object
      navigate(`/country/${result.code}`);
    }

    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleClearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleLogout = () => {
    logoutUser();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  // Helper function to display search item
  const renderSearchItem = (item) => {
    if (typeof item === "string") {
      // Handle legacy string format
      return item;
    } else {
      // Handle new object format
      return item.name || item.query;
    }
  };

  // Show search suggestions when search input is focused
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery.trim().length > 0 || recentSearches.length > 0) {
      setShowSearchResults(true);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2">
            <FaGlobeAmericas className="text-primary-500 text-2xl" />
            <span className="text-2xl font-heading font-bold text-primary-500">
              Countries Explorer
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-neutral-700 hover:text-primary-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/countries"
              className="text-neutral-700 hover:text-primary-500 transition-colors"
            >
              All Countries
            </Link>
            <Link
              to="/favorites"
              className="flex items-center space-x-1 text-neutral-700 hover:text-primary-500 transition-colors group"
            >
              <IoHeart className="text-red-500 text-xl group-hover:text-red-600 transition-colors" />
              <span>Favorites</span>
            </Link>
          </div>

          {/* Search and Account - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    placeholder="Search country name or code..."
                    className="w-72 pl-10 pr-4 py-2.5 rounded-full border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-500/50 transition-all duration-300"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-600"
                    aria-label="Search"
                  >
                    <FiArrowRight />
                  </button>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                  {isSearching ? (
                    <div className="p-3 text-sm text-gray-500">
                      Searching...
                    </div>
                  ) : (
                    <>
                      {/* Search suggestions */}
                      {searchResults.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                            Countries
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {searchResults.map((result, index) => (
                              <div
                                key={`suggestion-${index}`}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm text-gray-700 flex items-center justify-between"
                                onClick={() => handleSearchItemClick(result)}
                              >
                                <div className="flex items-center">
                                  <FiFlag
                                    className="mr-2 text-gray-400"
                                    size={14}
                                  />
                                  <span>{result.name}</span>
                                </div>
                                <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono">
                                  {result.code}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 flex justify-between items-center">
                            <span>Recent Searches</span>
                            <button
                              className="text-xs text-gray-400 hover:text-gray-600"
                              onClick={handleClearRecentSearches}
                            >
                              Clear
                            </button>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {recentSearches.map((search, index) => (
                              <div
                                key={`recent-${index}`}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm text-gray-700 flex items-center justify-between"
                                onClick={() => handleSearchItemClick(search)}
                              >
                                <div className="flex items-center">
                                  <FiClock
                                    className="mr-2 text-gray-400"
                                    size={14}
                                  />
                                  <span>{renderSearchItem(search)}</span>
                                </div>
                                {search.code && (
                                  <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono">
                                    {search.code}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Search Tip */}
                      <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center">
                          <FiInfo className="mr-1 text-primary-400" size={12} />
                          <span>
                            Tip: Type just a letter to see countries starting
                            with it
                          </span>
                        </div>
                      </div>

                      {/* No results */}
                      {searchQuery.trim().length > 0 &&
                        searchResults.length === 0 && (
                          <div className="p-3 text-sm text-gray-500">
                            No countries found. Try a different search.
                          </div>
                        )}
                    </>
                  )}
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {currentUser.name
                        ? currentUser.name.charAt(0).toUpperCase()
                        : "?"}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {currentUser.name || "User"}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser.email || ""}
                      </p>
                    </div>
                    <Link
                      to="/favorites"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <IoHeart className="text-red-500" />
                        <span>My Favorites</span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-2">
                        <FiLogOut className="text-gray-500" />
                        <span>Sign out</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-8 py-2.5 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-neutral-700 hover:text-primary-500 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Mobile User Info */}
          {currentUser && (
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center">
                  <span className="text-lg font-medium">
                    {currentUser.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : "?"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {currentUser.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser.email || ""}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Search */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search country name or code..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-full border ${
                  isSearchFocused ? "border-primary-500" : "border-neutral-200"
                } bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300`}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-600"
              >
                <FiArrowRight />
              </button>
            </form>

            {/* Mobile Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mt-2 bg-gray-50 rounded-lg p-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-500">
                    Recent Searches
                  </span>
                  <button
                    className="text-xs text-gray-400 hover:text-gray-600"
                    onClick={handleClearRecentSearches}
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.slice(0, 3).map((search, index) => (
                    <div
                      key={`mobile-recent-${index}`}
                      className="text-sm flex justify-between items-center"
                    >
                      <span
                        className="text-primary-600 cursor-pointer"
                        onClick={() => handleSearchItemClick(search)}
                      >
                        {renderSearchItem(search)}
                      </span>
                      {search.code && (
                        <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                          {search.code}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 space-y-2">
            <Link
              to="/"
              className="flex items-center px-4 py-3 rounded-lg text-neutral-700 hover:text-primary-500 hover:bg-neutral-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/countries"
              className="flex items-center px-4 py-3 rounded-lg text-neutral-700 hover:text-primary-500 hover:bg-neutral-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Countries
            </Link>
            <Link
              to="/favorites"
              className="flex items-center px-4 py-3 rounded-lg text-neutral-700 hover:text-primary-500 hover:bg-neutral-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <IoHeart className="text-red-500 text-xl mr-3" />
              Favorites
            </Link>
          </nav>

          {/* Mobile Login/Logout Button */}
          {currentUser ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="mt-auto flex items-center justify-center px-8 py-2.5 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              <FiLogOut className="mr-2" />
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="mt-auto px-8 py-2.5 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 text-center transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}

export default NavBar;
