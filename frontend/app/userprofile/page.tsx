// app/userprofile/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import useFetchUser from "@/hooks/useFetchUser";
import ProfileEditModal from "@/components/ProfileEditModal"; // Import the modal component

const UserProfile: React.FC = () => {
  const { user, loading: fetchLoading, error } = useFetchUser();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Set a timeout to stop loading after 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  // Combine loading states
  const isLoading = loading || fetchLoading;

  if (isLoading) {
    return <p>Loading user data...</p>; // Loading state
  }

  if (error) {
    return <p>{error}</p>; // Display error message
  }

  const handleUpdateProfile = async (
    firstName: string,
    lastName: string,
    email: string,
    currentPassword: string,
    newPassword: string
  ) => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage

    try {
      const response = await fetch("http://localhost:8000/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">User Profile</h1>
      {user ? (
        <div className="mt-4">
          <p>
            <strong>First Name:</strong> {user.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {user.last_name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white rounded-md p-2 mt-4 hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <p>No user data available.</p>
      )}

      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

export default UserProfile;
