'use client'


// app/hooks/useFetchUser .ts

import { useEffect, useState } from "react";

// Define the User interface
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const useFetchUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Define the fetchUser  function
    const fetchUser = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:8000/user"); // Replace with your user data endpoint
        if (response.ok) {
          const data: User = await response.json(); // Type the response
          setUser(data);
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

    fetchUser(); // Call the fetchUser  function
  }, []);

  return { user, loading, error };
};

export default useFetchUser;
