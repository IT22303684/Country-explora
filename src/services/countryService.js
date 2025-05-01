import api from "./api";

export const fetchAllCountries = async () => {
  try {
    const response = await api.get("/countries");
    return response.data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const fetchCountryByName = async (name) => {
  try {
    const response = await api.get(`/countries/name/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching country:", error);
    throw error;
  }
};

export const fetchCountryByCode = async (code) => {
  try {
    const response = await api.get(`/countries/code/${code}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching country:", error);
    throw error;
  }
};

export const fetchCountriesByRegion = async (region) => {
  try {
    const response = await api.get(`/countries/region/${region}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching countries by region:", error);
    throw error;
  }
};
