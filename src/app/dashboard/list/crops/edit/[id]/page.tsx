"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/hooks/apiService";
import { AxiosError } from "axios";

interface CropForm {
  year: string;
  province: string;
  vegetable: string;
  production: string;
  planted_area: string;
  harvested_area: string;
  fertilizer_type: string;
  fertilizer_amount: string;
}

interface CropResponse {
  data: {
    year: number;
    province: string;
    vegetable: string;
    production: number;
    planted_area: number;
    harvested_area: number;
    fertilizer_type: string;
    fertilizer_amount: number;
  };
}

const fertilizerOptions = ["Urea", "Organik", "NPK", "ZA"];

const CropsUpdatePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<CropForm>({
    year: "",
    province: "",
    vegetable: "",
    production: "",
    planted_area: "",
    harvested_area: "",
    fertilizer_type: "",
    fertilizer_amount: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await api.get<CropResponse>(`/crops/${id}`);
        const data = res.data.data;

        setForm({
          year: data.year.toString(),
          province: data.province,
          vegetable: data.vegetable,
          production: data.production.toString(),
          planted_area: data.planted_area.toString(),
          harvested_area: data.harvested_area.toString(),
          fertilizer_type: data.fertilizer_type,
          fertilizer_amount: data.fertilizer_amount.toString(),
        });
      } catch (err: unknown) {
        setMessage("Gagal mengambil data tanaman.");
        console.error(err);
      }
    };

    fetchCrop();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.put(`/crops/${id}`, form);
      alert("Data berhasil diperbarui.");
      router.push("/dashboard/list/crops");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Gagal memperbarui data.");
      }
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <button
        onClick={() => router.push("/dashboard/list/crops")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Kembali ke Halaman Crops
      </button>
      <h2 className="text-xl font-semibold mb-4">Form Update untuk ID: {id}</h2>
      {message && <p className="mb-2 text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {(
          [
            { label: "Tahun", name: "year", type: "number" },
            { label: "Provinsi", name: "province", type: "text" },
            { label: "Sayur", name: "vegetable", type: "text" },
            { label: "Produksi (ton)", name: "production", type: "number" },
            { label: "Luas Tanam", name: "planted_area", type: "number" },
            { label: "Luas Panen", name: "harvested_area", type: "number" },
            {
              label: "Jumlah Pupuk",
              name: "fertilizer_amount",
              type: "number",
            },
          ] as const
        ).map(({ label, name, type }) => (
          <div key={name}>
            <label className="block font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        ))}

        {/* Select khusus untuk fertilizer_type */}
        <div>
          <label className="block font-medium">Jenis Pupuk</label>
          <select
            name="fertilizer_type"
            value={form.fertilizer_type}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Pilih Jenis Pupuk</option>
            {fertilizerOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Data
        </button>
      </form>
    </div>
  );
};

export default CropsUpdatePage;
