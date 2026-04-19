import type { Metadata } from "next";
import "./globals.css";

import { ProfileProvider } from "@/lib/profile-context";

export const metadata: Metadata = {
  title: "READIFY - Teman Membaca Pintar",
  description: "Belajar membaca seru bersama teman pintar dan misi menjaga bumi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F0F8FF] font-body text-[#333333] antialiased overflow-x-hidden min-h-screen">
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}
