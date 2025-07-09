"use client";

import { useEffect, useState } from "react";
import { getStudentLogs } from "@/services/logbookService";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ChevronRight, FileText, PenLineIcon } from "lucide-react";
import { useUser } from "@/context/userContext";
import EnrollmentModal from "@/components/ui/enrollmentCard";
import { showErrorToast } from "@/utils/toast";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getStudentLogs();
        setLogs(data);
      } catch (error) {
        showErrorToast(
          error.response?.data?.message || "An unknown error occurred."
        );
      } finally {
        setLoadingLogs(false);
      }
    };

    if (!loading) {
      if (user?.supervisorId) {
        fetchLogs();
      } else {
        // Not enrolled, but logs loading is done.
        setLoadingLogs(false);
      }
    }
  }, [user, loading]);

  if (loading || (loadingLogs && user?.supervisorId !== null)) {
    return (
      <p className="text-center mt-8 text-mcpherson-purple-700">
        Loading dashboard...
      </p>
    );
  }
  console.log("User data:", user?.supervisorId);
  if (user?.supervisorId == null) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-mcpherson-purple-50 to-mcpherson-blue-50">
        <Card className="w-[400px] p-6 text-center shadow-xl border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-mcpherson-purple-800">
              Enroll with your Supervisor
            </CardTitle>
            <CardDescription>
              Enter your enrollment key to link with a supervisor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-mcpherson-purple-600 text-white hover:bg-mcpherson-purple-700 flex items-center justify-center gap-2"
              onClick={() => setShowEnrollModal(true)}
            >
              <PenLineIcon className="h-4 w-4" />
              Enroll Now
            </Button>
          </CardContent>
        </Card>

        {showEnrollModal && (
          <EnrollmentModal onClose={() => setShowEnrollModal(false)} />
        )}
      </div>
    );
  }

  const totalWeeks = user?.totalWeeks || 24;
  const completedWeeks = logs.length;
  const progress = (completedWeeks / totalWeeks) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-mcpherson-purple-50 to-mcpherson-blue-50">
      <div className="container px-4 py-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-mcpherson-purple-800">
              Student Dashboard
            </h1>
            <p className="text-mcpherson-purple-600">
              Track your internship progress and weekly logs
            </p>
          </div>
          <Link href="/dashboard/log/new">
            <Button className="bg-mcpherson-blue-600 hover:bg-mcpherson-blue-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              New Log Entry
            </Button>
          </Link>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-white border border-mcpherson-purple-200 shadow-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-mcpherson-purple-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="data-[state=active]:bg-mcpherson-blue-600 data-[state=active]:text-white"
            >
              Weekly Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="shadow-md border-mcpherson-purple-100">
              <CardHeader className="bg-mcpherson-purple-50 rounded-t-md">
                <CardTitle className="text-mcpherson-purple-800 text-sm font-medium">
                  Internship Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-mcpherson-purple-900">
                  {completedWeeks} of {totalWeeks} weeks
                </div>
                <Progress value={progress} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round(progress)}% complete
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="shadow-md border-mcpherson-blue-100">
              <CardHeader className="bg-mcpherson-blue-50 rounded-t-md">
                <CardTitle className="text-mcpherson-blue-800">
                  Weekly Logs
                </CardTitle>
                <CardDescription>
                  All your internship log entries
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {logs.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No logs available yet.
                    </p>
                  ) : (
                    logs.map((log: any) => (
                      <Link key={log.id} href={`/dashboard/log/${log.id}`}>
                        <div className="flex items-center justify-between p-3 rounded-md hover:bg-mcpherson-purple-50 border border-gray-200 transition">
                          <div className="flex items-center gap-4">
                            <BookOpen className="h-4 w-4 text-mcpherson-purple-700" />
                            <div>
                              <h3 className="font-medium text-sm">
                                Week {log.weekNumber}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {log.reportContent.substring(0, 50)}...
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-mcpherson-purple-400" />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
