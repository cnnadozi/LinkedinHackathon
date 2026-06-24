import type { Metadata } from "next";
import "@/components/linkedin/linkedin.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkedIn Hackathon",
  description: "Possibilities in Tech Hackathon 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
