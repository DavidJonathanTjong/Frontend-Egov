"use client";

import Announcements from "@/components/tampilan_adm/Announcements";
import AttendanceChart from "@/components/tampilan_adm/AttendanceChart";
import CountChart from "@/components/tampilan_adm/CountChart";
import EventCalendar from "@/components/tampilan_adm/EventCalendar";
import FinanceChart from "@/components/tampilan_adm/FinanceChart";
import UserCard from "@/components/tampilan_adm/UserCard";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AdminPage = () => {
  const { user, loading, shouldRedirect } = useAuth();
  const router = useRouter();

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
            <UserCard type="student" />
            <UserCard type="teacher" />
          </div>
          <EventCalendar />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
