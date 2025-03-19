import React from "react";
import { Navigation, Footer } from "@/components";
import Dashboard from "./Dashboard";

async function getData() {
  const apiKey = "http://127.0.0.1:8000/api/statistik/client";

  // Fetch halaman pertama untuk mendapatkan jumlah total halaman
  const response = await fetch(apiKey);
  const dataJson = await response.json();

  const totalPages = dataJson.pagination.last_page;
  let allData = dataJson.data ?? [];

  // Fetch halaman lain secara bersamaan
  const responses = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetch(`${apiKey}?page=${i + 2}`).then((res) => res.json())
    )
  );

  // Gabungkan semua data
  responses.forEach((response) => {
    allData = allData.concat(response.data);
  });

  console.log(allData);

  return allData.map((item: any) => ({
    id: item.id,
    year: item.year,
    province: item.province,
    vegetable: item.vegetable,
    production: item.production,
  }));
}

async function Page() {
  const apiData = await getData();
  return (
    <>
      <Navigation />
      <Dashboard apiData={apiData} />
      <Footer />
    </>
  );
}

export default Page;
