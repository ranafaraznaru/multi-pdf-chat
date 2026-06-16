import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;
    const message =
      axiosError.response?.data?.detail ||
      axiosError.response?.data?.message ||
      "An unexpected error occurred";
    console.error("[API Error]:", message);
    toast.error(String(message));
  } else {
    console.error("[System Error]:", error);
    toast.error("A system error occurred.");
  }
};
