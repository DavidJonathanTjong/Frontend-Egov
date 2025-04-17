import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import api from "./apiService";

const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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
        Cookies.remove("refresh_token");
        toast.error("Your session has expired. Please log in again.", {
          duration: 5000,
          position: "top-center",
        });
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
