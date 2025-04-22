"use client";

import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { GeoJSONFeatureCollection } from "./types";

interface MapLibreMapProps {
  geoJsonData: GeoJSONFeatureCollection;
}

const MapLibreMap: React.FC<MapLibreMapProps> = ({ geoJsonData }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [117.5, -2.5],
        zoom: 4,
      });
      mapRef.current.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
      );
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const updateSourceData = () => {
      if (!mapRef.current) return;

      const map = mapRef.current;
      const source = map.getSource("indonesia") as
        | maplibregl.GeoJSONSource
        | undefined;

      if (source) {
        source.setData(geoJsonData);
      } else {
        map.addSource("indonesia", {
          type: "geojson",
          data: geoJsonData,
        });
        map.addLayer({
          id: "indonesia-layer",
          type: "circle",
          source: "indonesia",
          paint: {
            "circle-radius": 6,
            "circle-color": [
              "case",
              ["boolean", ["get", "hasData"], false],
              "#82c91e",
              "#EAEAEC",
            ],
          },
        });
        map.on("click", "indonesia-layer", (e) => {
          if (!e.features || e.features.length === 0) return;
          const feature = e.features[0];
          const provinceName = feature.properties?.name || "Tidak Diketahui";
          const production = feature.properties?.production || 0;

          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
              `<strong>${provinceName}</strong><br/>Produksi: ${production}`
            )
            .addTo(map);
        });
        map.on("mouseenter", "indonesia-layer", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "indonesia-layer", () => {
          map.getCanvas().style.cursor = "";
        });
      }
    };

    if (!mapRef.current.isStyleLoaded()) {
      mapRef.current.once("load", updateSourceData);
    } else {
      updateSourceData();
    }
  }, [geoJsonData]);

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
};

export default MapLibreMap;
