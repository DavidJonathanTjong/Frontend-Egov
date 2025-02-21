import { DataPopulasiBanjarbaru, columns } from "./columns";
import { DataTable } from "./data-table";
import { Navigation, Footer } from "@/components";

async function getData(): Promise<DataPopulasiBanjarbaru[]> {
  const apiKey =
    "https://webapi.bps.go.id/v1/api/interoperabilitas/datasource/simdasi/id/25/tahun/2023/id_tabel/WVRlTTcySlZDa3lUcFp6czNwbHl4QT09/wilayah/6372000/key/28105d857e25168c2dc8758ac2fcb946";

  const dataJson = await fetch(apiKey).then((res) => res.json());
  console.log(dataJson);

  const apiData = dataJson.data[1].data ?? [];

  return apiData.map((item: any) => ({
    kecamatan: item.label,
    jumlahPenduduk: item.variables?.nzudy5elv7?.value ?? 0,
    lajuPertumbuhanPenduduk: item.variables?.d8efayjxld?.value ?? 0,
    persentasePenduduk: item.variables?.efg2cjrdn2?.value ?? 0,
    kepadatanPenduduk: item.variables?.xauol4vjpj?.value ?? 0,
    rasioJenisKelamin: item.variables?.ztxhjlhyqd?.value ?? 0,
  }));
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <>
      <Navigation />;
      <div className="container mx-auto py-10 p-8">
        <DataTable columns={columns} data={data} />
      </div>
      <Footer />;
    </>
  );
}
