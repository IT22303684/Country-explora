import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CurrencyMarquee = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        // Fetch a few popular currencies
        const currencyCodes = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CNY"];
        const allCurrencies = [];

        for (const code of currencyCodes) {
          const response = await fetch(
            `https://restcountries.com/v3.1/currency/${code.toLowerCase()}`
          );
          const data = await response.json();

          if (data && data.length > 0) {
            const country = data[0];
            const currency = country.currencies[code];
            allCurrencies.push({
              code,
              name: currency.name,
              symbol: currency.symbol,
              country: country.name.common,
            });
          }
        }

        setCurrencies(allCurrencies);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  if (loading) {
    return (
      <div className="bg-primary-500 text-white py-2">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-2 bg-white/30 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-500 text-white py-2 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {currencies.map((currency, index) => (
          <div key={index} className="flex items-center mx-8">
            <span className="font-bold">{currency.code}</span>
            <span className="mx-2">-</span>
            <span>{currency.name}</span>
            <span className="mx-2">({currency.symbol})</span>
            <span className="mx-2">-</span>
            <span className="text-white/80">{currency.country}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CurrencyMarquee;
