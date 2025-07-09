"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { registerUser } from "@/services/authService";
import {
  StudentRegisterRequest,
  SupervisorRegisterRequest,
} from "@/types/auth";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap } from "lucide-react";

const Register = () => {
  const [role, setRole] = useState<"student" | "supervisor">("student");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const [student, setStudent] = useState<StudentRegisterRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student",
    matricNumber: "",
    supervisorId: undefined,
    totalWeeks: 24,
    organisation: "",
  });

  const [supervisor, setSupervisor] = useState<SupervisorRegisterRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "supervisor",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isStudent: boolean
  ) => {
    if (isStudent) {
      setStudent({ ...student, [e.target.name]: e.target.value });
    } else {
      setSupervisor({ ...supervisor, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (role === "student") {
      if (student.password !== confirmPassword) {
        showErrorToast("Passwords do not match");
        setLoading(false);
        return;
      }
      try {
        await registerUser(student);
        showSuccessToast("Student registered successfully! Redirecting...");
        router.push("/login");
      } catch (err: any) {
        showErrorToast(err.message || "Registration failed");
      }
    } else {
      if (supervisor.password !== confirmPassword) {
        showErrorToast("Passwords do not match");
        setLoading(false);
        return;
      }
      try {
        await registerUser(supervisor);
        showSuccessToast("Supervisor registered successfully! Redirecting...");
        router.push("/login");
      } catch (err: any) {
        showErrorToast(err.message || "Registration failed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-mcpherson-purple-50 to-mcpherson-blue-50 px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2 text-mcpherson-purple-700">
            <GraduationCap className="w-6 h-6" />
            <CardTitle className="text-2xl font-bold">
              Create an Account
            </CardTitle>
          </div>
          <CardDescription>Sign up to access your logbook</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="student"
            className="w-full"
            onValueChange={(val) => setRole(val as "student" | "supervisor")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4 border border-mcpherson-purple-300 bg-white shadow-sm">
              <TabsTrigger
                value="student"
                className="data-[state=active]:bg-mcpherson-purple-600 data-[state=active]:text-white"
              >
                Student
              </TabsTrigger>
              <TabsTrigger
                value="supervisor"
                className="data-[state=active]:bg-mcpherson-blue-600 data-[state=active]:text-white"
              >
                Supervisor
              </TabsTrigger>
            </TabsList>

            {/* STUDENT REGISTRATION FORM */}
            <TabsContent value="student">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={student.firstName}
                      onChange={(e) => handleChange(e, true)}
                      className="input-field"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={student.lastName}
                      onChange={(e) => handleChange(e, true)}
                      className="input-field"
                      required
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={student.email}
                    onChange={(e) => handleChange(e, true)}
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    name="matricNumber"
                    placeholder="Matric Number"
                    value={student.matricNumber}
                    onChange={(e) => handleChange(e, true)}
                    className="input-field"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={student.password}
                    onChange={(e) => handleChange(e, true)}
                    className="input-field"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    required
                  />
                  <input
                    type="number"
                    name="totalWeeks"
                    placeholder="Total Weeks"
                    value={student.totalWeeks}
                    onChange={(e) => handleChange(e, true)}
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    name="organisation"
                    placeholder="Organisation"
                    value={student.organisation}
                    onChange={(e) => handleChange(e, true)}
                    className="input-field"
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full bg-mcpherson-purple-600 hover:bg-mcpherson-purple-700 text-white"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* SUPERVISOR REGISTRATION FORM */}
            <TabsContent value="supervisor">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={supervisor.firstName}
                      onChange={(e) => handleChange(e, false)}
                      className="input-field"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={supervisor.lastName}
                      onChange={(e) => handleChange(e, false)}
                      className="input-field"
                      required
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={supervisor.email}
                    onChange={(e) => handleChange(e, false)}
                    className="input-field"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={supervisor.password}
                    onChange={(e) => handleChange(e, false)}
                    className="input-field"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-mcpherson-blue-600 hover:bg-mcpherson-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-mcpherson-purple-600 underline ml-1"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
