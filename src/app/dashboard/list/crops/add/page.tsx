"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/apiService";
import { AxiosError } from "axios";

const initialFormState = {
  year: "",
  province: "",
  vegetable: "",
  production: "",
  planted_area: "",
  harvested_area: "",
  fertilizer_type: "",
  fertilizer_amount: "",
};

const CropsAddPage = () => {
  const [form, setForm] = useState(initialFormState);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/crops", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMessage("Data berhasil ditambahkan.");
      setForm(initialFormState);

      setTimeout(() => {
        router.push("/dashboard/list/crops");
      }, 1500);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setMessage(error.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/crops/import", formData);
      setMessage("Import berhasil.");
      setFile(null);

      setTimeout(() => {
        router.push("/dashboard/list/crops");
      }, 1500);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setMessage(
        error.response?.data?.message || "Terjadi kesalahan saat import."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md flex-1 m-4 mt-0">
      <h2 className="text-xl font-bold mb-4">Tambah Data Produksi Sayur</h2>

      <button
        onClick={() => router.push("/dashboard/list/crops")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Kembali ke Halaman Crops
      </button>

      <form onSubmit={handleFormSubmit} className="space-y-4 mb-6">
        <input
          type="number"
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Tahun (contoh: 2024)"
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="province"
          value={form.province}
          onChange={handleChange}
          placeholder="Provinsi"
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="vegetable"
          value={form.vegetable}
          onChange={handleChange}
          placeholder="Jenis Sayur"
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="planted_area"
          value={form.planted_area}
          onChange={handleChange}
          placeholder="Luas Tanam (contoh: 1000)"
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="harvested_area"
          value={form.harvested_area}
          onChange={handleChange}
          placeholder="Luas Panen (contoh: 800)"
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="fertilizer_type"
          value={form.fertilizer_type}
          onChange={handleChange}
          placeholder="Jenis Pupuk (contoh: Urea)"
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="fertilizer_amount"
          value={form.fertilizer_amount}
          onChange={handleChange}
          placeholder="Jumlah Pupuk (contoh: 1200)"
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="production"
          value={form.production}
          onChange={handleChange}
          placeholder="Produksi (dalam angka)"
          className="border px-3 py-2 rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Tambah Data"}
        </button>
      </form>

      <hr className="my-6" />

      <div>
        <h3 className="text-lg font-semibold mb-2">Import File Excel</h3>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button
          onClick={handleImportSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading || !file}
        >
          {loading ? "Mengimpor..." : "Import Excel"}
        </button>
      </div>

      {message && (
        <div className="mt-4 p-3 bg-gray-100 border border-gray-300 text-sm rounded">
          {message}
        </div>
      )}
    </div>
  );
};

export default CropsAddPage;
