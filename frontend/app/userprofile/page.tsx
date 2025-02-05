// app/userprofile/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import useFetchUser from "@/hooks/useFetchUser";
const UserProfile: React.FC = () => {
  const { user, loading: fetchLoading, error } = useFetchUser();
  const [loading, setLoading] = useState(true);

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
