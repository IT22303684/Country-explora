import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiGrid,
  FiList,
  FiSave,
  FiMenu,
} from "react-icons/fi";
import CountryCard from "../components/CountryCard";
import { fetchAllCountries } from "../services/countryService";

const ITEMS_PER_PAGE = 20;

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

const AllCountries = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("countryFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          region: "",
          subregion: "",
          population: { min: "", max: "" },
          area: { min: "", max: "" },
          language: "",
          currency: "",
          timezone: "",
          independent: "all",
        };
  });
  const [sortBy, setSortBy] = useState(
    () => localStorage.getItem("countrySortBy") || "name"
  );
  const [sortOrder, setSortOrder] = useState(
    () => localStorage.getItem("countrySortOrder") || "asc"
  );
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [uniqueSubregions, setUniqueSubregions] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [uniqueCurrencies, setUniqueCurrencies] = useState([]);
  const [uniqueTimezones, setUniqueTimezones] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  // Save filter preferences
  useEffect(() => {
    localStorage.setItem("countryFilters", JSON.stringify(filters));
    localStorage.setItem("countrySortBy", sortBy);
    localStorage.setItem("countrySortOrder", sortOrder);
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchAllCountries();
        setCountries(data);
        setFilteredCountries(data);

        // Extract unique values for filters
        const regions = new Set();
        const subregions = new Set();
        const languages = new Set();
        const currencies = new Set();
        const timezones = new Set();

        data.forEach((country) => {
          if (country.region) regions.add(country.region);
          if (country.subregion) subregions.add(country.subregion);

          // Handle languages
          if (country.languages) {
            Object.values(country.languages).forEach((lang) => {
              if (typeof lang === "string") {
                languages.add(lang);
              } else if (lang && typeof lang === "object") {
                languages.add(lang.name || "");
              }
            });
          }

          // Handle currencies
          if (country.currencies) {
            Object.values(country.currencies).forEach((curr) => {
              if (curr && typeof curr === "object") {
                currencies.add(curr.name || "");
              }
            });
          }

          if (country.timezones) {
            country.timezones.forEach((tz) => timezones.add(tz));
          }
        });

        setUniqueRegions(Array.from(regions).sort());
        setUniqueSubregions(Array.from(subregions).sort());
        setUniqueLanguages(Array.from(languages).filter(Boolean).sort());
        setUniqueCurrencies(Array.from(currencies).filter(Boolean).sort());
        setUniqueTimezones(Array.from(timezones).sort());
      } catch (error) {
        console.error("Error loading countries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    let result = [...countries];

    try {
      // Apply region filter
      if (filters.region) {
        result = result.filter((country) => country?.region === filters.region);
      }

      // Apply subregion filter
      if (filters.subregion) {
        result = result.filter(
          (country) => country?.subregion === filters.subregion
        );
      }

      // Apply population range filter
      if (filters.population.min) {
        const minPop = Number(filters.population.min);
        if (!isNaN(minPop)) {
          result = result.filter(
            (country) => (country?.population || 0) >= minPop
          );
        }
      }
      if (filters.population.max) {
        const maxPop = Number(filters.population.max);
        if (!isNaN(maxPop)) {
          result = result.filter(
            (country) => (country?.population || 0) <= maxPop
          );
        }
      }

      // Apply area range filter
      if (filters.area.min) {
        const minArea = Number(filters.area.min);
        if (!isNaN(minArea)) {
          result = result.filter((country) => (country?.area || 0) >= minArea);
        }
      }
      if (filters.area.max) {
        const maxArea = Number(filters.area.max);
        if (!isNaN(maxArea)) {
          result = result.filter((country) => (country?.area || 0) <= maxArea);
        }
      }

      // Apply language filter
      if (filters.language) {
        result = result.filter((country) => {
          if (!country?.languages) return false;

          // Check if any language matches the filter
          return Object.values(country.languages).some((lang) => {
            if (typeof lang === "string") {
              return lang === filters.language;
            } else if (lang && typeof lang === "object") {
              return lang.name === filters.language;
            }
            return false;
          });
        });
      }

      // Apply currency filter
      if (filters.currency) {
        result = result.filter((country) => {
          if (!country?.currencies) return false;
          return Object.values(country.currencies).some(
            (curr) => curr?.name === filters.currency
          );
        });
      }

      // Apply timezone filter
      if (filters.timezone) {
        result = result.filter((country) => {
          if (!country?.timezones) return false;
          return country.timezones.includes(filters.timezone);
        });
      }

      // Apply independent filter
      if (filters.independent !== "all") {
        result = result.filter((country) => {
          const isIndependent = country?.independent || false;
          return isIndependent === (filters.independent === "true");
        });
      }

      // Apply sorting
      result.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case "name":
            const nameA = a?.name?.common?.toLowerCase() || "";
            const nameB = b?.name?.common?.toLowerCase() || "";
            comparison = nameA.localeCompare(nameB);
            break;
          case "population":
            const popA = a?.population || 0;
            const popB = b?.population || 0;
            comparison = popA - popB;
            break;
          case "area":
            const areaA = a?.area || 0;
            const areaB = b?.area || 0;
            comparison = areaA - areaB;
            break;
          default:
            comparison = 0;
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });

      setFilteredCountries(result);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredCountries([]);
    }
  }, [countries, filters, sortBy, sortOrder]);

  const resetFilters = () => {
    setFilters({
      region: "",
      subregion: "",
      population: { min: "", max: "" },
      area: { min: "", max: "" },
      language: "",
      currency: "",
      timezone: "",
      independent: "all",
    });
    setCurrentPage(1);
  };

  const handleSeeMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const nextCountries = filteredCountries.slice(startIndex, endIndex);

    if (nextCountries.length > 0) {
      setCurrentPage(nextPage);
      setDisplayedCount(endIndex);
    }
  };

  const currentCountries = filteredCountries.slice(0, displayedCount);
  const hasMore = displayedCount < filteredCountries.length;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Mobile Header */}
        <div className="lg:hidden flex flex-col space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">All Countries</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="p-2 rounded-lg bg-white shadow-sm"
              >
                <FiFilter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            All Countries
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-primary-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-primary-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <FiFilter className="mr-2" />
                Filters
                {showFilters ? (
                  <FiChevronUp className="ml-2" />
                ) : (
                  <FiChevronDown className="ml-2" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Sort Options */}
        <div className="hidden lg:flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="name">Name</option>
              <option value="population">Population</option>
              <option value="area">Area</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {currentCountries.length} of {filteredCountries.length}{" "}
            countries
          </div>
        </div>

        {/* Desktop Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{
                opacity: 0,
                transform: "translateY(-10px)",
              }}
              animate={{
                opacity: 1,
                transform: "translateY(0)",
                transition: {
                  duration: 0.2,
                  ease: "easeOut",
                },
              }}
              exit={{
                opacity: 0,
                transform: "translateY(-10px)",
                transition: {
                  duration: 0.15,
                  ease: "easeIn",
                },
              }}
              className="hidden lg:block bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <select
                    value={filters.region}
                    onChange={(e) =>
                      setFilters({ ...filters, region: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Regions</option>
                    {uniqueRegions.map((region) => (
                      <option key={`region-${region}`} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Population Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Population Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.population.min}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          population: {
                            ...filters.population,
                            min: e.target.value,
                          },
                        })
                      }
                      className="w-1/2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.population.max}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          population: {
                            ...filters.population,
                            max: e.target.value,
                          },
                        })
                      }
                      className="w-1/2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Area Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area Range (km²)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.area.min}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          area: { ...filters.area, min: e.target.value },
                        })
                      }
                      className="w-1/2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.area.max}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          area: { ...filters.area, max: e.target.value },
                        })
                      }
                      className="w-1/2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={filters.language}
                    onChange={(e) =>
                      setFilters({ ...filters, language: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Languages</option>
                    {uniqueLanguages.map((language) => (
                      <option key={`language-${language}`} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currency Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={filters.currency}
                    onChange={(e) =>
                      setFilters({ ...filters, currency: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Currencies</option>
                    {uniqueCurrencies.map((currency) => (
                      <option key={`currency-${currency}`} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Timezone Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={filters.timezone}
                    onChange={(e) =>
                      setFilters({ ...filters, timezone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Timezones</option>
                    {uniqueTimezones.map((timezone) => (
                      <option key={`timezone-${timezone}`} value={timezone}>
                        {timezone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Independent Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Independent
                  </label>
                  <select
                    value={filters.independent}
                    onChange={(e) =>
                      setFilters({ ...filters, independent: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All</option>
                    <option value="true">Independent</option>
                    <option value="false">Dependent</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-300 flex items-center space-x-2"
                >
                  <FiX className="w-4 h-4" />
                  <span>Reset Filters</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Filters Panel */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <motion.div
              initial={{
                opacity: 0,
                transform: "translateY(20px)",
              }}
              animate={{
                opacity: 1,
                transform: "translateY(0)",
                transition: {
                  duration: 0.2,
                  ease: "easeOut",
                },
              }}
              exit={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: {
                  duration: 0.15,
                  ease: "easeIn",
                },
              }}
              className="lg:hidden fixed inset-0 z-50 bg-white p-4 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Mobile Sort Options */}
              <div className="mb-6">
                <button
                  onClick={() => setIsMobileSortOpen(!isMobileSortOpen)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span>Sort Options</span>
                  {isMobileSortOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {isMobileSortOpen && (
                  <div className="mt-2 space-y-2 p-3 bg-gray-50 rounded-lg">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    >
                      <option value="name">Name</option>
                      <option value="population">Population</option>
                      <option value="area">Area</option>
                    </select>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Mobile Filters */}
              <div className="space-y-4">
                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <select
                    value={filters.region}
                    onChange={(e) =>
                      setFilters({ ...filters, region: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-gray-300"
                  >
                    <option value="">All Regions</option>
                    {uniqueRegions.map((region) => (
                      <option key={`region-${region}`} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Population Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Population Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.population.min}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          population: {
                            ...filters.population,
                            min: e.target.value,
                          },
                        })
                      }
                      className="w-1/2 p-2 rounded-lg border border-gray-300"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.population.max}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          population: {
                            ...filters.population,
                            max: e.target.value,
                          },
                        })
                      }
                      className="w-1/2 p-2 rounded-lg border border-gray-300"
                    />
                  </div>
                </div>

                {/* Area Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area Range (km²)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.area.min}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          area: { ...filters.area, min: e.target.value },
                        })
                      }
                      className="w-1/2 p-2 rounded-lg border border-gray-300"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.area.max}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          area: { ...filters.area, max: e.target.value },
                        })
                      }
                      className="w-1/2 p-2 rounded-lg border border-gray-300"
                    />
                  </div>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={filters.language}
                    onChange={(e) =>
                      setFilters({ ...filters, language: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-gray-300"
                  >
                    <option value="">All Languages</option>
                    {uniqueLanguages.map((language) => (
                      <option key={`language-${language}`} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currency Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={filters.currency}
                    onChange={(e) =>
                      setFilters({ ...filters, currency: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-gray-300"
                  >
                    <option value="">All Currencies</option>
                    {uniqueCurrencies.map((currency) => (
                      <option key={`currency-${currency}`} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Timezone Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={filters.timezone}
                    onChange={(e) =>
                      setFilters({ ...filters, timezone: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-gray-300"
                  >
                    <option value="">All Timezones</option>
                    {uniqueTimezones.map((timezone) => (
                      <option key={`timezone-${timezone}`} value={timezone}>
                        {timezone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Independent Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Independent
                  </label>
                  <select
                    value={filters.independent}
                    onChange={(e) =>
                      setFilters({ ...filters, independent: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-gray-300"
                  >
                    <option value="all">All</option>
                    <option value="true">Independent</option>
                    <option value="false">Dependent</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-300 flex items-center space-x-2"
                >
                  <FiX className="w-4 h-4" />
                  <span>Reset Filters</span>
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="px-4 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Apply Filters</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600">
            Showing {currentCountries.length} of {filteredCountries.length}{" "}
            countries
          </p>
        </div>

        {/* Countries Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <motion.div
            key="countries-container"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "space-y-4"
            }`}
          >
            {currentCountries.map((country) => (
              <motion.div
                key={country.cca3}
                variants={itemVariants}
                className={
                  viewMode === "list" ? "bg-white rounded-lg shadow-md p-4" : ""
                }
              >
                <CountryCard country={country} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* See More Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mt-8 space-y-2"
          >
            <p className="text-sm text-gray-600">
              Showing {displayedCount} of {filteredCountries.length} countries
            </p>
            <button
              onClick={handleSeeMore}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
            >
              <span>
                See More Countries (
                {Math.min(
                  ITEMS_PER_PAGE,
                  filteredCountries.length - displayedCount
                )}{" "}
                more)
              </span>
              <FiChevronDown className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* No Results Message */}
        {!loading && filteredCountries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">
              No countries found matching your criteria.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllCountries;
