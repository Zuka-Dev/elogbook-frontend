export interface LogbookImage {
  id: number;
  caption: string;
}

export interface Feedback {
  remark: "Excellent" | "Satisfactory" | "Poor";
  comment: string;
  createdAt: string;
}

export interface LogbookEntry {
  id: number;
  weekNumber: number;
  reportContent: string;
  status: "Pending" | "Late" | "Reviewed";
  submittedAt: string;
  reviewedAt?: string | null;
  images: LogbookImage[];
  student: Student;
  feedback?: Feedback | null;
}
export interface LogSubmissionRequest {
  weekNumber: number;
  reportContent: string;
  images: File[];
}
export interface Student {
  firstName: string;
  lastName: string;
  email: string;
  matricNumber?: string;
}

export interface AiAnalysisResult {
  aiScore: string;
}
