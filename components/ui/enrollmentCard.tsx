

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import enrollStudent from "@/services/enrollmentService";

export default function EnrollmentModal({ onClose }: { onClose: () => void }) {
  const { refreshUser } = useUser();
  const [enrollmentKey, setEnrollmentKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!enrollmentKey) return showErrorToast("Please enter an enrollment key");

    setLoading(true);
    try {
      await enrollStudent(enrollmentKey);
      showSuccessToast("Enrollment successful!");
      refreshUser(); // Refresh user data to reflect the new supervisorId
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast("Enrollment failed. Check your key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-[350px]">
        <h2 className="text-lg font-bold text-center">Enter Enrollment Key</h2>
        <input
          type="text"
          value={enrollmentKey}
          onChange={(e) => setEnrollmentKey(e.target.value)}
          className="mt-4 w-full p-2 border rounded-md"
          placeholder="Enrollment Key"
        />
        <div className="flex justify-between mt-4">
          <Button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            onClick={handleEnroll}
            disabled={loading}
          >
            {loading ? "Enrolling..." : "Submit"}
          </Button>
          <Button
            className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
