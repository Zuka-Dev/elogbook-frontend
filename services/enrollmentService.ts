import axiosInstance from "./axiosInstance";

const enrollStudent = async (enrollmentKey: string) => {
    const response = await axiosInstance.post("/enroll/enrollment", {
      enrollmentKey,
    });
    return response.data;
 }


export default enrollStudent;
