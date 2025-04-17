import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import apiService from "@/apiService";

interface User {
  iss: string;
  iat: number;
  exp: number;
  nbf: number;
  jti: string;
  sub: string;
  prv: string;
}

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

    const verifyToken = async () => {
      try {
        // Decode the token to check its validity
        const decodedToken = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        if (!decodedToken.exp || decodedToken.exp < currentTime) {
          throw new Error("Token expired");
        }
        const response = await apiService.get<User>("/user");
        if (response.status === 401) {
          throw new Error("Token expired");
        } else {
          setShouldRedirect(false);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        Cookies.remove("token");
        setShouldRedirect(true);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);

  return { user, loading, shouldRedirect };
};

export default useAuth;
