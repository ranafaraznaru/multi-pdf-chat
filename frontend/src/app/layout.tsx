import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/auth-context";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Superdesign | Multi-PDF Intelligence",
  description:
    "Upload PDFs, vectorize them, and chat with your documents using semantic search.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <AppShell>{children}</AppShell>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(30, 41, 59, 0.95)",
                color: "#f8f9fa",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
              },
              success: {
                iconTheme: { primary: "#6366f1", secondary: "#f8f9fa" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#f8f9fa" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
