"use client";

// import EventCalendar from "@/components/tampilan_adm/EventCalendar";
import FinanceChart from "@/components/tampilan_adm/FinanceChart";
import UserCard from "@/components/tampilan_adm/UserCard";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import api from "@/hooks/apiService";

const AdminPage = () => {
  const { user, loading, shouldRedirect } = useAuth();
  const router = useRouter();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCrops, setTotalCrops] = useState(0);

  useEffect(() => {
    if (loading) {
      toast.loading("Loading...");
    } else {
      toast.dismiss();
      toast.success("Welcome back!");
    }
  }, [loading]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, cropsRes] = await Promise.all([
          api.get("/users/list"),
          api.get("/crops"),
        ]);

        setTotalUsers(usersRes.data?.pagination?.total || 0);
        setTotalCrops(cropsRes.data?.pagination?.total || 0);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        toast.error("Gagal mengambil data dashboard");
      }
    };

    fetchData();
  }, []);

  if (!user) return null;

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* LEFT */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          <div className="w-full h-[500px]">
            <FinanceChart />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          {/* USER CARDS in a row */}
          <div className="flex gap-4 flex-wrap">
            <UserCard type="Total User" count={totalUsers} />
            <UserCard type="Total Crops" count={totalCrops} />
          </div>
          {/* <EventCalendar /> */}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
