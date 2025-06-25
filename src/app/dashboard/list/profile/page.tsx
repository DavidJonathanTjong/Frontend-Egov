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
import showFormattedDate from "@/utils/formatedData";
import api from "@/hooks/apiService";

const SingleTeacherPage = () => {
  const [name, setName] = useInput("");
  const [email, setEmail] = useInput("");
  const [newPassword, setNewPassword] = useInput("");
  const [confirmPassword, setConfirmPassword] = useInput("");
  const [activeSince, setActiveSince] = useInput("");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
        const imageNameResponse = await api.get<{ image_name: string }>(
          `/profile/image/${kodePegawai}`
        );
        const imageName = imageNameResponse.data.image_name;
        setImageFileName(imageName);
        if (imageName) {
          const imageResponse = await api.get(`/user/profile/${imageName}`, {
            responseType: "blob",
          });
          const imageBlob = imageResponse.data;
          const imageUrl = URL.createObjectURL(imageBlob);
          setProfileImage(imageUrl);
          console.log("Profile Image URL:", imageUrl);
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
      const response = await api.post(
        `/profile/edit-image/${kodePegawai}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Image uploaded successfully!");
      setProfileImage(response.data.profile_image);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };

  useEffect(() => {
    if (!token || !kodePegawai) return;

    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/list");

        console.log(response);

        const userData = response.data.data.find(
          (user: any) => user.kode_pegawai === kodePegawai
        );

        if (userData) {
          console.log("User found:", userData);
          setName(userData.name);
          setEmail(userData.email);
          setActiveSince(showFormattedDate(userData.created_at));
        } else {
          console.warn("User not found with kodePegawai:", kodePegawai);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [token, kodePegawai]);

  return (
    <div className="flex-1 p-8 flex flex-col gap-4 xl:flex-row">
      <div className="w-full">
        <div className="bg-white rounded-md p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <Image
              src={profileImage}
              alt="img profile"
              width={150}
              height={150}
              className="rounded-md object-cover"
            />
            <div className="flex flex-col items-center md:items-start gap-2 mt-2 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointer text-center w-full md:w-auto"
              >
                Upload New Photo
              </label>
              <button
                onClick={handleUpload}
                className="bg-green-500 text-white px-4 py-2 rounded text-center w-full md:w-auto"
              >
                Save Image Profile
              </button>
              <p className="text-sm text-gray-500 text-center md:text-left">
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
              <Input
                disabled
                type="text"
                placeholder="Aktif kerja"
                value={activeSince || ""}
                onChange={setActiveSince}
              />
            </div>
            <div>
              <Label htmlFor="text">Email</Label>
              <Input
                type="text"
                placeholder="Email"
                value={email || ""}
                onChange={setEmail}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="text">Name</Label>
              <Input
                type="text"
                placeholder="Nama"
                value={name || ""}
                onChange={setName}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:shadow-2xl hover:bg-gray-400"
                >
                  BACK
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await api.put(`/profile/edit-profile/${kodePegawai}`, {
                        name,
                        email,
                      });
                      alert("Profile updated successfully!");
                      setIsEditing(false);
                    } catch (error) {
                      console.error("Failed to update profile:", error);
                      alert("Failed to update profile.");
                    }
                  }}
                  className="bg-green-400 text-white px-4 py-2 rounded hover:shadow-2xl hover:bg-green-600"
                >
                  SAVE CHANGES
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:shadow-2xl hover:bg-blue-700"
              >
                UPDATE PROFILE
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-md p-4 md:p-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <label className="font-semibold text-lg">
              CHANGE ACCOUNT PASSWORD
            </label>
            {!isChangingPassword && (
              <Button
                onClick={() => setIsChangingPassword(true)}
                className="bg-blue-500 text-white px-4 py-2 w-full md:w-auto"
              >
                Change Password
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Your New Password</Label>
                <div className="flex flex-col md:flex-row w-full items-stretch md:items-center gap-2 mt-2">
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                    className="w-full"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    className="w-full"
                  />
                  <Button
                    onClick={async () => {
                      if (newPassword !== confirmPassword) {
                        alert("Passwords do not match");
                        return;
                      }
                      try {
                        await api.put(`/profile/edit-password/${kodePegawai}`, {
                          password: newPassword,
                          password_confirmation: confirmPassword,
                        });
                        alert("Password updated successfully!");
                        setIsChangingPassword(false);
                      } catch (error) {
                        console.error("Failed to update password:", error);
                        alert("Failed to update password.");
                      }
                    }}
                    className="bg-green-400 hover:bg-green-600 w-full md:w-auto"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() => setIsChangingPassword(false)}
                    className="bg-gray-300 hover:bg-gray-400 w-full md:w-auto"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* <div className="mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Checkbox id="deleteConfirm" />
              <Label htmlFor="deleteConfirm">
                I Confirm My Account Deactivation
              </Label>
            </div>
            <Button
              onClick={async () => {
                if (!confirm("Are you sure you want to delete your account?"))
                  return;
                try {
                  await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_BACKEND}/users/delete/${kodePegawai}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  alert("Account deleted successfully.");
                } catch (error) {
                  console.error("Failed to delete account:", error);
                  alert("Failed to delete account.");
                }
              }}
              className="mt-3 bg-red-500 hover:bg-red-600 w-full sm:w-auto"
            >
              Delete
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SingleTeacherPage;
