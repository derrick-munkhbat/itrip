"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [loggingIn, setLoggingIn] = useState(false); // State for logging in
  const [showLoggingInMessage, setShowLoggingInMessage] = useState(false); // State for showing logging in message
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    setLoggingIn(true); // Set logging in state to true
    setShowLoggingInMessage(true); // Show the logging in message

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
        localStorage.setItem("token", data.token); // Store the token in local storage
        // Redirect to the user profile or dashboard after successful login
        router.push("/userprofile");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error logging in"); // Set error message
        console.error("Error logging in:", errorData);
      }
    } catch (error) {
      setError("Network error occurred"); // Handle network errors
      console.error("Network error:", error);
    } finally {
      setLoggingIn(false); // Set logging in state to false
      setShowLoggingInMessage(false); // Hide the logging in message after the login process is complete
    }
  };

  const handleSignUpClick = () => {
    router.push("/"); // Navigate to app/page.tsx
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
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
        <div className="flex items-center">
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password
            placeholder="Enter your password"
            className="flex-1 p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Display error message */}
        {showLoggingInMessage && <p>Logging in...</p>}{" "}
        {/* Show logging in message */}
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded"
          disabled={loggingIn}
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleSignUpClick}
          className="p-2 bg-gray-400 text-white rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Login;
