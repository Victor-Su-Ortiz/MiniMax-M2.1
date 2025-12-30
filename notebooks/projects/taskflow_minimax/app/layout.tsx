import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TaskProvider } from "@/context/TaskContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ToastContainer } from "@/components/ui/ToastContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow - Modern Task Management",
  description: "A modern task management dashboard built with Next.js 14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-200 antialiased`}>
        <TaskProvider>
          <div className="flex min-h-screen bg-[url('/grid.svg')] bg-fixed bg-center">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
              <Header />
              <main className="flex-1 p-4 lg:p-8 overflow-auto">
                {children}
              </main>
            </div>
          </div>
          <ToastContainer />
        </TaskProvider>
      </body>
    </html>
  );
}