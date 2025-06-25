"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Pie, Bar } from "react-chartjs-2";
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

// Registrasi komponen Chart.js yang diperlukan
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- Tipe dan Konversi Data Provinsi --- //
interface Province {
  id: string;
  name: string;
  alt_name: string;
  latitude: number;
  longitude: number;
}

interface GeoJSONFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    alt_name: string;
    hasData: boolean;
    production: number;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Impor data provinsi (file JSON berupa array objek)
import provincesData from "../assets/provinces.json";

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

// --- Tipe Data API --- //
interface ApiData {
  id: string;
  year: string;
  province: string;
  production: number;
}

// --- Komponen MapLibre yang sudah diintegrasikan --- //
const MapLibreMap: React.FC<{ geoJsonData: GeoJSONFeatureCollection }> = ({
  geoJsonData,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Inisialisasi peta satu kali saat komponen dimount
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

  // Update data GeoJSON ketika prop geoJsonData berubah
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
      }
    };

    if (!mapRef.current.isStyleLoaded()) {
      mapRef.current.once("load", updateSourceData);
    } else {
      updateSourceData();
    }
  }, [geoJsonData]);

  // Tambahkan event handler agar ketika marker di-klik muncul popup informasi
  useEffect(() => {
    if (!mapRef.current) return;

    const handleClick = (e: maplibregl.MapMouseEvent & maplibregl.Event) => {
      const features = mapRef.current!.queryRenderedFeatures(e.point, {
        layers: ["indonesia-layer"],
      });
      if (!features.length) return;
      const feature = features[0];
      // Tampilkan informasi berupa nama dan total production
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `<strong>${feature.properties.name}</strong><br/>Production: ${feature.properties.production}`
        )
        .addTo(mapRef.current!);
    };

    mapRef.current.on("click", "indonesia-layer", handleClick);
    mapRef.current.on("mouseenter", "indonesia-layer", () => {
      mapRef.current!.getCanvas().style.cursor = "pointer";
    });
    mapRef.current.on("mouseleave", "indonesia-layer", () => {
      mapRef.current!.getCanvas().style.cursor = "";
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", "indonesia-layer", handleClick);
      }
    };
  }, [geoJsonData]);

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
};

// --- Komponen Dashboard Utama --- //
const Dashboard: React.FC<{ apiData: ApiData[] }> = ({ apiData }) => {
  const [selectedVegetable, setSelectedVegetable] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");

  // Filter data berdasarkan pilihan vegetable dan provinsi
  const filteredData = useMemo(() => {
    let data = apiData;

    if (selectedVegetable !== "all") {
      data = data.filter((item) => item.province === selectedVegetable);
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

  // Data untuk Diagram Lingkaran (Pie Chart) berdasarkan vegetable
  const pieData = () => {
    const grouped: { [key: string]: number } = {};
    filteredData.forEach((item) => {
      grouped[item.province] = (grouped[item.province] || 0) + item.production;
    });
    return {
      labels: Object.keys(grouped),
      datasets: [
        {
          data: Object.values(grouped),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#8BC34A",
            "#FF9800",
          ],
        },
      ],
    };
  };

  // Data untuk Diagram Batang (Bar Chart) dengan sumbu x: year dan sumbu y: production
  const barData = () => {
    const grouped: { [key: string]: number } = {};
    filteredData.forEach((item) => {
      grouped[item.year] = (grouped[item.year] || 0) + item.production;
    });
    return {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: "Production",
          data: Object.values(grouped),
          backgroundColor: "#42A5F5",
        },
      ],
    };
  };

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
            {[...new Set(apiData.map((item) => item.province))].map(
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

      {/* Diagram Lingkaran */}
      <div
        className="mb-8"
        style={{ width: "60%", height: "60%", margin: "auto" }}
      >
        <h2 className="text-xl font-semibold mb-2">
          Diagram Lingkaran Vegetable
        </h2>
        <Pie data={pieData()} />
        &nbsp;&nbsp;
      </div>

      {/* Diagram Batang (Vertical Bar Chart) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Gugus Diagram Batang Production by Year
        </h2>
        <Bar
          data={barData()}
          options={{
            scales: {
              x: { title: { display: true, text: "Year" } },
              y: {
                beginAtZero: true,
                title: { display: true, text: "Production" },
              },
            },
          }}
        />
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

interface ApiData {
  id: string;
  year: string;
  province: string;
  production: number;
}

export async function getServerSideProps() {
  const apiKey = `${process.env.NEXT_PUBLIC_API_BACKEND}/crops`;
  const res = await fetch(apiKey);
  const dataJson: { data: ApiData[] } = await res.json();

  return {
    props: {
      apiData: dataJson.data,
    },
  };
}

export default Dashboard;
