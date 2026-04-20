import type { Metadata } from "next";
import "./globals.css";

import { ProfileProvider } from "@/lib/profile-context";
import NameGuard from "@/components/NameGuard";

export const metadata: Metadata = {
  title: "READIFY - Teman Membaca Pintar",
  description: "Belajar membaca seru bersama teman pintar dan misi menjaga bumi",
  icons: {
    icon: "https://i.ibb.co.com/cXV7sdBj/LOGO-WARNA.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="https://i.ibb.co.com/cXV7sdBj/LOGO-WARNA.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F0F8FF] font-body text-[#333333] antialiased overflow-x-hidden min-h-screen" style={{ zoom: 1.1 }}>
        <ProfileProvider>
          <NameGuard>
            {children}
          </NameGuard>
          {/* Version Marker for Deployment Verification */}
          <div className="fixed bottom-2 right-2 text-[10px] font-black text-[#A0AEC0] opacity-20 pointer-events-none z-[9999]">
            READIFY v1.1
          </div>
        </ProfileProvider>
      </body>
    </html>
  );
}
