"use client";

import React, { useState, useEffect } from "react";
import useInput from "@/hooks/useInput";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const SingleTeacherPage = () => {
  const [firstName, setFirstName] = useInput();
  const [lastName, setLastName] = useInput();
  const [email, setEmail] = useInput();
  // const [kodePegawai, setKodePegawai] = useInput();

  const [currentPassword, setCurrentPassword] = useInput();
  const [newPassword, setNewPassword] = useInput();
  const [confirmPassword, setConfirmPassword] = useInput();

  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState("/images/avatar.png");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const token = Cookies.get("token");
  const [kodePegawai, setKodePegawai] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    try {
      const decodedToken: any = jwtDecode(token);
      const pegawai = decodedToken.sub;
      setKodePegawai(pegawai);
    } catch (err) {
      console.error("Token invalid:", err);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !kodePegawai) return;
    const fetchProfileData = async () => {
      try {
        // Ambil nama file gambar
        const imageNameResponse = await axios.get<{ image_name: string }>(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/profile/image/${kodePegawai}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const imageName = imageNameResponse.data.image_name;
        setImageFileName(imageName);

        // Ambil gambar berdasarkan nama file
        if (imageName) {
          const imageResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/user/profile/${imageName}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            }
          );
          setProfileImage(URL.createObjectURL(imageResponse.data));
          console.log(
            "Profile Image URL:",
            URL.createObjectURL(imageResponse.data)
          );
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileData();
  }, [token, kodePegawai]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("img_profile", selectedImage);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/profile/edit-image/198809102020030311000`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Image uploaded successfully!");
      setProfileImage(response.data.profile_image); // Update image setelah upload sukses
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };

  return (
    <div className="flex-1 p-8 flex flex-col gap-4 xl:flex-row">
      <div className="w-full">
        <div className=" bg-white rounded-md p-6 h-[250px]">
          <div className="flex items-start gap-4">
            <Image
              src={profileImage}
              alt="img profile"
              width={150}
              height={150}
            />
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Upload New Photo
              </label>
              <button
                onClick={handleUpload}
                className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Image Profile
              </button>
              <p className="text-sm text-gray-500">
                Allowed JPG, GIF or PNG. Max size of 800Kb
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-6 mt-6 h-[300px]">
          <div className="flex-1 mt-2">
            <label htmlFor="text">BIODATA PRIBADI</label>
          </div>
          {/* form  */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="text">Kode Pegawai</Label>
              <Input
                disabled
                type="text"
                placeholder="Kode Pegawai"
                value={kodePegawai || ""}
              />
            </div>
            <div>
              <Label htmlFor="text">Active Since</Label>
              <Input disabled type="text" placeholder="2000" value={2000} />
            </div>
            <div>
              <Label htmlFor="text">Email</Label>
              <Input disabled type="text" placeholder="Email" value={"3242"} />
            </div>
            <div>
              <Label htmlFor="text">Name</Label>
              <Input disabled type="text" placeholder="Name" value={"3242"} />
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-2">
            <Button
              type="submit"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:shadow-2xl hover:bg-gray-400"
            >
              BACK
            </Button>

            <Button
              type="submit"
              className="bg-green-400 text-white px-4 py-2 rounded hover:shadow-2xl hover:bg-green-600"
            >
              SAVE CHANGES
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-md p-6 mt-6 h-[200px]">
          <div className="flex-1 mt-2">
            <label htmlFor="text">ACCOUNT PASSWORD AND DELETE</label>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="text">Your New Password</Label>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Password" />
                <Button
                  type="submit"
                  className="bg-green-400 hover:shadow-2xl hover:bg-green-600"
                >
                  CONFIRM
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Checkbox id="deleteConfirm" />
                <Label htmlFor="terms">I Confirm My Account Deactivation</Label>
              </div>
              <Button
                type="submit"
                className="mt-2 bg-red-500 hover:shadow-2xl hover:bg-red-600"
              >
                DELETE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTeacherPage;
