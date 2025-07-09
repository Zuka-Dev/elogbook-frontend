"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Download, Loader2, Brain, Send } from "lucide-react";
import {
  getLogById,
  analyzeReportAI,
  submitFeedback,
} from "@/services/logbookService";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { LogbookEntry, AiAnalysisResult } from "@/types/logbook";
import { Textarea } from "@/components/ui/textarea";

export default function SupervisorLogReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [log, setLog] = useState<LogbookEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiScore, setAiScore] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [remark, setRemark] = useState<
    "Excellent" | "Satisfactory" | "Poor" | ""
  >("");

  const exportRef = useRef<HTMLDivElement>(null);
  const isReviewed = log?.status === "Reviewed";

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const data: LogbookEntry = await getLogById(Number(id));
        setLog(data);
      } catch (error) {
        showErrorToast("Failed to load log entry.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLog();
  }, [id]);

  const handleSubmitFeedback = async () => {
    if (!remark || !feedback.trim()) {
      showErrorToast("Please select a remark and enter your feedback.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback(Number(id), remark, feedback);
      showSuccessToast("Feedback submitted successfully!");
      router.push("/supervisor");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "An unknown error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnalyzeAI = async () => {
    setIsAnalyzing(true);
    try {
      const result: AiAnalysisResult = await analyzeReportAI(Number(id));
      setAiScore(result.aiScore);
      showSuccessToast(
        `AI Analysis Complete: ${result.aiScore}% AI-generated.`
      );
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "An unknown error occurred."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportPDF = async () => {
    const element = exportRef.current;
    if (!element) return;

    await new Promise((resolve) => setTimeout(resolve, 300));
    const canvas = await html2canvas(element, { scale: 2 });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Logbook_Week_${log?.weekNumber}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-mcpherson-blue-50 to-mcpherson-purple-50">
      {/* Hidden PDF Content */}
      <div className="absolute -top-[10000px] -left-[10000px] opacity-0 pointer-events-none">
        <div ref={exportRef} id="pdf-export-content" className="p-6">
          <h1 className="text-xl font-bold mb-2">
            Logbook Entry - Week {log?.weekNumber}
          </h1>
          <p>
            <strong>Student:</strong> {log?.student.firstName}{" "}
            {log?.student.lastName}
          </p>
          <p>
            <strong>Submitted:</strong>{" "}
            {new Date(log?.submittedAt || "").toLocaleDateString()}
          </p>
          <h2 className="text-lg font-semibold mt-4 mb-2">Weekly Activities</h2>
          <p className="whitespace-pre-wrap">{log?.reportContent}</p>

          {aiScore && (
            <>
              <h2 className="text-lg font-semibold mt-4 mb-2">AI Analysis</h2>
              <p>{aiScore}% AI-generated</p>
            </>
          )}

          {log?.feedback && (
            <>
              <h2 className="text-lg font-semibold mt-4 mb-2">
                Supervisor Feedback
              </h2>
              <p>
                <strong>Remark:</strong> {log.feedback.remark}
              </p>
              <p>
                <strong>Comment:</strong> {log.feedback.comment}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(log.feedback.createdAt).toLocaleDateString()}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="container px-4 py-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-mcpherson-purple-900">
              Log Review
            </h1>
            <p className="text-mcpherson-purple-600 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Week {log?.weekNumber} - {log?.student.firstName}{" "}
              {log?.student.lastName}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="border-mcpherson-purple-300 text-mcpherson-purple-700 hover:bg-mcpherson-purple-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-mcpherson-purple-200 shadow-md">
              <CardHeader>
                <CardTitle>Weekly Activities</CardTitle>
                <CardDescription>
                  Submitted on{" "}
                  {new Date(log?.submittedAt || "").toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {log?.reportContent.split("\n\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-mcpherson-blue-200 shadow-md">
              <CardHeader>
                <CardTitle>Images & Attachments</CardTitle>
                <CardDescription>
                  Visual documentation of student work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {log?.images.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No images attached
                    </p>
                  ) : (
                    log?.images.map((image) => (
                      <div key={image.id} className="space-y-2">
                        <Image
                          src={`http://localhost:5050/api/logbook/image/${image.id}`}
                          alt={image.caption}
                          width={500}
                          height={300}
                          className="rounded-md border object-cover"
                        />
                        <p className="text-sm text-muted-foreground">
                          {image.caption}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-mcpherson-yellow-200 shadow-md">
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {aiScore ? (
                  <p className="text-lg font-semibold text-mcpherson-yellow-800">
                    {aiScore}% AI-generated
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click below to analyze this report.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleAnalyzeAI}
                  disabled={isAnalyzing}
                  className="border-mcpherson-yellow-300 text-mcpherson-yellow-700 bg-mcpherson-yellow-200 hover:bg-mcpherson-yellow-50"
                >
                  {isAnalyzing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="mr-2 h-4 w-4" />
                  )}
                  Run AI Analysis
                </Button>
              </CardFooter>
            </Card>

            {isReviewed ? (
              <Card className="border-mcpherson-blue-200 shadow-md">
                <CardHeader>
                  <CardTitle>Supervisor Feedback</CardTitle>
                  <CardDescription>
                    Reviewed on{" "}
                    {new Date(
                      log.feedback?.createdAt || ""
                    ).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium bg-mcpherson-purple-100 p-2 rounded text-mcpherson-purple-800 w-fit">
                    {log.feedback?.remark}
                  </p>
                  <p className="text-muted-foreground mt-2">
                    {log.feedback?.comment}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-mcpherson-purple-200 shadow-md">
                <CardHeader>
                  <CardTitle>Provide Feedback</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <select
                    className="w-full p-2 border rounded-md focus:outline-none"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value as any)}
                  >
                    <option value="">Select Remark</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Satisfactory">Satisfactory</option>
                    <option value="Poor">Poor</option>
                  </select>
                  <Textarea
                    placeholder="Enter feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting}
                    className="border-mcpherson-purple-300 text-mcpherson-purple-700 bg-mcpherson-purple-200 hover:bg-mcpherson-purple-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Submit Feedback
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
