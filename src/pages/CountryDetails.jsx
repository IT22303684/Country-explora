import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiGlobe,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

const CountryDetails = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          throw new Error("Country not found");
        }

        setCountry(data[0]);
      } catch (err) {
        console.error("Error fetching country details:", err);
        setError(
          err.message === "Country not found"
            ? "The country you're looking for doesn't exist."
            : "Sorry, we couldn't load the country details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [countryCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-primary-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-4"
      >
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <FiAlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
          <p className="text-gray-600 mb-8">
            Please check the country code or try again later.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/countries")}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse Countries
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!country) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-4"
      >
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <FiAlertCircle className="w-16 h-16 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Country Data Available
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't find any information for this country.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/countries")}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse Countries
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-primary-500 mb-8 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Country Flag */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-video rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={country.flags.png}
              alt={`${country.name.common} flag`}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Country Details */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-bold text-gray-900">
              {country.name.common}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FiGlobe className="mr-3 text-primary-500" />
                  <span>Official Name: {country.name.official}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-3 text-primary-500" />
                  <span>Capital: {country.capital?.[0] || "N/A"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiUsers className="mr-3 text-primary-500" />
                  <span>Population: {country.population.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FiDollarSign className="mr-3 text-primary-500" />
                  <span>
                    Currency:{" "}
                    {country.currencies
                      ? Object.values(country.currencies)
                          .map(
                            (currency) =>
                              `${currency.name} (${currency.symbol})`
                          )
                          .join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-3 text-primary-500" />
                  <span>
                    Timezones:{" "}
                    {country.timezones && country.timezones.length > 0
                      ? country.timezones.join(", ")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Languages */}
            {country.languages && Object.keys(country.languages).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.values(country.languages).map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Borders */}
            {country.borders && country.borders.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Bordering Countries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {country.borders.map((borderCode) => (
                    <button
                      key={borderCode}
                      onClick={() => navigate(`/country/${borderCode}`)}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {borderCode}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryDetails;
