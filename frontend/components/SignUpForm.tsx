// app/components/SignUpForm.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    setLoading(true); // Set loading to true

    const formData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Form submitted with data:", formData);
      console.log("Response status:", response.status);
      console.log("Response status text:", response.statusText);

      if (response.ok) {
        const data = await response.json(); // This will now work correctly
        console.log("User  registered successfully:", data);

        // Redirect to UserProfile after a delay
        setTimeout(() => {
          router.push("/userprofile");
        }, 3000); // Redirect after 3 seconds
      } else {
        const errorData = await response.json(); // Expecting JSON error response
        console.error("Error registering user:", errorData);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  // Function to handle login button click
  const handleLoginClick = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <form
      className="flex flex-col gap-5 justify-center w-2/5"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Enter your first name"
        className="flex-1 p-2 border border-gray-300 rounded"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Enter your last name"
        className="flex-1 p-2 border border-gray-300 rounded"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 p-2 border border-gray-300 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Enter your password"
        className="flex-1 p-2 border border-gray-300 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Sign Up
      </button>
      <button
        type="button" // Prevent form submission
        onClick={handleLoginClick} // Handle login button click
        className="p-2 bg-blue-500 text-white rounded"
      >
        Login
      </button>
      {loading && <p className="text-blue-500">Registering, please wait...</p>}{" "}
      {/* Loading message */}
    </form>
  );
};

export default SignUpForm;
