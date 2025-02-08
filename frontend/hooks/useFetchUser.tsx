"use client";

import { useEffect, useState, useCallback } from "react";

// Define the User interface
interface User {
  id: string; // Specify the type for user ID
  first_name: string;
  last_name: string;
  email: string;
}

const useFetchUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 const fetchUser = useCallback(async (): Promise<void> => {
   const token = localStorage.getItem("token");

   if (!token) {
     setError("No token found");
     setLoading(false);
     return;
   }

   try {
     const response = await fetch("http://localhost:8000/protected", {
       method: "GET",
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });

     if (response.ok) {
       const data: User = await response.json();
       console.log("Fetched user data:", data);
       setUser(data);
     } else {
       const errorData = await response.json();
       console.error("Error fetching user data:", errorData); // Log the error details
       setError(errorData.message || "Error fetching user data");
     }
   } catch (error) {
     console.error("Network error:", error); // Log network errors
     setError("Network error");
   } finally {
     setLoading(false);
   }
 }, []);

  useEffect(() => {
    fetchUser(); // Call the fetchUser  function on mount
  }, [fetchUser]);

  return { user, loading, error, fetchUser }; // Return fetchUser  function
};

export default useFetchUser;
