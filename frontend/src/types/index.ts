export interface Document {
  id: string | number;
  file_name: string;
  url: string;
  status: "processing" | "completed" | "failed";
  total_pages: number;
}

export interface Message {
  id?: number;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export interface ChatResponse {
  question: string;
  answer: string;
  sources: Source[];
}

export interface Source {
  score: number;
  page: number;
  text: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
