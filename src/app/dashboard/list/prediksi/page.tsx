"use client";

import React, { useState, useEffect } from "react";
import api from "@/hooks/apiService";
import toast from "react-hot-toast";

interface Option {
  value: string;
  label: string;
}

interface CropData {
  province: string;
  vegetable: string;
}

function PrediksiPage() {
  const [formData, setFormData] = useState({
    year: "",
    province: "",
    vegetable: "",
    planted_area: "",
    harvested_area: "",
  });

  const [provinces, setProvinces] = useState<Option[]>([]);
  const [vegetables, setVegetables] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState({
    provinces: false,
    vegetables: false,
  });

  const [predictionResult, setPredictionResult] = useState<null | {
    production: number;
    fertilizer_type: string;
    fertilizer_amount: number;
    clustering: {
      cluster: number;
      meaning: string;
    };
  }>(null);

  const [predictionInfo, setPredictionInfo] = useState<typeof formData | null>(
    null
  );

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
        console.error("Failed to fetch provinces:", error);
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
        console.error("Failed to fetch vegetables:", error);
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

  const handleTraining = async () => {
    try {
      toast.loading("Training models...");
      const response = await api.post("/train-models");
      toast.dismiss();
      toast.success("Training berhasil!");
      console.log(response.data);
    } catch (error) {
      toast.dismiss();
      toast.error("Training gagal.");
      console.error(error);
    }
  };

  const handlePrediction = async () => {
    try {
      if (!formData.province) {
        toast.error("Harap pilih provinsi");
        return;
      }
      if (!formData.vegetable) {
        toast.error("Harap pilih sayuran");
        return;
      }

      toast.loading("Melakukan prediksi...");
      const response = await api.post("/predict", {
        year: parseInt(formData.year),
        province: formData.province,
        vegetable: formData.vegetable,
        planted_area: parseFloat(formData.planted_area),
        harvested_area: parseFloat(formData.harvested_area),
      });
      toast.dismiss();
      toast.success("Prediksi berhasil!");

      setPredictionResult(response.data.data);
      setPredictionInfo({ ...formData }); // simpan input saat prediksi
    } catch (error) {
      toast.dismiss();
      toast.error("Gagal melakukan prediksi.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Halaman Prediksi</h1>

      <button
        onClick={handleTraining}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Training Model
      </button>

      <div className="space-y-4">
        <input
          type="number"
          name="year"
          placeholder="Tahun"
          value={formData.year}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

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

        <input
          type="number"
          name="planted_area"
          placeholder="Luas Tanam"
          value={formData.planted_area}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="harvested_area"
          placeholder="Luas Panen"
          value={formData.harvested_area}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handlePrediction}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Lakukan Prediksi
        </button>
      </div>

      {predictionResult && predictionInfo && (
        <div className="mt-6 p-4 border rounded bg-gray-900 text-white">
          <h2 className="text-lg font-medium mb-4">
            Provinsi {predictionInfo.province}, {predictionInfo.year}:
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-semibold">Komoditas:</span>{" "}
              {predictionInfo.vegetable}
            </li>
            <li>
              <span className="font-semibold">Luas tanam:</span>{" "}
              {Number(predictionInfo.planted_area).toLocaleString()} ha
            </li>
            <li>
              <span className="font-semibold">Prediksi produksi:</span>{" "}
              {Number(predictionResult.production).toLocaleString()} ton
            </li>
            <li>
              <span className="font-semibold">
                Prediksi kebutuhan pupuk {predictionResult.fertilizer_type}:
              </span>{" "}
              {Number(predictionResult.fertilizer_amount).toLocaleString()} ton
            </li>
          </ul>

          <div className="mt-4 bg-gray-800 p-4 rounded">
            <p className="font-semibold">Kesimpulan Dasar:</p>
            <p className="mt-1">
              Pemerintah dapat mendukung upaya swasembada pangan untuk komoditas{" "}
              <span className="font-semibold">{predictionInfo.vegetable}</span>{" "}
              di tahun{" "}
              <span className="font-semibold">{predictionInfo.year}</span> pada
              provinsi{" "}
              <span className="font-semibold">{predictionInfo.province}</span>{" "}
              dengan menyediakan pupuk{" "}
              <span className="font-semibold">
                {predictionResult.fertilizer_type}
              </span>{" "}
              sekurang-kurangnya{" "}
              <span className="font-semibold">
                {Number(predictionResult.fertilizer_amount).toLocaleString()}
              </span>{" "}
              ton.
            </p>
            <div className="mt-4">
              <p className="font-semibold">Karakteristik Klaster:</p>
              <p className="mt-1 ">{predictionResult.clustering.meaning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrediksiPage;
