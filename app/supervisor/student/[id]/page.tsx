"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getSupervisorStudent } from "@/services/supervisorService";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { Progress } from "@/components/ui/progress";

export default function StudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getSupervisorStudent(Number(id));
        if (data.message) {
          showSuccessToast(data.message);
        } else {
          setStudent(data);
        }
      } catch (err) {
        showErrorToast("Failed to fetch student details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading student details...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-muted-foreground">No student details available.</p>
      </div>
    );
  }

  const completed = student.logbookEntries?.length || 0;
  const total = student.totalWeeks || 24;
  const progress = (completed / total) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container px-4 py-6 sm:px-8">
        <Card className="shadow-md border border-mcpherson-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-mcpherson-purple-900">
              {student.firstName} {student.lastName}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {student.email}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-sm sm:text-base">
            <div>
              <strong className="text-mcpherson-purple-700">
                Matric Number:
              </strong>{" "}
              {student.matricNumber}
            </div>
            <div>
              <strong className="text-mcpherson-purple-700">
                Organisation:
              </strong>{" "}
              {student.organisation}
            </div>
            <div>
              <strong className="text-mcpherson-purple-700">
                Total Weeks:
              </strong>{" "}
              {total}
            </div>

            <div className="pt-2">
              <div className="text-lg font-semibold text-mcpherson-purple-900">
                {completed} of {total} weeks logged
              </div>
              <Progress value={progress} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(progress)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
