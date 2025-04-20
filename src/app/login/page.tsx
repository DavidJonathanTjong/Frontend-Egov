"use client";

import React, { useEffect, useState } from "react";
import { Navigation, Footer } from "@/components";
import Image from "next/image";
import useInput from "@/hooks/useInput";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import api from "@/apiService";
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
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/auth/login`,
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

  // const handleGithubLogin = async () => {
  //   await signIn("github", { redirect: true, callbackUrl: "/dashboard/admin" });
  // };

  // const handleGoogleLogin = async () => {
  //   await signIn("google", { redirect: true, callbackUrl: "/dashboard/admin" });
  // };

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
                  {/* <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-3 block text-sm text-gray-800">
                          Remember me
                        </label>
                      </div>
                      <div className="text-sm">
                        <a
                          href="jajvascript:void(0);"
                          className="text-blue-600 hover:text-blue-500 font-semibold"
                        >
                          Forgot your password?
                        </a>
                      </div>
                    </div> */}
                </div>

                <div className="!mt-8">
                  <button
                    type="submit"
                    className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Log in
                  </button>
                </div>

                {/* <div className="my-4 flex items-center gap-4">
                    <hr className="w-full border-gray-300" />
                    <p className="text-sm text-gray-800 text-center">or</p>
                    <hr className="w-full border-gray-300" />
                  </div>

                  <div className="space-x-6 flex justify-center">
                    <button
                      type="button"
                      className="border-none outline-none p-2 rounded-md hover:bg-gray-100 transition"
                      onClick={handleGoogleLogin}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32px"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="#fbbd00"
                          d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                          data-original="#fbbd00"
                        />
                        <path
                          fill="#0f9d58"
                          d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                          data-original="#0f9d58"
                        />
                        <path
                          fill="#31aa52"
                          d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                          data-original="#31aa52"
                        />
                        <path
                          fill="#3c79e6"
                          d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                          data-original="#3c79e6"
                        />
                        <path
                          fill="#cf2d48"
                          d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                          data-original="#cf2d48"
                        />
                        <path
                          fill="#eb4132"
                          d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                          data-original="#eb4132"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="border-none outline-none p-2 rounded-md hover:bg-gray-100 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32px"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="#1877f2"
                          d="M512 256c0 127.78-93.62 233.69-216 252.89V330h59.65L367 256h-71v-48.02c0-20.25 9.92-39.98 41.72-39.98H370v-63s-29.3-5-57.31-5c-58.47 0-96.69 35.44-96.69 99.6V256h-65v74h65v178.89C93.62 489.69 0 383.78 0 256 0 114.62 114.62 0 256 0s256 114.62 256 256z"
                          data-original="#1877f2"
                        />
                        <path
                          fill="#fff"
                          d="M355.65 330 367 256h-71v-48.021c0-20.245 9.918-39.979 41.719-39.979H370v-63s-29.296-5-57.305-5C254.219 100 216 135.44 216 199.6V256h-65v74h65v178.889c13.034 2.045 26.392 3.111 40 3.111s26.966-1.066 40-3.111V330z"
                          data-original="#ffffff"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="border-none outline-none p-2 rounded-md hover:bg-gray-100 transition"
                      onClick={handleGithubLogin}
                    >
                      <Image
                        src="/images/github-mark.png"
                        alt="GitHub Logo"
                        width="32"
                        height="32"
                        className="w-8 h-8"
                      />
                    </button>
                  </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Page;
