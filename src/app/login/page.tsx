"use client";

import React, { useEffect } from "react";
import { Navigation } from "@/components";
import Image from "next/image";
import useInput from "@/hooks/useInput";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

function Page() {
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("token")) {
      router.push("/dashboard/admin");
    }
  }, [router]);

  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const handleCredentialLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    toast.loading("Loging in...");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        { email, password }
      );
      Cookies.set("token", response.data.token);
      router.push("/dashboard/admin");
      toast.dismiss();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.dismiss();
        const errorMessage =
          error.response?.data?.error ||
          "Server sedang sibuk. Mohon hubungi administrator.";
        toast.error(errorMessage);
        console.error("Terjadi kesalahan:", errorMessage);
      } else {
        console.error("Terjadi kesalahan kode:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="bg-gray-100 flex-grow flex items-center justify-center">
        <div className="p-10 max-[768px]:px-14 max-[768px]:py-10 min-[768px]:mx-20 rounded-xl shadow-lg bg-white h-[75%] max-[768px]:h-[80%] w-fit max-[768px]:w-[80%] font-[sans-serif] max-[768px]:my-10 ">
          <div className="flex flex-col items-center ">
            <div className="md:grid md:grid-cols-2 items-center gap-24 max-w-6xl max-md:max-w-md w-full">
              <div>
                <Image
                  src="/images/login2.png"
                  width={1266}
                  height={1000}
                  alt="logo login"
                  className="w-full min-w-[300px] min-h-[300px] max-h-[450px] relative max-[768px]:hidden"
                />
              </div>

              <form
                className="max-w-md md:ml-auto w-full"
                onSubmit={handleCredentialLogin}
              >
                <h3 className="text-gray-800 text-[30pt] font-extrabold mb-2">
                  Sign in
                </h3>
                <p className="text-gray-400 mb-9">
                  Login ke Sistem Dashboard E-Agristat
                </p>

                <div className="space-y-4">
                  <div>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={onEmailChange}
                      className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <input
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={onPasswordChange}
                      className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="!mt-8">
                  <button
                    type="submit"
                    className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Log in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
