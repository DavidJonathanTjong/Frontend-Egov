"use client";

import React, { useMemo, useState } from "react";
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
import { ApiData } from "./types";

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

  // Data untuk Diagram Lingkaran (Pie Chart)
  const pieData = () => {
    const grouped: { [key: string]: number } = {};
    filteredData.forEach((item) => {
      const prod = parseFloat(item.production);
      grouped[item.vegetable] =
        (grouped[item.vegetable] || 0) + (isNaN(prod) ? 0 : prod);
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

  // Data untuk Diagram Batang (Bar Chart)
  const barData = () => {
    const grouped: { [key: string]: number } = {};
    filteredData.forEach((item) => {
      const prod = parseFloat(item.production);
      grouped[item.year] = (grouped[item.year] || 0) + (isNaN(prod) ? 0 : prod);
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

      {/* Diagram Lingkaran */}
      <div
        className="mb-8"
        style={{ width: "60%", height: "60%", margin: "auto" }}
      >
        <h2 className="text-xl font-semibold mb-2">
          Diagram Lingkaran Vegetable
        </h2>
        <Pie data={pieData()} />
      </div>

      {/* Diagram Batang */}
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
    </div>
  );
};

export default Dashboard;
