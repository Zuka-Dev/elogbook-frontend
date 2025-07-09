"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUser } from "@/services/authService";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "student" | "supervisor" | "admin";
  matricNumber?: string;
  supervisorId?: number;
  totalWeeks?: number;
  organisation?: string;
  enrollmentKey?: string;
}

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Define public/auth pages that should be accessible without being logged in
  const authPages = [
    "/",
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
  ];

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      // If no token and user is NOT on an auth page, redirect to login
      if (!token) {
        if (!authPages.includes(pathname)) {
          router.push("/login");
        }
        setLoading(false);
        return;
      }

      try {
        const decoded: { exp: number } = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          logout();
          return;
        }

        await refreshUser();
      } catch (error) {
        console.error("Token validation error:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [pathname]); // Run this effect when the pathname changes

  const refreshUser = async () => {
    try {
      const userData = await getUser();
      if (!userData) throw new Error("User data is null or undefined");
      setUser(userData);
      // console.log("User refreshed:", userData);
    } catch (error) {
      console.error("Error refreshing user:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
