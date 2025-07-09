"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDeadline, submitLogEntry } from "@/services/logbookService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { Calendar, ImagePlus, Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/context/userContext";

export default function NewLogPage() {
  const router = useRouter();
  const [weekNumber, setWeekNumber] = useState<number | "">("");
  const [deadline, setDeadline] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    async function fetchDeadline() {
      try {
        const res = await getDeadline(Number(weekNumber) || 1);
        setDeadline(res.deadline);
      } catch (error) {
        console.error(error);
        showErrorToast("Failed to fetch deadline.");
      }
    }

    if (weekNumber) fetchDeadline();
  }, [weekNumber]);

  const weeks = user?.totalWeeks || 24;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (images.length + newImages.length > 3) {
        showErrorToast("You can only upload a maximum of 3 images.");
        return;
      }
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (weekNumber === "") {
      showErrorToast("Please select a week number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLogEntry({
        weekNumber,
        reportContent,
        images,
      });

      showSuccessToast("Log entry submitted successfully!");
      router.push(`/dashboard`);
    } catch (error) {
      showErrorToast(
        error instanceof Error
          ? error?.response?.data?.message || error.message
          : "Failed to submit log."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-mcpherson-purple-50 to-mcpherson-blue-50">
      <div className="container px-4 py-6 sm:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-mcpherson-purple-800">
            New Log Entry
          </h1>
          <p className="flex items-center gap-2 text-mcpherson-red-600 text-sm mt-2">
            <Calendar className="h-4 w-4" />
            Deadline: {new Date(deadline).toLocaleDateString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Weekly Log Entry */}
          <Card className="shadow-md border-mcpherson-purple-100">
            <CardHeader className="bg-mcpherson-purple-50 rounded-t-md">
              <CardTitle className="text-mcpherson-purple-800">
                Weekly Activities
              </CardTitle>
              <CardDescription className="text-mcpherson-purple-600">
                Document your tasks, learnings, and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <Label htmlFor="week-number" className="text-sm font-medium">
                Select Week
              </Label>
              <select
                id="week-number"
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full border border-mcpherson-purple-200 rounded-md p-2 focus:ring-mcpherson-purple-500"
                required
              >
                <option value="">Select Week</option>
                {Array.from({ length: weeks }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Week {i + 1}
                  </option>
                ))}
              </select>

              <Label htmlFor="report-content" className="text-sm font-medium">
                Log Content
              </Label>
              <Textarea
                id="report-content"
                placeholder="Describe your activities, learnings, challenges, and achievements..."
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                className="min-h-[200px]"
                required
              />
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card className="shadow-md border-mcpherson-blue-100">
            <CardHeader className="bg-mcpherson-blue-50 rounded-t-md">
              <CardTitle className="text-mcpherson-blue-800">
                Images & Attachments
              </CardTitle>
              <CardDescription className="text-mcpherson-blue-600">
                Add up to 3 images of your work
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      width={300}
                      height={200}
                      className="h-[200px] w-full object-cover rounded-md border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6"
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <Input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-mcpherson-purple-300 px-4 py-3 hover:bg-mcpherson-purple-50"
                  >
                    <ImagePlus className="h-5 w-5 text-mcpherson-purple-500" />
                    <span className="text-sm text-mcpherson-purple-700">
                      Add Images
                    </span>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-mcpherson-blue-600 hover:bg-mcpherson-blue-700 text-white flex items-center gap-2 px-6 py-2 rounded-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Submit Log
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
