// app/userprofile/page.tsx

"use client";

import React from "react";
import useFetchUser from "@/hooks/useFetchUser";

const UserProfile: React.FC = () => {
  const { user, loading, error } = useFetchUser();

  if (loading) {
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
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default UserProfile;
