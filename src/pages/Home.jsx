import React from "react";
import HeroSection from "../section/Home/HeroSection";
import CountriesSection from "../section/Home/CountriesSection";
import { fetchAllCountries } from "../services/countryService";
import CurrencyMarquee from "../components/CurrencyMarquee";

const Home = () => {
  const [countries, setCountries] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchAllCountries();
        setCountries(data);
      } catch (error) {
        console.error("Error loading countries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion
      ? country.region === selectedRegion
      : true;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      <CurrencyMarquee />

      <CountriesSection
        countries={filteredCountries}
        loading={loading}
        onSearch={setSearchTerm}
        onFilter={setSelectedRegion}
        searchTerm={searchTerm}
        selectedRegion={selectedRegion}
      />
    </div>
  );
};

export default Home;
