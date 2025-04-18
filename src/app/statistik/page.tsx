"use client";

import React, { useEffect, useState } from "react";
import { Navigation, Footer } from "@/components";
import Dashboard from "./Dashboard";
import axios from "axios";
import { ApiData } from "./types";
import api from "@/apiService";

function Page() {
  const [dataVegetable, setDataVegetable] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiKey = "http://127.0.0.1:8000/api/statistik/client";
        // let currentPage = 1;
        // let totalPages = 1;
        let maxRowPerEachData = 2000;
        let allData: ApiData[] = [];

        // while (currentPage <= totalPages) {
        //   console.log(`Fetching page ${currentPage}...`);
        //   const { data } = await axios.get(
        //     `${apiKey}?page=${currentPage}&pageLength=${maxRowPerEachData}`
        //   );

        //   if (currentPage === 1) {
        //     totalPages = data.pagination?.last_page || 1;
        //   }

        //   allData = allData.concat(data.data);
        //   currentPage++;
        // }

        api
          .get("/statistik/client", {
            params: {
              pageLength: maxRowPerEachData,
            },
          })
          .then((response) => {
            const { data } = response.data;
            allData = allData.concat(data);
            // totalPages = response.data.pagination?.last_page || 1;
          });

        // Format data
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
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <div className="flex-1 p-4">
        {!loading ? (
          <Dashboard apiData={dataVegetable} />
        ) : (
          <div className="">
            <p className="text-center">Data Anda sedang Dimuat...</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Page;
