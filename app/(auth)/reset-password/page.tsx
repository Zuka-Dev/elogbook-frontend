"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/services/authService";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || ""; // Get email from params

  const [step, setStep] = useState(1); // Track step (1: OTP, 2: New Password)
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle OTP submission
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      showErrorToast("OTP must be 6 digits.");
      return;
    }
    setStep(2); // Move to password reset step
  };

  // Handle Password Reset
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showErrorToast("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword({ email, otp, newPassword });
      showSuccessToast(data.message);
      router.push("/login"); // Redirect after successful reset
    } catch (err: any) {
      showErrorToast(err.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {step === 1 ? "Enter OTP" : "Reset Password"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Enter the 6-digit OTP sent to your email."
              : "Enter a new password for your account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            // OTP Input Form
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="flex justify-between space-x-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 border rounded-lg text-center text-xl"
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newOtp = otp.split("");
                      newOtp[index] = value;
                      setOtp(newOtp.join(""));
                      // Move focus to the next input
                      if (value && e.target.nextSibling) {
                        (e.target.nextSibling as HTMLInputElement).focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
                        ((e.target as HTMLInputElement).previousSibling as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-black border border-black border-solid rounded-md text-white py-2 hover:bg-white hover:text-black disabled:opacity-50"
                disabled={loading}
              >
                Next
              </button>
            </form>
          ) : (
            // New Password Form
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-2 border rounded-lg"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border rounded-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-black border border-black border-solid rounded-md text-white py-2 hover:bg-white hover:text-black disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
