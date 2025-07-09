"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Building2,
  CheckCircle,
  Clock,
  FileCheck,
  FileText,
  GraduationCap,
  Search,
  Settings,
  TrendingUp,
  User,
  Users,
  UserCheck,
  AlertCircle,
  Calendar,
  Award,
  Target,
} from "lucide-react";

import {
  getAllStudents,
  getAllSupervisors,
  getAllEnrollments,
  getDashboardStats,
} from "@/services/adminService";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any | null>(null);
  type Student = {
    id: string;
    name: string;
    email: string;
    studentId: string;
    supervisor: string;
    company: string;
    progress: number;
    logsReviewed: number;
    logsSubmitted: number;
    status: string;
  };
  const [students, setStudents] = useState<Student[]>([]);
  type Supervisor = {
    id: string;
    name: string;
    email: string;
    company: string;
    studentsSupervised: number;
    logsReviewed: number;
    avgResponseTime: string;
    rating: number;
    status: string;
  };
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, studentData, supervisorData, enrollmentData] =
          await Promise.all([
            getDashboardStats(),
            getAllStudents(),
            getAllSupervisors(),
            getAllEnrollments(),
          ]);

        setStats(statsData);
        setStudents(studentData);
        setSupervisors(supervisorData);
        setEnrollments(enrollmentData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-mcpherson-purple-50 to-mcpherson-blue-50">
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
              Admin
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

      <div className="container px-4 py-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-mcpherson-purple-900">
              Admin Dashboard
            </h1>
            <p className="text-mcpherson-purple-600 mt-1">
              Comprehensive overview of internship program
            </p>
          </div>
          <div className="relative mt-4 md:mt-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-mcpherson-purple-400" />
            <Input
              type="search"
              placeholder="Search students, supervisors..."
              className="w-full md:w-[300px] pl-10 border-mcpherson-purple-200 focus:border-mcpherson-purple-500"
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-br from-mcpherson-purple-500 to-mcpherson-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">
                  Total Students
                </CardTitle>
                <Users className="h-5 w-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.totalStudents || 0}
              </div>
              <div className="flex items-center mt-2 text-xs opacity-80">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+12% from last semester</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-mcpherson-blue-500 to-mcpherson-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">
                  Supervisors
                </CardTitle>
                <UserCheck className="h-5 w-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalSupervisors}</div>
              <div className="flex items-center mt-2 text-xs opacity-80">
                <Building2 className="h-3 w-3 mr-1" />
                <span>From 18 companies</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-mcpherson-yellow-500 to-mcpherson-yellow-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">
                  Logs Submitted
                </CardTitle>
                <FileText className="h-5 w-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.totalLogsSubmitted}
              </div>
              <div className="flex items-center mt-2 text-xs opacity-80">
                <Clock className="h-3 w-3 mr-1" />
                <span>{stats.pendingReviews} pending review</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-mcpherson-red-500 to-mcpherson-red-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">
                  Completion Rate
                </CardTitle>
                <Award className="h-5 w-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">87%</div>
              <div className="flex items-center mt-2 text-xs opacity-80">
                <Target className="h-3 w-3 mr-1" />
                <span>{stats.logsReviewed} logs reviewed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-mcpherson-purple-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mcpherson-purple-700">
                Active Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-mcpherson-purple-900">
                {stats.activeEnrollments}
              </div>
              <div className="flex items-center mt-2 text-xs text-mcpherson-purple-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>{stats.completedInternships} completed this year</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-mcpherson-blue-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mcpherson-blue-700">
                Average Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-mcpherson-blue-900">
                54%
              </div>
              <div className="flex items-center mt-2 text-xs text-mcpherson-blue-600">
                <BarChart3 className="h-3 w-3 mr-1" />
                <span>Across all active internships</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-mcpherson-yellow-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mcpherson-yellow-700">
                Review Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-mcpherson-yellow-900">
                2.4 days
              </div>
              <div className="flex items-center mt-2 text-xs text-mcpherson-yellow-600">
                <Clock className="h-3 w-3 mr-1" />
                <span>Average supervisor response time</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-white border border-mcpherson-purple-200 shadow-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-mcpherson-purple-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-mcpherson-blue-500 data-[state=active]:text-white"
            >
              Students
            </TabsTrigger>
            <TabsTrigger
              value="supervisors"
              className="data-[state=active]:bg-mcpherson-yellow-600 data-[state=active]:text-white"
            >
              Supervisors
            </TabsTrigger>
            <TabsTrigger
              value="enrollments"
              className="data-[state=active]:bg-mcpherson-red-500 data-[state=active]:text-white"
            >
              Enrollments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-mcpherson-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-mcpherson-purple-50 to-mcpherson-purple-100">
                  <CardTitle className="text-mcpherson-purple-800">
                    Recent Activities
                  </CardTitle>
                  <CardDescription className="text-mcpherson-purple-600">
                    Latest system activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-mcpherson-green-100 rounded-full flex items-center justify-center">
                        <FileCheck className="h-5 w-5 text-mcpherson-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">New log submitted</p>
                        <p className="text-xs text-muted-foreground">
                          John Doe - Week 8 • 2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-mcpherson-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-mcpherson-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          New supervisor registered
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dr. Alex Johnson - TechCorp • 5 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-mcpherson-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-mcpherson-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Internship completed
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Sarah Johnson - 24 weeks • 1 day ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-mcpherson-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-mcpherson-blue-50 to-mcpherson-blue-100">
                  <CardTitle className="text-mcpherson-blue-800">
                    System Alerts
                  </CardTitle>
                  <CardDescription className="text-mcpherson-blue-600">
                    Items requiring attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-mcpherson-red-50 rounded-lg border border-mcpherson-red-200">
                      <AlertCircle className="h-5 w-5 text-mcpherson-red-600" />
                      <div>
                        <p className="font-medium text-sm text-mcpherson-red-800">
                          Overdue Reviews
                        </p>
                        <p className="text-xs text-mcpherson-red-600">
                          12 logs pending review for more than 5 days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-mcpherson-yellow-50 rounded-lg border border-mcpherson-yellow-200">
                      <Clock className="h-5 w-5 text-mcpherson-yellow-600" />
                      <div>
                        <p className="font-medium text-sm text-mcpherson-yellow-800">
                          Inactive Supervisors
                        </p>
                        <p className="text-xs text-mcpherson-yellow-600">
                          3 supervisors haven't logged in for 2 weeks
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-mcpherson-blue-50 rounded-lg border border-mcpherson-blue-200">
                      <Calendar className="h-5 w-5 text-mcpherson-blue-600" />
                      <div>
                        <p className="font-medium text-sm text-mcpherson-blue-800">
                          Upcoming Deadlines
                        </p>
                        <p className="text-xs text-mcpherson-blue-600">
                          8 internships ending this month
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card className="border-mcpherson-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-mcpherson-blue-50 to-mcpherson-blue-100">
                <CardTitle className="text-mcpherson-blue-800">
                  Student Management
                </CardTitle>
                <CardDescription className="text-mcpherson-blue-600">
                  All registered students and their progress
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Logs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {student.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {student.studentId}
                        </TableCell>
                        <TableCell>{student.supervisor}</TableCell>
                        <TableCell>{student.company}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-mcpherson-purple-500 to-mcpherson-blue-500 transition-all"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">
                              {student.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="text-mcpherson-green-600 font-medium">
                              {student.logsReviewed}
                            </span>
                            <span className="text-muted-foreground">
                              /{student.logsSubmitted}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              student.status === "completed"
                                ? "bg-mcpherson-green-500 hover:bg-mcpherson-green-600"
                                : "bg-mcpherson-blue-500 hover:bg-mcpherson-blue-600 text-white"
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-mcpherson-purple-300 text-mcpherson-purple-700 hover:bg-mcpherson-purple-50 bg-transparent"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supervisors">
            <Card className="border-mcpherson-yellow-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-mcpherson-yellow-50 to-mcpherson-yellow-100">
                <CardTitle className="text-mcpherson-yellow-800">
                  Supervisor Management
                </CardTitle>
                <CardDescription className="text-mcpherson-yellow-700">
                  All registered supervisors and their performance
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Logs Reviewed</TableHead>
                      <TableHead>Avg Response</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supervisors.map((supervisor) => (
                      <TableRow key={supervisor.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{supervisor.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {supervisor.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{supervisor.company}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-mcpherson-blue-300 text-mcpherson-blue-700"
                          >
                            {supervisor.studentsSupervised} students
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-mcpherson-green-600">
                          {supervisor.logsReviewed}
                        </TableCell>
                        <TableCell>{supervisor.avgResponseTime}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-mcpherson-yellow-600 font-medium">
                              {supervisor.rating}
                            </span>
                            <span className="text-mcpherson-yellow-500">★</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              supervisor.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              supervisor.status === "active"
                                ? "bg-mcpherson-green-500 hover:bg-mcpherson-green-600"
                                : "bg-gray-500 hover:bg-gray-600"
                            }
                          >
                            {supervisor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-mcpherson-yellow-300 text-mcpherson-yellow-700 hover:bg-mcpherson-yellow-50 bg-transparent"
                          >
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enrollments">
            <Card className="border-mcpherson-red-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-mcpherson-red-50 to-mcpherson-red-100">
                <CardTitle className="text-mcpherson-red-800">
                  Enrollment Management
                </CardTitle>
                <CardDescription className="text-mcpherson-red-600">
                  Student-supervisor assignments and internship tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">
                          {enrollment.student}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {enrollment.studentId}
                        </TableCell>
                        <TableCell>{enrollment.supervisor}</TableCell>
                        <TableCell>{enrollment.company}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {new Date(
                                enrollment.startDate
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              to{" "}
                              {new Date(
                                enrollment.endDate
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-mcpherson-red-500 to-mcpherson-yellow-500 transition-all"
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">
                              {enrollment.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              enrollment.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              enrollment.status === "completed"
                                ? "bg-mcpherson-green-500 hover:bg-mcpherson-green-600"
                                : "bg-mcpherson-orange-500 hover:bg-mcpherson-orange-600 text-white"
                            }
                          >
                            {enrollment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-mcpherson-red-300 text-mcpherson-red-700 hover:bg-mcpherson-red-50 bg-transparent"
                          >
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
