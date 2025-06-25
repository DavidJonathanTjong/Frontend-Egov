import React from "react";
import { Hero } from "@/components";
import { Navigation, Footer } from "@/components";

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <main className="overflow-hidden container mx-auto px-4 sm:px-6 lg:px-8"></main>
      <Footer />
    </>
  );
}
