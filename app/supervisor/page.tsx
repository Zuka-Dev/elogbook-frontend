"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/userContext";
import {
  getSupervisorStudents,
  getPendingLogs,
  getReviewedLogs,
} from "@/services/supervisorService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, User } from "lucide-react";
import { showErrorToast } from "@/utils/toast";

export default function SupervisorDashboardPage() {
  const { user, loading } = useUser();
  const [students, setStudents] = useState<any[]>([]);
  const [pendingLogs, setPendingLogs] = useState<any[]>([]);
  const [reviewedLogs, setReviewedLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [loading]);

  const fetchData = async () => {
    try {
      const studentsData = await getSupervisorStudents();
      const pendingLogsData = await getPendingLogs();
      const reviewedLogsData = await getReviewedLogs();

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setPendingLogs(Array.isArray(pendingLogsData) ? pendingLogsData : []);
      setReviewedLogs(Array.isArray(reviewedLogsData) ? reviewedLogsData : []);
    } catch (error) {
      showErrorToast(
        error instanceof Error
          ? `Failed to fetch supervisor data. - ${error.message}`
          : "Failed to fetch supervisor data due to an unknown error."
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-mcpherson-purple-50 to-mcpherson-blue-50">
      <div className="container px-4 py-6 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-mcpherson-purple-800">
              Supervisor Dashboard
            </h1>
            <p className="text-mcpherson-purple-600">
              Manage and review student internship logs
            </p>
          </div>
          <div className="relative mt-4 md:mt-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-mcpherson-purple-400" />
            <Input
              type="search"
              placeholder="Search students or logs..."
              className="w-full md:w-[260px] pl-10 border-mcpherson-purple-200 focus:border-mcpherson-purple-500"
            />
          </div>
        </div>

        {/* Enrollment Key */}
        <Card className="mb-6 border-mcpherson-purple-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-mcpherson-purple-50 to-mcpherson-purple-100">
            <CardTitle className="text-mcpherson-purple-800">
              Enrollment Key
            </CardTitle>
            <CardDescription className="text-mcpherson-purple-600">
              Share this key with students to enroll under you
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-gradient-to-r from-mcpherson-purple-50 to-mcpherson-purple-100">
            <div className="text-2xl font-bold text-center text-mcpherson-purple-900 py-4 bg-transparent">
              {user?.enrollmentKey || "Loading..."}
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-mcpherson-blue-500 to-mcpherson-blue-600 text-white shadow-lg border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{students.length}</div>
              <p className="text-xs opacity-80 mt-2">
                Students under your supervision
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-mcpherson-yellow-500 to-mcpherson-yellow-600 text-white shadow-lg border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Pending Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingLogs.length}</div>
              <p className="text-xs opacity-80 mt-2">
                Logs awaiting your feedback
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-mcpherson-red-500 to-mcpherson-red-600 text-white shadow-lg border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Completed Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reviewedLogs.length}</div>
              <p className="text-xs opacity-80 mt-2">
                Logs you've already reviewed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Students + Logs */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Students */}
          <Card className="border-mcpherson-blue-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-mcpherson-blue-50 to-mcpherson-blue-100">
              <CardTitle className="text-mcpherson-blue-800">
                Students
              </CardTitle>
              <CardDescription className="text-mcpherson-blue-600">
                Students under your supervision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.map((student) => (
                  <Link
                    key={student.id}
                    href={`/supervisor/student/${student.id}`}
                  >
                    <div className="flex items-center justify-between p-3 rounded-md hover:bg-mcpherson-blue-50 border">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-mcpherson-blue-600" />
                        <div>
                          <h3 className="font-medium text-sm">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {student.matricNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Log Tabs */}
          <Card className="lg:col-span-2 border-mcpherson-purple-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-mcpherson-purple-50 to-mcpherson-purple-100">
              <CardTitle className="text-mcpherson-purple-800">
                Log Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="pending"
                    className="data-[state=active]:bg-mcpherson-yellow-500 data-[state=active]:text-white"
                  >
                    Pending Review
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviewed"
                    className="data-[state=active]:bg-mcpherson-red-500 data-[state=active]:text-white"
                  >
                    Reviewed
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="pt-4">
                  {pendingLogs.length === 0 ? (
                    <p>No pending logs available.</p>
                  ) : (
                    pendingLogs.map((log) => (
                      <Link key={log.id} href={`/supervisor/log/${log.id}`}>
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-mcpherson-yellow-50">
                          <h3 className="font-medium">
                            Week {log.weekNumber} - {log.student.firstName}{" "}
                            {log.student.lastName}
                          </h3>
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </div>
                      </Link>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="reviewed" className="pt-4">
                  {reviewedLogs.map((log) => (
                    <Link key={log.id} href={`/supervisor/log/${log.id}`}>
                      <div className="flex items-center justify-between p-3 border rounded-md hover:bg-mcpherson-red-50">
                        <h3 className="font-medium">
                          Week {log.weekNumber} - {log.student.firstName}{" "}
                          {log.student.lastName}
                        </h3>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </Link>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
