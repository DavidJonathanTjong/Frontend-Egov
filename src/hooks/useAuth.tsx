import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        // Decode the token to check its validity
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          throw new Error("Token expired");
        }

        // Checking user data from the backend
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Invalid token:", error);
        Cookies.remove("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  return { user, loading };
};

export default useAuth;
