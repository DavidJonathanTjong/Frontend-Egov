import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Navigation, Footer } from "@/components";

// async function fetchTotalCount() {
//   const apiKey = "http://127.0.0.1:8000/api/statistik/client?page=1";
//   const response = await fetch(apiKey);
//   const dataJson = await response.json();
//   return dataJson.pagination?.total ?? 0; // Ambil total jumlah data
// }

// async function getData(total: number): Promise<DataPopulasiBanjarbaru[]> {
//   const apiKey = `http://127.0.0.1:8000/api/statistik/client?page=1&pageLength=${total}`;
//   const dataJson = await fetch(apiKey).then((res) => res.json());
//   console.log(dataJson);
//   const apiData = dataJson.data ?? [];

//   return apiData.map((item: any) => ({
//     id: item.id,
//     year: item.year,
//     province: item.province,
//     vegetable: item.vegetable,
//     production: item.production,
//   }));
// }

export default async function DemoPage() {
  return (
    <>
      <Navigation />;
      <div className="container mx-auto py-10 p-8">
        <DataTable columns={columns} />
      </div>
      <Footer />;
    </>
  );
}
