"use client";

// app/login/page.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Initialize useRouter

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    const formData = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User  logged in successfully:", data);
        // Redirect to the user profile or dashboard after successful login
        router.push("/userprofile");
      } else {
        const errorData = await response.json();
        console.error("Error logging in:", errorData);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleSignUpClick = () => {
    router.push("/"); // Navigate to app/page.tsx
  };

  return (
    <form
      className="flex flex-col gap-5 justify-center w-2/5"
      onSubmit={handleLogin}
    >
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
        Login
      </button>
      <button
        type="button"
        onClick={handleSignUpClick}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Login;
