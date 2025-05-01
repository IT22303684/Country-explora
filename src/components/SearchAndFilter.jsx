import React from "react";

const SearchAndFilter = ({
  onSearch,
  onFilter,
  searchTerm,
  selectedRegion,
}) => {
  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="w-full md:w-96">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="w-full md:w-48">
        <select
          value={selectedRegion}
          onChange={(e) => onFilter(e.target.value)}
          className="w-full px-4 py-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Filter by Region</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter;
