"use client"; // Pastikan kode berjalan di client-side

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DataTable } from "./data-table";
import { DataPegawaiKedinasan, columns } from "./columns";
import Cookies from "js-cookie";

const TeacherListPage = () => {
  const [data, setData] = useState<DataPegawaiKedinasan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          })) ?? []
        );
      } catch (error) {
        console.error("Error ketika fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <Link
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
              href={"#"}
            >
              <Image
                src="/images/plus-icon.png"
                alt=""
                width={30}
                height={30}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <DataTable columns={columns} data={data} />
      )}

      {/* PAGINATION */}
      {/* <Pagination /> */}
    </div>
  );
};

export default TeacherListPage;
