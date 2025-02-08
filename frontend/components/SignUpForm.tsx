import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [signingUp, setSigningUp] = useState(false); // State for signing up
  const router = useRouter(); // Initialize useRouter

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault(); // Prevent the default form submission
   setSigningUp(true); // Set signing up state to true

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

     if (response.ok) {
       const data = await response.json(); // This will now work correctly
       console.log("Response data:", data); // Log the entire response

       // Check if the token exists in the response
       if (data.token) {
         localStorage.setItem("token", data.token); // Store the token in local storage
         console.log("Token stored:", localStorage.getItem("token")); // Check if the token is stored
       } else {
         console.error("Token is undefined in the response");
       }

       // Redirect to the login page after a delay
       setTimeout(() => {
         router.push("/login"); // Redirect to the login page
       }, 3000); // Redirect after 3 seconds
     } else {
       const errorData = await response.json(); // Expecting JSON error response
       setError(errorData.message || "Error registering user"); // Set error message
       console.error("Error registering user:", errorData);
     }
   } catch (error) {
     setError("Network error occurred"); // Handle network errors
     console.error("Network error:", error);
   } finally {
     setSigningUp(false); // Set signing up state to false
   }
 };

  // Function to handle login button click
  const handleLoginClick = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
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
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Display error message */}
        {signingUp ? (
          <p>Signing up...</p>
        ) : (
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Sign Up
          </button>
        )}
        <button
          type="button"
          onClick={handleLoginClick}
          className="p-2 bg-gray-400 text-white rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
