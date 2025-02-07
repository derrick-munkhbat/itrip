"use client";

import React, { useState } from "react";
import useFetchUser from "@/hooks/useFetchUser";
import ProfileEditModal from "@/components/ProfileEditModal";

const UserProfile: React.FC = () => {
  const { user, loading: fetchLoading, error, refetch } = useFetchUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define the onUpdate function to refetch user data
  const handleUpdate = () => {
    refetch(); // Call the refetch function to get updated user data
  };

  // Combine loading states
  const isLoading = fetchLoading;

  if (isLoading) {
    return <p>Loading user data...</p>; // Loading state
  }

  if (error) {
    return <p>{error}</p>; // Display error message
  }

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

      {isModalOpen && (
        <ProfileEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={user}
          onUpdate={handleUpdate} // Pass the onUpdate function
        />
      )}
    </div>
  );
};

export default UserProfile;
