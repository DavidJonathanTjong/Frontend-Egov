import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-5 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap justify-between gap-5">
        {/* Bagian Logo dan Deskripsi */}
        <div className="flex flex-col items-start gap-4">
          <Image
            src="/logo.png" // Ganti dengan path logo yang sesuai
            alt="Logo"
            width={150}
            height={40}
            className="object-contain"
          />
          <p className="text-sm">
            Dinas Pertanian & Kependudukan <br />
            Banjarbaru, Indonesia.
          </p>
        </div>

        {/* Bagian Link Navigasi */}
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-gray-900">Navigasi</h3>
            <Link href="/about" className="hover:text-gray-900 transition">
              Tentang Kami
            </Link>
            <Link href="/services" className="hover:text-gray-900 transition">
              Layanan
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-gray-900">Legalitas</h3>
            <Link href="/privacy" className="hover:text-gray-900 transition">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-gray-900 transition">
              Syarat & Ketentuan
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-gray-900">Kontak</h3>
            <p>Email: support@example.com</p>
            <p>Telepon: +62 812-3456-7890</p>
          </div>
        </div>
      </div>

      {/* Bagian Copyright */}
      <div className="border-t border-gray-300 py-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Data Statistik Banjarbaru. All
          Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
