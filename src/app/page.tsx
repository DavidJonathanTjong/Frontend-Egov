import React from "react";
import { Hero } from "@/components";
import { Navigation, Footer } from "@/components";

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <main className="overflow-hidden container mx-auto px-4 sm:px-6 lg:px-8"></main>
      <main className="overflow-hidden container mx-auto px-4 sm:px-6 lg:px-8">
        <h1>
          {" "}
          <b>Pentingnya Ketersediaan Data Berbentuk Digital</b>
        </h1>
        <p>
          Ketersediaan data digital meningkatkan efisiensi dan transparansi
          pengelolaan informasi pertanian. Digitalisasi memungkinkan akses
          real-time, analisis tren produksi, serta prediksi pasar yang lebih
          akurat. Dengan data yang terintegrasi akan mengurangi ketidakpastian
          dan mendorong transformasi digital bagi petani.
        </p>
        <br />

        <h1>
          <b>
            Berikut adalah tujuan yang ingin dicapai untuk mengatasi
            permasalahan yang telah disebutkan
          </b>
        </h1>
        <ul>
          <li> Meningkatkan Aksesibilitas Data Produksi Sayuran</li>
          <li> Mendukung Perencanaan Produksi yang Lebih Akurat</li>
          <li> Meningkatkan Daya Saing Pertanian Berbasis Data</li>
          <li> Mengurangi Resiko Ketidakpastian dalam Agribisnis</li>
        </ul>
        <br />

        <h1>
          {" "}
          <b>Sumber Data</b>
        </h1>
        <p>
          Pengumpulan data bersumber dari Badan Pusat Statistik dengan mengambil
          data produksi sayuran mulai tahun 2000-2023 seluruh provinsi di
          Indonesia. Data ini terdiri dari 15 ribu instance dengan 4 feature
          utama, yaitu: year, province, vegetable, dan production.
        </p>
        <p>
          Dari berbagai file excel terpisah yang berisikan produksi sayuran pada
          berbagai provinsi dalam rentang tahun tertentu, data tersebut
          digabungkan menjadi 1 file yang mencakup semua tahun yakni tahun 2000
          - 2023. Kemudian, akan dibuat model prediksi dengan data tersebut
          sebagai rekomendasi kepada pengguna.
        </p>
        <br />
      </main>
      <Footer />
    </>
  );
}
