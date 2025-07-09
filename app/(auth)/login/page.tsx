"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/services/authService";
import { LoginRequest } from "@/types/auth";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const LoginPage = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(credentials);
      localStorage.setItem("token", data.access_token);
      showSuccessToast("Login successful! Redirecting...");

      if (data.role === "student") router.push("/dashboard");
      else if (data.role === "supervisor") router.push("/supervisor");
      else router.push("/admin/dashboard");
    } catch (err: any) {
      showErrorToast(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-mcpherson-purple-50 to-mcpherson-blue-50 px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2 text-mcpherson-purple-700">
            <GraduationCap className="w-6 h-6" />
            <CardTitle className="text-2xl font-bold">mySIWES Login</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-mcpherson-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mcpherson-purple-400"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-mcpherson-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mcpherson-purple-400"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
            <Button
              type="submit"
              className="w-full bg-mcpherson-purple-600 hover:bg-mcpherson-purple-700 text-white shadow-md"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 text-sm text-center">
          <Link
            href="/forgot-password"
            className="text-mcpherson-blue-600 underline"
          >
            Forgot Password?
          </Link>
          <div>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-mcpherson-purple-600 underline font-medium"
            >
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
