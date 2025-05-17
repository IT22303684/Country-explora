import { useEffect, useRef } from "react";
import L from "leaflet";

export const useMap = (containerId, center, zoom) => {
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!mapRef.current) {
      // Initialize map only once
      mapRef.current = L.map(container).setView(center, zoom);

      // Add tile layer
      tileLayerRef.current = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(mapRef.current);
    } else {
      // Update view if map exists
      mapRef.current.setView(center, zoom);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, [containerId]); // Only re-run if containerId changes

  // Update view when center or zoom changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return mapRef;
};
