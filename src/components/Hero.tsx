"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-blue-50 dark:bg-gray-950">
      <div className="absolute left-0 top-20 w-40 aspect-video bg-gradient-to-br from-blue-600 to-sky-400 rounded-full blur-3xl opacity-60"></div>
      <div className="relative mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 py-12 md:py-24 lg:py-4 flex flex-col-reverse md:flex-col lg:flex-row lg:items-center gap-6 md:gap-10">
        <div className="lg:w-1/2 text-center lg:text-left max-w-2xl md:max-w-3xl mx-auto flex flex-col items-center md:items-start">
          <h1 className="font-semibold text-teal-950 dark:text-white font-display text-3xl md:text-5xl lg:text-5xl">
              Sistem E-Government Berbasis Data untuk Wawasan Produksi Tanaman Sayuran {" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-teal-600 to-blue-600">
              Seluruh Provinsi Indonesia
            </span>
          </h1>
          <p className="mt-8 text-gray-700 dark:text-gray-300 mx-auto lg:mx-0 max-w-xl">
            Suatu Upaya Untuk Berkontribusi Terhadap Swasembada Pangan Melalui
            Machine Learning
          </p>
        </div>

        <div className="lg:w-1/2 relative lg:h-auto max-w-2xl md:max-w-3xl mx-auto hidden md:flex justify-end">
          <div className="relative w-full h-full max-sm:hidden flex items-center aspect-square overflow-hidden lg:aspect-auto">
            <Image
              src="/Beranda.jpg"
              width={1266}
              height={1224}
              alt="Agristat Pertanian"
              className="w-full relative h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
