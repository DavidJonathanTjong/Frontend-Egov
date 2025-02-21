"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const navItems = [
  {
    id: 1,
    text: "Beranda",
    link: "/",
  },
  {
    id: 2,
    text: "Statistik",
    link: "#",
  },
  {
    id: 3,
    text: "Informasi",
    link: "/information",
  },
  {
    id: 4,
    text: "Peta Sebaran",
    link: "#",
  },
  {
    id: 5,
    text: "Profil",
    link: "/profile",
  },
  {
    id: 6,
    text: "coba dashboard",
    link: "/dashboard/admin",
  },
];
const Navigation = () => {
  const [openNavbar, setOpenNavbar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleNavbar = () => {
    setOpenNavbar((openNavbar) => !openNavbar);
  };
  const closeNavbar = () => {
    setOpenNavbar(false);
  };
  return (
    <>
      <div
        onClick={() => {
          closeNavbar();
        }}
        aria-hidden="true"
        className={`fixed bg-gray-800/40 inset-0 z-30 ${
          openNavbar ? "flex lg:hidden" : "hidden"
        }`}
      />
      <header
        className={`sticky top-0 w-full flex items-center h-20 border-b border-b-gray-100 dark:border-b-gray-900 z-40 backdrop-filter backdrop-blur-xl transition-all duration-300 ${
          isScrolled ? "bg-white/80 shadow-lg" : "bg-transparent"
        }`}
      >
        <nav className="relative mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 flex gap-x-5 justify-between items-center">
          <div className="flex items-center min-w-max">
            <Link href="#" className="font-semibold flex items-center gap-x-2">
              <span className="flex">
                <span className="w-3 h-6 rounded-l-full flex bg-blue-600" />
                <span className="w-3 h-6 rounded-r-full flex bg-teal-400 mt-2" />
              </span>
              <span
                className={`text-lg ${
                  isScrolled
                    ? "text-gray-800"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Hydra
              </span>
            </Link>
          </div>
          <div
            className={`
                      absolute top-full left-0 bg-white dark:bg-gray-950 lg:bg-transparent border-b border-gray-200 dark:border-gray-800 py-8 lg:py-0 px-5 sm:px-10 md:px-12 lg:px-0 lg:border-none w-full lg:top-0 lg:relative  lg:flex lg:justify-between duration-300 ease-linear
                      ${
                        openNavbar
                          ? ""
                          : "translate-y-10 opacity-0 invisible lg:visible  lg:translate-y-0 lg:opacity-100"
                      }
                  `}
          >
            <ul className="flex flex-col lg:flex-row gap-6 lg:items-center text-gray-700 dark:text-gray-300 lg:w-full lg:justify-center">
              {navItems.map((navItem) => (
                <li key={navItem.id}>
                  <Link
                    href={navItem.link}
                    className="relative py-2.5 duration-300 ease-linear hover:text-blue-600 after:absolute after:w-full after:left-0 after:bottom-0 after:h-px after:rounded-md after:origin-left after:ease-linear after:duration-300 after:scale-x-0 hover:after:scale-100 after:bg-blue-600"
                  >
                    {navItem.text}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4  lg:min-w-max mt-10 lg:mt-0">
              <Link
                href="#"
                className="px-6 py-3 duration-300 ease-linear flex justify-center w-full sm:w-auto border border-blue-600 text-blue-600 hover:text-white hover:bg-blue-700 dark:bg-gray-900 dark:text-white dark:border-gray-800 dark:hover:bg-gray-950 rounded-full"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => toggleNavbar()}
              aria-label="toggle navbar"
              className="p-3"
            >
              {openNavbar ? (
                <FiX size={24} className="text-gray-800 dark:text-gray-200" />
              ) : (
                <FiMenu
                  size={24}
                  className="text-gray-800 dark:text-gray-200"
                />
              )}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navigation;
