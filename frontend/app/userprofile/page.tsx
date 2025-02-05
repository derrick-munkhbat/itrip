'use client'

// app/userprofile/page.tsx

import React from "react";
// import useFetchUser from "@/hooks/useFetchUser";
const UserProfile: React.FC = () => {
  // const { user, loading, error } = useFetchUser(); // Use the custom hook

  // const handleChangePassword = () => {
  //   // Logic to change the password
  //   console.log("Change password clicked");
  // };

  // if (loading) {
  //   return <p>Loading user data...</p>; // Loading state
  // }

  // if (error) {
  //   return <p>{error}</p>; // Display error message
  // }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">User Profile</h1>
      {/* {user ? (
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
      )} */}
      <button
        // onClick={handleChangePassword}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Change Password
      </button>
    </div>
  );
};

export default UserProfile;
