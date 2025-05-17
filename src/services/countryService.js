import axios from "axios";

const BASE_URL = "https://restcountries.com/v3.1";

export const fetchAllCountries = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/all?fields=name,capital,currencies,population,flags,region,subregion,languages,borders,area,cca3,cca2,ccn3`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const fetchCountryByName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching country:", error);
    throw error;
  }
};

export const fetchCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${BASE_URL}/alpha/${code}`);
    return response.data[0]; // Returns single country object instead of array
  } catch (error) {
    console.error("Error fetching country:", error);
    throw error;
  }
};

export const fetchCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${BASE_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching countries by region:", error);
    throw error;
  }
};

// Additional useful functions based on the API capabilities
export const fetchCountryByFullName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}?fullText=true`);
    return response.data[0];
  } catch (error) {
    console.error("Error fetching country by full name:", error);
    throw error;
  }
};

export const fetchCountriesByCodes = async (codes) => {
  try {
    const codesString = codes.join(",");
    const response = await axios.get(`${BASE_URL}/alpha?codes=${codesString}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching countries by codes:", error);
    throw error;
  }
};

export const fetchCountriesByCapital = async (capital) => {
  try {
    const response = await axios.get(`${BASE_URL}/capital/${capital}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching countries by capital:", error);
    throw error;
  }
};

export const fetchCountriesByLanguage = async (lang) => {
  try {
    const response = await axios.get(`${BASE_URL}/lang/${lang}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching countries by language:", error);
    throw error;
  }
};
