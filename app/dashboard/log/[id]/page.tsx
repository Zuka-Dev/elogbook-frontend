"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getDeadline, getLogById } from "@/services/logbookService";
import { LogbookEntry } from "@/types/logbook";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Download, FileText, ThumbsUp } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function LogDetailPage() {
  const params = useParams();
  const entryId = Number(params.id);

  const [log, setLog] = useState<LogbookEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const data = await getLogById(entryId);
        setLog(data);
      } catch (error) {
        setError("Failed to fetch log entry.");
        showErrorToast(
          error.response?.data?.message || "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    };
    async function fetchDeadline() {
      try {
        const res = await getDeadline(Number(log?.weekNumber));
        setDeadline(res.deadline);
      } catch (error) {
        console.error(error);
        showErrorToast("Failed to fetch deadline.");
      }
    }

    fetchDeadline();
    fetchLog();
  }, [entryId]);

  const exportToPDF = async () => {
    showSuccessToast("Exporting...");

    try {
      const doc = new jsPDF();
      const logElement = document.getElementById("log-content");

      if (!logElement) {
        showErrorToast("Log content not found!");
        return;
      }

      const canvas = await html2canvas(logElement);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 10, 180, 0);
      doc.save(`Logbook_Week_${log.weekNumber}.pdf`);

      showSuccessToast("File ready for download");
    } catch (error) {
      showErrorToast("Export failed");
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading log entry...</div>;
  if (error) return null;
  if (!log) return <div className="text-center py-10">No log entry found.</div>;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-mcpherson-purple-50 to-mcpherson-blue-50">
      <div className="container px-4 py-6 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-mcpherson-purple-800">
              Week {log.weekNumber}
            </h1>
            <p className="text-mcpherson-blue-600 flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(log.submittedAt).toLocaleDateString()}
            </p>
            <p className="text-mcpherson-red-600 flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              Deadline: {new Date(deadline).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              className="bg-white border border-black text-black hover:bg-black hover:text-white"
              onClick={exportToPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Log Content */}
            <Card className="border-mcpherson-purple-200 shadow-md">
              <CardHeader className="bg-mcpherson-purple-50 rounded-t-md">
                <CardTitle className="text-mcpherson-purple-800">
                  Weekly Activities
                </CardTitle>
                <CardDescription className="text-mcpherson-purple-600">
                  Details of tasks and learnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p id="log-content" className="text-sm text-muted-foreground">
                  {log.reportContent}
                </p>
              </CardContent>
            </Card>

            {/* Log Images */}
            {log.images.length > 0 && (
              <Card className="border-mcpherson-blue-200 shadow-md">
                <CardHeader className="bg-mcpherson-blue-50 rounded-t-md">
                  <CardTitle className="text-mcpherson-blue-800">
                    Images & Attachments
                  </CardTitle>
                  <CardDescription className="text-mcpherson-blue-600">
                    Visual documentation of your work
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2 pt-4">
                  {log.images.map((image) => (
                    <div key={image.id}>
                      <Image
                        src={`http://localhost:5050/api/logbook/image/${image.id}`}
                        alt={image.caption}
                        width={500}
                        height={300}
                        className="rounded-md border hover:scale-105 transition-all"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {image.caption}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="border-mcpherson-yellow-200 shadow-sm">
              <CardHeader className="bg-mcpherson-yellow-50">
                <CardTitle className="text-mcpherson-yellow-800">
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      log.status === "Reviewed"
                        ? "bg-mcpherson-green-600"
                        : "bg-mcpherson-orange-500"
                    }`}
                  />
                  <span className="capitalize text-sm">{log.status}</span>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            {log.feedback ? (
              <Card className="border-mcpherson-green-200 shadow-sm">
                <CardHeader className="bg-mcpherson-green-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-mcpherson-green-800">
                      Supervisor Feedback
                    </CardTitle>
                    <ThumbsUp className="h-4 w-4 text-mcpherson-green-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm font-medium bg-mcpherson-green-100 text-mcpherson-green-800 px-3 py-2 rounded">
                    {log.feedback.remark}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {log.feedback.comment}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-mcpherson-purple-200">
                <CardHeader className="bg-mcpherson-purple-50">
                  <CardTitle className="text-mcpherson-purple-800">
                    Pending Feedback
                  </CardTitle>
                  <CardDescription className="text-mcpherson-purple-600">
                    Supervisor has not provided remarks yet
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Navigation */}
            <Card className="border-mcpherson-red-200">
              <CardHeader className="bg-mcpherson-red-50">
                <CardTitle className="text-mcpherson-red-800">
                  Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="w-full border border-black text-black hover:bg-black hover:text-white"
                    size="sm"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    All Logs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
