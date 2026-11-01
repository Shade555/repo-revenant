import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RepoRevenant — The AI Agent That Brings Abandoned Code Back to Life",
  description:
    "An open-source AI repository resurrection harness. Multi-agent archaeological investigation powered by Gemma 3 open-weights, reconstructing abandoned GitHub code.",
  keywords: [
    "Hacktoberfest 2026",
    "Ghost in the Machine",
    "AI Agents",
    "RepoRevenant",
    "Open-Source AI",
    "Mastra",
    "Gemma 3",
    "Code Archaeology",
  ],
  authors: [{ name: "RepoRevenant Engineering Collective" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[#07090e] text-[#e2e8f0] font-sans antialiased selection:bg-[#e5a93c]/30 selection:text-[#fbbf24]">
        {children}
      </body>
    </html>
  );
}
