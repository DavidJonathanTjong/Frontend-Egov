"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import api from "@/hooks/apiService";
import toast from "react-hot-toast";

interface Option {
  value: string;
  label: string;
}

interface ChartData {
  name: string;
  production: number;
  planted_area?: number;
  harvested_area?: number;
}

interface CropData {
  province: string;
  vegetable: string;
}

const ProductionChart = () => {
  const [formData, setFormData] = useState({
    province: "",
    vegetable: "",
  });

  const [provinces, setProvinces] = useState<Option[]>([]);
  const [vegetables, setVegetables] = useState<Option[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState({
    provinces: false,
    vegetables: false,
    chart: false,
  });

  useEffect(() => {
    const fetchAllCrops = async (): Promise<CropData[]> => {
      let allData: CropData[] = [];
      let page = 1;
      let lastPage = 1;

      do {
        const response = await api.get<{
          data: CropData[];
          pagination: { current_page: number; last_page: number };
        }>(`/crops?page=${page}&pageLength=10000`);
        allData = [...allData, ...response.data.data];
        lastPage = response.data.pagination.last_page;
        page++;
      } while (page <= lastPage);

      return allData;
    };

    const fetchProvinces = async () => {
      setIsLoading((prev) => ({ ...prev, provinces: true }));
      try {
        const allCrops = await fetchAllCrops();
        const uniqueProvinces = Array.from(
          new Set(allCrops.map((item) => item.province))
        ).map((province) => ({
          value: province,
          label: province,
        }));
        setProvinces(uniqueProvinces);
      } catch (error) {
        toast.error("Gagal memuat daftar provinsi");
      } finally {
        setIsLoading((prev) => ({ ...prev, provinces: false }));
      }
    };

    const fetchVegetables = async () => {
      setIsLoading((prev) => ({ ...prev, vegetables: true }));
      try {
        const allCrops = await fetchAllCrops();
        const uniqueVegetables = Array.from(
          new Set(allCrops.map((item) => item.vegetable))
        ).map((vegetable) => ({
          value: vegetable,
          label: vegetable,
        }));
        setVegetables(uniqueVegetables);
      } catch (error) {
        toast.error("Gagal memuat daftar sayuran");
      } finally {
        setIsLoading((prev) => ({ ...prev, vegetables: false }));
      }
    };

    fetchProvinces();
    fetchVegetables();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedProvince = formData.province;
  const selectedVegetable = formData.vegetable;

  useEffect(() => {
    const fetchChartData = async () => {
      if (!formData.province || !formData.vegetable) return;

      setIsLoading((prev) => ({ ...prev, chart: true }));
      try {
        let allData: any[] = [];
        let page = 1;
        let lastPage = 1;

        do {
          const response = await api.get(`/crops`, {
            params: {
              page,
              pageLength: 1000,
              province: formData.province,
              vegetable: formData.vegetable,
            },
          });

          allData = [...allData, ...response.data.data];
          lastPage = response.data.pagination.last_page;
          page++;
        } while (page <= lastPage);

        const formattedData = allData.map((item) => ({
          name: item.year.toString(),
          production: item.production,
        }));

        setChartData(formattedData);
      } catch (error) {
        toast.error("Gagal memuat data produksi");
      } finally {
        setIsLoading((prev) => ({ ...prev, chart: false }));
      }
    };

    fetchChartData();
  }, [formData.province, formData.vegetable]);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Produksi Pertanian</h1>
        <Image src="/images/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* Dropdown filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provinsi
          </label>
          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={isLoading.provinces}
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((province) => (
              <option key={province.value} value={province.value}>
                {province.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sayuran
          </label>
          <select
            name="vegetable"
            value={formData.vegetable}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={isLoading.vegetables}
          >
            <option value="">Pilih Sayuran</option>
            {vegetables.map((vegetable) => (
              <option key={vegetable.value} value={vegetable.value}>
                {vegetable.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      {isLoading.chart ? (
        <div className="flex justify-center items-center h-64">
          <p>Memuat data grafik...</p>
        </div>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
              tickMargin={20}
            />
            <Tooltip />
            <Legend
              align="center"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
            />
            <Line
              type="monotone"
              dataKey="production"
              stroke="#4CAF50"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500">
          {selectedProvince && selectedVegetable
            ? "Tidak ada data yang ditemukan"
            : "Pilih provinsi dan sayuran untuk melihat grafik"}
        </div>
      )}
    </div>
  );
};

export default ProductionChart;
