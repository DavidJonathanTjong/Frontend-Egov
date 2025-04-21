"use client";

import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/images/home.png",
        label: "Home",
        href: "/dashboard/admin",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/images/student.png",
        label: "Users",
        href: "/dashboard/list/users",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/images/student.png",
        label: "Petani",
        href: "/dashboard/list/petani",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/images/parent.png",
        label: "Produksi Tanaman",
        href: "/dashboard/list/crops",
        visible: ["admin", "teacher"],
      },
    ],
  },
  {
    title: "Machine Learning",
    items: [
      {
        icon: "/images/profile.png",
        label: "Prediction",
        href: "/dashboard/list/prediksi",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/images/profile.png",
        label: "Profile",
        href: "/dashboard/list/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  const router = useRouter();

  const onLogOutHandler = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      const response = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Cookies.remove("token");
        router.push("/login");
      } else {
        console.error("Logout gagal:", response.statusText);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat logout:", error);
    }
  };

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md  hover:bg-blue-100"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
      <button
        onClick={onLogOutHandler}
        className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-red-100 w-full mt-4"
      >
        <Image src="/images/logout.png" alt="Logout" width={20} height={20} />
        <span className="hidden lg:block">Logout</span>
      </button>
    </div>
  );
};

export default Menu;
