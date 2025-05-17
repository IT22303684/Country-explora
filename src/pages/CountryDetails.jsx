import React, { useState, useEffect, Suspense } from "react";
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
  FiMap,
} from "react-icons/fi";
import { fetchCountryByCode } from "../services/countryService";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Dynamically import the map components
const MapComponent = React.lazy(() => import("../components/Map/MapComponent"));

const CountryDetails = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchCountryByCode(countryCode);
        if (!data) {
          throw new Error("Country not found");
        }

        setCountry(data);
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

    if (countryCode) {
      fetchCountryDetails();
    }
  }, [countryCode]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time based on country's timezone
  const formatTime = (date, timezone) => {
    try {
      // Handle different timezone formats
      let ianaTimezone;

      if (timezone.startsWith("UTC")) {
        // Convert UTC±X format to IANA format
        const offset = timezone.replace("UTC", "").trim();
        const sign = offset.startsWith("+") ? "-" : "+"; // Note: IANA format has inverted signs
        const hours = offset.replace(/[+-]/, "");
        ianaTimezone = `Etc/GMT${sign}${hours}`;
      } else if (timezone.includes("/")) {
        // Already in IANA format
        ianaTimezone = timezone;
      } else {
        // Try to find the IANA timezone from the country's timezone
        const timezoneMap = {
          GMT: "Etc/GMT",
          EST: "America/New_York",
          CST: "America/Chicago",
          PST: "America/Los_Angeles",
          IST: "Asia/Kolkata",
          JST: "Asia/Tokyo",
          AEST: "Australia/Sydney",
          NZST: "Pacific/Auckland",
          WET: "Europe/London",
          CET: "Europe/Paris",
          EET: "Europe/Athens",
          MSK: "Europe/Moscow",
          SAST: "Africa/Johannesburg",
          EAT: "Africa/Nairobi",
          GST: "Asia/Dubai",
          SGT: "Asia/Singapore",
          HKT: "Asia/Hong_Kong",
          KST: "Asia/Seoul",
          AWST: "Australia/Perth",
          ACST: "Australia/Adelaide",
          ACWST: "Australia/Eucla",
          AEST: "Australia/Brisbane",
          AEDT: "Australia/Sydney",
          NZDT: "Pacific/Auckland",
          WEST: "Europe/Lisbon",
          CEST: "Europe/Paris",
          EEST: "Europe/Athens",
          MSD: "Europe/Moscow",
          SAST: "Africa/Johannesburg",
          EAT: "Africa/Nairobi",
          GST: "Asia/Dubai",
          SGT: "Asia/Singapore",
          HKT: "Asia/Hong_Kong",
          KST: "Asia/Seoul",
        };

        ianaTimezone = timezoneMap[timezone] || timezone;
      }

      // Format the time
      const timeString = new Date(date).toLocaleTimeString("en-US", {
        timeZone: ianaTimezone,
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // If we get an invalid date, try using the original timezone
      if (timeString === "Invalid Date") {
        return new Date(date).toLocaleTimeString("en-US", {
          timeZone: timezone,
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }

      return timeString;
    } catch (error) {
      console.error("Timezone error:", error, "Timezone:", timezone);
      // Fallback to local time if timezone conversion fails
      return new Date(date).toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
  };

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
    return null;
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
          {/* Country Flag and Map */}
          <div className="space-y-8">
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

            {/* Interactive Map */}
            {country.latlng && (
              <div className="h-[400px] rounded-xl overflow-hidden shadow-lg relative">
                <div id="map-container" className="w-full h-full" />
                <Suspense
                  fallback={
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="w-8 h-8 border-t-4 border-primary-500 rounded-full animate-spin" />
                    </div>
                  }
                >
                  <MapComponent
                    center={[country.latlng[0], country.latlng[1]]}
                    country={country}
                  />
                </Suspense>
              </div>
            )}
          </div>

          {/* Country Details */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
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
                    <span>
                      Population: {country.population.toLocaleString()}
                    </span>
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
                    <FiMap className="mr-3 text-primary-500" />
                    <span>
                      Area: {country.area?.toLocaleString() || "N/A"} km²
                    </span>
                  </div>
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

            {/* Live Clock - Moved to the bottom */}
            {country.timezones && country.timezones.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FiClock className="mr-2 text-primary-500" />
                    Local Time
                  </h3>
                  <span className="text-sm text-gray-500">
                    {country.timezones[0]}
                  </span>
                </div>
                <div className="text-3xl font-mono text-primary-600">
                  {formatTime(currentTime, country.timezones[0])}
                </div>
                {country.timezones.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Other Timezones:
                    </h4>
                    <div className="space-y-2">
                      {country.timezones.slice(1).map((timezone, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-500">{timezone}</span>
                          <span className="font-mono text-primary-600">
                            {formatTime(currentTime, timezone)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryDetails;
