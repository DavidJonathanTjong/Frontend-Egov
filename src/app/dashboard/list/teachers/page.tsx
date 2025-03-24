"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DataTable } from "./data-table";
import { DataPegawaiKedinasan, columns } from "./columns";
import Cookies from "js-cookie";
import showFormattedDate from "@/utils/formatedData";
import { useForm } from "react-hook-form";

const TeacherListPage = () => {
  const [data, setData] = useState<DataPegawaiKedinasan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const fetchData = async () => {
    const apiKey = `${process.env.NEXT_PUBLIC_API_BACKEND}/api/users/list`;
    const token = Cookies.get("token");

    if (!token) {
      console.error("Token tidak ditemukan!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(apiKey, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const dataJson = await response.json();
      console.log("Response:", dataJson);

      setData(
        dataJson.data?.map((item: any) => ({
          kodePegawai: item.kode_pegawai,
          name: item.name,
          email: item.email,
          createdAt: showFormattedDate(item.created_at),
          updatedAt: showFormattedDate(item.updated_at),
        })) ?? []
      );
    } catch (error) {
      console.error("Error ketika fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUserClick = () => {
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("img_profile", file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData: any) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("kode_pegawai", formData.kode_pegawai);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("password_confirmation", formData.confirm);
      if (formData.img_profile) {
        formDataToSend.append("img_profile", formData.img_profile);
      }

      const token = Cookies.get("token");

      const response = await fetch("http://127.0.0.1:8000/api/user/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        alert("User berhasil ditambahkan!");
        reset();
        setIsModalOpen(false);
        setImagePreview(null);
        fetchData(); // Memperbarui data setelah menambahkan user
      } else {
        alert(`Gagal: ${result.message}`);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Daftar User</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <span>
            <b>ADD USER</b>
          </span>
          <div className="flex items-center gap-4 self-end">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
              onClick={handleAddUserClick}
            >
              <Image
                src="/images/plus-icon.png"
                alt=""
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <DataTable columns={columns(fetchData)} data={data} />
      )}
      {/* Register form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            <h2 className="text-xl font-semibold mb-4">Tambah User</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-between gap-4">
                {/* Bagian kiri (Input teks) */}
                <div className="flex-1">
                  <div className="mb-3">
                    <label className="block text-sm font-medium">
                      Kode Pegawai
                    </label>
                    <input
                      {...register("kode_pegawai", { required: true })}
                      className="w-full p-2 border rounded"
                    />
                    {errors.kode_pegawai && (
                      <span className="text-red-500 text-sm">Wajib diisi</span>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium">Nama</label>
                    <input
                      {...register("name", { required: true })}
                      className="w-full p-2 border rounded"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">Wajib diisi</span>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      {...register("email", { required: true })}
                      className="w-full p-2 border rounded"
                      type="email"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">Wajib diisi</span>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      {...register("password", { required: true })}
                      className="w-full p-2 border rounded"
                    />
                    {errors.password && (
                      <span className="text-red-500 text-sm">Wajib diisi</span>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      {...register("confirm", { required: true })}
                      className="w-full p-2 border rounded"
                    />
                    {errors.confirm && (
                      <span className="text-red-500 text-sm">Wajib diisi</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium">
                    Gambar Profil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded"
                  />
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={120}
                      height={120}
                      className="mt-3 rounded-md border"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                    setImagePreview(null);
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherListPage;
