"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/hooks/apiService";

const CropsUpdatePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
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

  // Ambil data crop dari API saat halaman dibuka
  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await api.get(`/crops/${id}`);
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
      } catch (err: any) {
        setMessage("Gagal mengambil data tanaman.");
        console.error(err);
      }
    };

    fetchCrop();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    } catch (err: any) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Gagal memperbarui data.");
      }
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h2 className="text-xl font-semibold mb-4">Form Update untuk ID: {id}</h2>
      {message && <p className="mb-2 text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Tahun", name: "year", type: "number" },
          { label: "Provinsi", name: "province", type: "text" },
          { label: "Sayur", name: "vegetable", type: "text" },
          { label: "Produksi (ton)", name: "production", type: "number" },
          { label: "Luas Tanam", name: "planted_area", type: "number" },
          { label: "Luas Panen", name: "harvested_area", type: "number" },
          { label: "Jenis Pupuk", name: "fertilizer_type", type: "text" },
          { label: "Jumlah Pupuk", name: "fertilizer_amount", type: "number" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={(form as any)[name]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        ))}

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
