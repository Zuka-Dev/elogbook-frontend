"use client";

import Link from "next/link";
import {
  GraduationCap,
  NotebookPen,
  ImageIcon,
  MessageSquareQuote,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-mcpherson-purple-50 to-mcpherson-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-mcpherson-purple-600 to-mcpherson-blue-600 text-white shadow-lg sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-bold">McPherson University</h1>
              <p className="text-xs text-white/80">
                Internship Management System
              </p>
            </div>{" "}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/20 bg-transparent"
              >
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-2 items-center">
            {/* Left Side: Hero Text */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-mcpherson-purple-900">
                Seamlessly Document Your Internship Journey
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Log weekly activities, upload media, and receive insightful
                feedback — all in one place designed for students and
                supervisors.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-mcpherson-purple-600 hover:bg-mcpherson-purple-700 text-white shadow-md"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-mcpherson-purple-600 text-mcpherson-purple-700 hover:bg-mcpherson-purple-600 hover:text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side: Features Card */}
            <Card className="w-full max-w-md shadow-xl border-mcpherson-purple-100 bg-white/70 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-mcpherson-purple-700">
                  Why mySIWES?
                </CardTitle>
                <CardDescription className="text-sm text-mcpherson-purple-600">
                  All the tools you need to succeed in your industrial training.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-mcpherson-purple-100 text-mcpherson-purple-600 rounded-full flex items-center justify-center">
                    <NotebookPen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Weekly Logs</h3>
                    <p className="text-sm text-muted-foreground">
                      Stay consistent with 24 weekly entries and progress
                      tracking.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-mcpherson-blue-100 text-mcpherson-blue-600 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Visual Proof</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload project images or workplace visuals to support your
                      entries.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-mcpherson-yellow-100 text-mcpherson-yellow-600 rounded-full flex items-center justify-center">
                    <MessageSquareQuote className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Supervisor Feedback</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly reviews, ratings, and personalized remarks
                      from your supervisor.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 py-6 mt-12 shadow-inner">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} McPherson Internship Logbook. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
