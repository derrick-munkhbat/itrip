"use client";

import { useEffect, useState } from "react";

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

  const fetchUser = async (): Promise<void> => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage

    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (response.ok) {
        const data: User = await response.json(); // Type the response
        console.log("Fetched user data:", data); // Log the fetched data
        setUser(data); // Update to set the user data from the response
      } else if (response.status === 401) {
        setError("Unauthorized: Please log in again.");
      } else {
        setError("Error fetching user data");
        console.error("Error fetching user data:", response.statusText);
      }
    } catch (error) {
      setError("Network error");
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(); // Call the fetchUser  function on mount
  }, []);

  return { user, loading, error, refetch: fetchUser }; // Return refetch function
};

export default useFetchUser;
