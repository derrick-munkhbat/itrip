import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    user_id: string; // Ensure this matches the fetched data
    first_name: string;
    last_name: string;
    email: string;
  } | null; // Allow user to be null
  onUpdate: () => void; // Function to refetch user data
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdate,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const router = useRouter(); // Initialize useRouter for navigation

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    setLoading(true); // Set loading to true

    try {
      const response = await fetch(
        `http://localhost:8000/users/${user.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            new_password: newPassword, // Optional
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating profile:", errorData); // Log the error
        throw new Error(errorData.message || "Error updating profile");
      }

      // Log the token and updated user data to the console
      console.log("Token used for update:", token); // Log the token
      console.log("Updated User Data:", {
        user_id: user.user_id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        new_password: newPassword, // Optional, only if provided
      });

      // Show success message
      setMessage("Profile updated successfully!");

      // Call the function to refetch user data
      onUpdate();

      // Set a timeout to clear the message after 3 seconds
      setTimeout(() => {
        setMessage("");
        onClose(); // Close the modal after the timeout
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to delete your profile.");
      return;
    }

    setLoading(true); // Set loading to true

    try {
      const response = await fetch(
        `http://localhost:8000/users/${user.user_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user profile.");
      }

      alert("Your profile has been deleted successfully.");
      localStorage.removeItem("token"); // Clear the token from local storage
      router.push("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete your profile. Please try again.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        {loading && <p className="text-blue-500">Updating profile...</p>}{" "}
        {/* Loading message */}
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
        <div className="flex items-center mb-4">
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password
            placeholder="New Password (optional)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 flex-1"
          />
          <label className="ml-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)} // Toggle showPassword state
            />
            Show
          </label>
        </div>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            disabled={loading} // Disable button while loading
          >
            Save Changes
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
            disabled={loading} // Disable button while loading
          >
            Delete Profile
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfileEditModal;
