// app/userprofile/page.tsx

import React from "react";

const UserProfile: React.FC = () => {
  // You can fetch user data here if needed
  // For now, we'll just display a simple message

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <p className="mt-4">Welcome to your profile page!</p>
      {/* You can add more user-related information here */}
    </div>
  );
};

export default UserProfile;
