"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import useFetchUser from "@/hooks/useFetchUser";
import ProfileEditModal from "@/components/ProfileEditModal";

const UserProfile: React.FC = () => {
  const { user, loading, error, fetchUser } = useFetchUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refetchMessage, setRefetchMessage] = useState("");
  const router = useRouter(); // Initialize useRouter for navigation

  const handleUpdate = async () => {
    setRefetchMessage(""); // Clear any previous messages

    try {
      // Call the fetch function to get updated user data
      await fetchUser();

      // Check if the user data was successfully fetched
      if (user) {
        setRefetchMessage("User  data refetched successfully!");
      } else {
        throw new Error("User  data is null after refetching.");
      }

      // Set a timeout to clear the message after 3 seconds
      setTimeout(() => {
        setRefetchMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error during refetch:", error);
      setRefetchMessage("Failed to refetch user data.");
    }
  };

  const handleModalClose = async () => {
    setIsModalOpen(false);
    await fetchUser(); // Refresh user data when the modal is closed
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token from local storage
    router.push("/login"); // Redirect to the login page
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {refetchMessage && <p className="text-green-500">{refetchMessage}</p>}
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
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white rounded-md p-2 mt-4 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
      {isModalOpen && (
        <ProfileEditModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          user={user}
          onUpdate={handleUpdate} // Pass the handleUpdate function
        />
      )}
    </div>
  );
};

export default UserProfile;
