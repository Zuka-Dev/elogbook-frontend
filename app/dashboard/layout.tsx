"use client";
import { useUser } from "@/context/userContext";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser, loading } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-mcpherson-purple-600 to-mcpherson-blue-600 text-white shadow-lg sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">McPherson University</h1>
              <p className="text-xs text-white/80">
                Internship Management System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <User className="h-4 w-4 mr-2" />
              {user?.firstName + " " + user?.lastName}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/20 bg-transparent"
              onClick={() => {
                // 🔹 Logout Function
                localStorage.removeItem("token");
                setUser(null);
                router.push("/login");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container px-4 py-6 sm:px-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
