import axiosInstance from "./axiosInstance";

export const getStudentLogs = async () => {
  const res = await axiosInstance.get("/logbook/student");
  return res.data;
};

export const submitLogEntry = async ({
  weekNumber,
  reportContent,
  images,
}: {
  weekNumber: number;
  reportContent: string;
  images: File[];
}) => {
  const formData = new FormData();

  formData.append("weekNumber", String(weekNumber));
  formData.append("reportContent", reportContent);

  images.forEach((image) => {
    formData.append("images", image);
  });

  return await axiosInstance.post("/logbook/submit", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure proper encoding
    },
  });
};

export const getLogById = async (id: number) => {
  const res = await axiosInstance.get(`/logbook/student/${id}`);
  return res.data;
};

export const getDeadline = async (weekNumber: number) => {
  const res = await axiosInstance.get(`/logbook/deadline/${weekNumber}`);
  return res.data;
};

// // 📜 Get log by ID
// export const getLogById = async (id: number) => {
//   const res = await axiosInstance.get(`/logbook/student/${id}`);
//   return res.data;
// };

// 🤖 AI Analysis on Report
export const analyzeReportAI = async (entryId: number) => {
  const res = await axiosInstance.post(`/logbook/${entryId}/analyze-ai`);
  return res.data;
};

// 📝 Submit Feedback
export const submitFeedback = async (
  entryId: number,
  remark: string,
  comment: string
) => {
  const res = await axiosInstance.post(`/logbook/${entryId}/feedback`, {
    remark,
    comment,
  });
  return res.data;
};
