"use client";

import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MapLibreMap from "./MapLibreMap";
import { ApiData, GeoJSONFeatureCollection, Province } from "./types";
import provincesData from "@/assets/provinces.json";

// Registrasi komponen Chart.js
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Konversi data provinsi menjadi GeoJSON FeatureCollection
const initialGeoJson: GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: (provincesData as Province[]).map((province) => ({
    type: "Feature",
    properties: {
      id: province.id,
      name: province.name,
      alt_name: province.alt_name,
      hasData: false,
      production: 0,
    },
    geometry: {
      type: "Point",
      coordinates: [province.longitude, province.latitude],
    },
  })),
};

interface DashboardProps {
  apiData: ApiData[];
}

const Dashboard: React.FC<DashboardProps> = ({ apiData }) => {
  const [selectedVegetable, setSelectedVegetable] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");

  // Filter data berdasarkan pilihan vegetable dan provinsi
  const filteredData = useMemo(() => {
    let data = apiData;

    if (selectedVegetable !== "all") {
      data = data.filter((item) => item.vegetable === selectedVegetable);
    }
    if (selectedProvince !== "all") {
      data = data.filter((item) => item.province === selectedProvince);
    }

    return data;
  }, [selectedVegetable, selectedProvince, apiData]);

  // Update GeoJSON dengan properti berdasarkan data API
  const updatedGeoJson = useMemo<GeoJSONFeatureCollection>(() => {
    return {
      ...initialGeoJson,
      features: initialGeoJson.features.map((feature) => {
        const provinceName = feature.properties.name.toUpperCase();
        const records = filteredData.filter(
          (item) => item.province.toUpperCase() === provinceName
        );
        const totalProduction = records.reduce(
          (sum, item) => sum + item.production,
          0
        );
        return {
          ...feature,
          properties: {
            ...feature.properties,
            hasData: records.length > 0,
            production: totalProduction,
          },
        };
      }),
    };
  }, [filteredData]);

  return (
    <div className="container mx-auto text-center items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Data Produksi</h1>

      {/* Filter untuk Vegetable dan Provinsi */}
      <div className="my-4 space-x-4">
        <label>
          Filter Vegetable:
          <select
            className="ml-2 border p-1"
            onChange={(e) => setSelectedVegetable(e.target.value)}
          >
            <option value="all">Semua</option>
            {[...new Set(apiData.map((item) => item.vegetable))].map(
              (veg, index) => (
                <option key={index} value={veg}>
                  {veg}
                </option>
              )
            )}
          </select>
        </label>
        <label>
          Filter Provinsi:
          <select
            className="ml-2 border p-1"
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="all">Semua</option>
            {[...new Set(apiData.map((item) => item.province))].map(
              (prov, index) => (
                <option key={index} value={prov}>
                  {prov}
                </option>
              )
            )}
          </select>
        </label>
      </div>

      {/* Peta dengan MapLibre GL JS */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Peta Provinsi dengan Data
        </h2>
        <MapLibreMap geoJsonData={updatedGeoJson} />
      </div>
    </div>
  );
};

export default Dashboard;
