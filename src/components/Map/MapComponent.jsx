import React, { useEffect } from "react";
import L from "leaflet";
import { useMap } from "../../hooks/useMap";

const MapComponent = ({ center, country }) => {
  const mapRef = useMap("map-container", center, 6);

  useEffect(() => {
    if (mapRef.current) {
      // Add marker
      const marker = L.marker(center).addTo(mapRef.current);

      // Add popup
      marker.bindPopup(`
        <div class="text-center">
          <h3 class="font-bold">${country.name.common}</h3>
          <p class="text-sm text-gray-600">${country.capital?.[0] || "N/A"}</p>
        </div>
      `);

      // Force a re-render
      mapRef.current.invalidateSize();

      return () => {
        marker.remove();
      };
    }
  }, [center, country, mapRef]);

  return null;
};

export default MapComponent;
