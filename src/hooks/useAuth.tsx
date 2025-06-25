import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "./apiService";

type User = {
  id: number;
  name: string;
  email: string;
};

// The example of using apiService in a component
// import React, { useEffect, useState } from "react";
// import api from "../hooks/useAuth"; // Adjust the path if necessary

// const ExampleComponent = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get("/api/example-endpoint");
//         setData(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   return <div>{JSON.stringify(data)}</div>;
// };

// export default ExampleComponent;

const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setLoading(false);
      setShouldRedirect(true);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/user");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Cookies.remove("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);

  return { user, loading, shouldRedirect };
};

export default useAuth;
