import React, { useState, useEffect, useRef } from "react";
import SearchAndFilter from "../../components/SearchAndFilter";
import CountryCard from "../../components/CountryCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 8;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

const CountriesSection = ({
  countries,
  loading,
  onSearch,
  onFilter,
  searchTerm,
  selectedRegion,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    setTotalPages(Math.ceil(countries.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Reset to first page when countries change
  }, [countries]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCountries = countries.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to the cards container with offset
    setTimeout(() => {
      if (cardsContainerRef.current) {
        const offset = 100; // Adjust this value based on your layout
        const elementPosition =
          cardsContainerRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100); // Small delay to ensure the new content is rendered
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-primary-500 hover:bg-primary-50"
        }`}
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="w-10 h-10 rounded-full bg-white text-primary-500 hover:bg-primary-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 rounded-full ${
            currentPage === i
              ? "bg-primary-500 text-white"
              : "bg-white text-primary-500 hover:bg-primary-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="w-10 h-10 rounded-full bg-white text-primary-500 hover:bg-primary-50"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-primary-500 hover:bg-primary-50"
        }`}
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    );

    return pages;
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Discover Countries
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Explore detailed information about countries from around the world.
            Search by name or filter by region to find the countries you're
            interested in.
          </p>
        </div>

        <div className="mb-8">
          <SearchAndFilter
            onSearch={onSearch}
            onFilter={onFilter}
            searchTerm={searchTerm}
            selectedRegion={selectedRegion}
          />
        </div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{
                rotate: 360,
                transition: { duration: 1, repeat: Infinity, ease: "linear" },
              }}
              className="inline-block rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-gray-600"
            >
              Loading countries...
            </motion.p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              ref={cardsContainerRef}
              key={currentPage}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {currentCountries.map((country, index) => (
                <motion.div
                  key={country.alpha3Code}
                  variants={cardVariants}
                  custom={index}
                >
                  <CountryCard country={country} />
                </motion.div>
              ))}
            </motion.div>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 sm:mt-12 flex justify-center"
              >
                <div className="flex items-center space-x-1 sm:space-x-2 bg-white p-2 rounded-full shadow-sm overflow-x-auto max-w-full">
                  {renderPagination()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {!loading && countries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-base sm:text-lg">
              No countries found matching your search criteria.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CountriesSection;
