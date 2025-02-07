import React, { useState, useEffect } from "react";

// ProfileEditModal.tsx

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    user_id: string; // Ensure this matches the fetched data
    first_name: string;
    last_name: string;
    email: string;
  } | null; // Allow user to be null
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async () => {
    // Log the updated data to the console
    console.log("Updated User Data:");
    console.log({
      user_id: user?.user_id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      currentPassword: currentPassword,
      newPassword: newPassword,
    });

    if (!user) {
      console.error("User  is null");
      return; // Exit if user is null
    }

    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    const userId = user.user_id; // Access user.user_id

    try {
      const response = await fetch(`http://localhost:8000/users/${userId}`, {
        method: "PUT",
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

      // Optionally, you can refresh the user data after a successful update
      // You might want to call a function to refetch user data here

      // Close the modal after successful update
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />
        <input
          type="password"
          placeholder="New Password (leave blank if not changing)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white rounded-md p-2 w-full hover:bg-blue-600 transition"
        >
          Update Profile
        </button>
        {message && <p className="text-red-500 mt-2">{message}</p>}
        <button onClick={onClose} className="mt-4 text-gray-500 underline">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfileEditModal;
