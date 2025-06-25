"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const CropsUpdatePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id;
  const year = searchParams.get("year");
  const province = searchParams.get("province");
  const vegetable = searchParams.get("vegetable");
  const production = searchParams.get("production");

  const [form, setForm] = useState({
    year: year || "",
    province: province || "",
    vegetable: vegetable || "",
    production: production || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = Cookies.get("token");

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/crops/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Data berhasil diperbarui.");
      console.log("Updated:", res.data);
      router.push("/dashboard/list/crops");
    } catch (err) {
      setMessage("Gagal memperbarui data.");
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h2 className="text-xl font-semibold mb-4">Form Update untuk ID: {id}</h2>
      {message && <p className="mb-2 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tahun</label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Provinsi</label>
          <input
            type="text"
            name="province"
            value={form.province}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Sayur</label>
          <input
            type="text"
            name="vegetable"
            value={form.vegetable}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Produksi (ton)</label>
          <input
            type="text"
            name="production"
            value={form.production}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
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
