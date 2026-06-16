import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast'; // Assuming toast for a senior feel, otherwise simple alert

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'An unexpected error occurred';
    console.error('[API Error]:', message);
    // In a real app, use a toast notification
    alert(`Error: ${message}`);
  } else {
    console.error('[System Error]:', error);
    alert('A system error occurred.');
  }
};
