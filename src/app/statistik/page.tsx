"use client";

import React, { useEffect, useState } from "react";
import { Navigation, Footer } from "@/components";
import Dashboard from "./Dashboard";
import api from "@/hooks/apiService";
import { ApiData } from "./types";

function Page() {
  const [dataVegetable, setDataVegetable] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = "/statistik/client";
        const maxRowPerPage = 2000;
        let currentPage = 1;
        let totalPages = 1;
        let allData: ApiData[] = [];

        while (currentPage <= totalPages) {
          const response = await api.get(
            `${apiKey}?page=${currentPage}&pageLength=${maxRowPerPage}`
          );
          const resData = response.data;

          if (currentPage === 1) {
            totalPages = resData.pagination?.last_page || 1;
          }

          const pageData = Array.isArray(resData.data) ? resData.data : [];
          allData = allData.concat(pageData);
          currentPage++;
        }

        const formattedData = allData.map((item) => ({
          id: item.id,
          year: item.year,
          province: item.province,
          vegetable: item.vegetable,
          production: item.production,
        }));

        setDataVegetable(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <div className="flex-1 p-4">
        {!loading ? (
          <Dashboard apiData={dataVegetable} />
        ) : (
          <div className="text-center py-10">
            <p>Data Anda sedang Dimuat...</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Page;
