"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile-context";
import MobileNav from "./MobileNav";
import NamePromptModal from "./NamePromptModal";

export default function Navbar() {
  const { profile, logout, getAvatarUrl } = useProfile();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

  const isDefaultUser = profile.name === "Petualang Baca";

  // Hide navbar on specialized reading pages and potentially landing if we want, 
  // but user said CONSISTENT in every page. 
  // Specialized Reading Room has its own logic, so we hide it there.
  if (pathname?.startsWith("/explore/read/")) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-4 border-[#E2E8F0] shadow-sm animate-bounce-in">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="hover:scale-105 transition-transform flex items-center shrink-0">
            <Image 
              src="https://i.ibb.co.com/cXwhYkn7/Desain-tanpa-judul-21.png" 
              alt="Readify Logo" 
              width={110} 
              height={35} 
              className="object-contain drop-shadow-md" 
              unoptimized
            />
          </Link>

          <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/explore/library" 
                className={`px-5 py-2 rounded-3xl flex items-center gap-2 font-bold text-xs uppercase tracking-wide transition-all group ${
                  pathname === "/explore/library" 
                    ? "bg-[#5AAFD1] text-white border-4 border-[#4691B0] shadow-[0_4px_0_#4691B0]" 
                    : "bg-white text-[#A0AEC0] border-4 border-transparent hover:border-[#E2E8F0] hover:bg-[#F8FAFC]"
                }`}
              >
                <span className={`material-symbols-rounded text-lg ${pathname === "/explore/library" ? "" : "group-hover:text-[#5AAFD1]"}`}>auto_stories</span>
                <span>Perpustakaan</span>
              </Link>
              <Link 
                href="/explore/diagnostic" 
                className={`px-5 py-2 rounded-3xl flex items-center gap-2 font-bold text-xs uppercase tracking-wide transition-all group ${
                  pathname?.includes("/diagnostic") 
                    ? "bg-[#5AAFD1] text-white border-4 border-[#4691B0] shadow-[0_4px_0_#4691B0]" 
                    : "bg-white text-[#A0AEC0] border-4 border-transparent hover:border-[#E2E8F0] hover:bg-[#F8FAFC]"
                }`}
              >
                <span className={`material-symbols-rounded text-lg ${!pathname?.includes("/diagnostic") ? "group-hover:text-[#5AAFD1]" : ""}`}>stairs</span>
                <span>Diagnosis Membaca</span>
              </Link>
            </div>

            {/* Hamburger Button (Mobile Only) */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="flex md:hidden w-10 h-10 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#5AAFD1] border-2 border-[#E2E8F0] hover:bg-white transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-rounded text-2xl font-bold">menu</span>
            </button>

            {/* Profile & Logout / Login Button */}
            {isDefaultUser ? (
              <button 
                onClick={() => setShowNameModal(true)}
                className="px-6 py-2 bg-[#5AAFD1] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-[0_4px_0_#4691B0] hover:-translate-y-1 active:translate-y-0 transition-all ml-1 border-2 border-white"
              >
                MASUK
              </button>
            ) : (
              <div className="flex items-center gap-2 md:gap-3 bg-[#F0F8FF] px-2 md:px-4 py-1.5 rounded-full border-2 border-[#E2E8F0] shadow-inner ml-1">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-[#5AAFD1] overflow-hidden flex items-center justify-center shrink-0">
                  <img src={getAvatarUrl()} alt="User Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-[9px] font-black text-[#A0AEC0] tracking-widest leading-none mb-0.5">Petualang</p>
                  <h4 className="text-[11px] font-black text-[#5AAFD1] truncate tracking-wide max-w-[80px] md:max-w-[100px]">{profile.name}</h4>
                </div>
                <button 
                  onClick={handleLogout}
                  className="hidden md:flex ml-2 items-center justify-center w-8 h-8 rounded-full hover:bg-white text-[#FF4757]/60 hover:text-[#FF4757] transition-all group border-2 border-transparent hover:border-[#FF4757]/20"
                  title="Keluar"
                >
                  <span className="material-symbols-rounded text-base group-hover:rotate-12 transition-transform">logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showNameModal && (
        <NamePromptModal onClose={() => setShowNameModal(false)} />
      )}

      <MobileNav 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        profileName={profile.name}
        avatarUrl={getAvatarUrl()}
        onLogout={handleLogout}
        onLogin={() => setShowNameModal(true)}
        isDefaultUser={isDefaultUser}
      />
    </>
  );
}
