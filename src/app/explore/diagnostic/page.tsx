"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useProfile } from "@/lib/profile-context";
import { useRouter } from "next/navigation";

const STAGES = [
  { id: 'A', title: 'Pembaca Dini', desc: 'Mengenal huruf & bunyi suku kata.', img: 'https://i.ibb.co.com/RptQhrgk/A.png', angle: 0, color: '#FF4757' },
  { id: 'B', title: 'Pembaca awal', desc: 'Mulai merangkai kata & kalimat pendek.', img: 'https://i.ibb.co.com/ZRcw6TTW/B.png', angle: 72, color: '#8E44AD' },
  { id: 'C', title: 'Pembaca Semenjana', desc: 'Lancar membaca & paham isi cerita.', img: 'https://i.ibb.co.com/h1CsCtdN/C.png', angle: 144, color: '#1E3A8A' },
  { id: 'D', title: 'Pembaca Madya', desc: 'Mampu analisis & ambil pesan cerita.', img: 'https://i.ibb.co.com/G3W8wFSf/D.png', angle: 216, color: '#22C55E' },
  { id: 'E', title: 'Pembaca Mahir', desc: 'Berpikir kritis & evaluasi teks sulit.', img: 'https://i.ibb.co.com/t01VSX5/E.png', angle: 288, color: '#FACC15' },
];

const DIAGNOSTIC_TYPES = [
  {
    id: "fluency",
    href: "/explore/diagnostic/fluency",
    icon: "mic",
    title: "Kelancaran Membaca",
    subtitle: "Uji Suara & Kecepatan",
    description: "Baca teks dengan suara keras dan lihat seberapa lancar kamu membaca. Sistem pintar akan mendengar dan menilai kecepatanmu!",
    color: "#FFB347",
    colorDark: "#E69A2E",
    colorLight: "#FFF3E0",
    emoji: "🎤",
    steps: ["Mulai diagnosis", "Baca dengan suara keras", "Lihat skor kelancaran"],
  },
  {
    id: "comprehension",
    href: "/explore/diagnostic/comprehension",
    icon: "psychology",
    title: "Membaca Pemahaman",
    subtitle: "Uji Pengertian Cerita",
    description: "Baca cerita seru lalu jawab pertanyaan untuk buktikan kalau kamu paham isi ceritanya.",
    color: "#87CEEB",
    colorDark: "#5AAFD1",
    colorLight: "#E0F2FE",
    emoji: "🧠",
    steps: ["Pilih cerita", "Baca dengan teliti", "Jawab pertanyaan"],
  },
];

export default function DiagnosticHubPage() {
  const { profile, logout, getAvatarUrl } = useProfile();
  const router = useRouter();
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] flex flex-col items-center font-body relative overflow-x-hidden text-[#333333]">
      
      {/* Background Decor */}
      <div className="cloud-blob w-[600px] h-[400px] -top-20 -right-20 bg-white shadow-[0_0_80px_rgba(255,255,255,1)]"></div>
      <div className="cloud-blob w-[400px] h-[300px] bottom-10 left-10 bg-white shadow-[0_0_80px_rgba(255,255,255,1)]"></div>
      <div className="absolute top-40 left-20 w-32 h-32 bg-[#FFB347] rounded-full opacity-15 filter blur-3xl"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-[#87CEEB] rounded-full opacity-15 filter blur-3xl"></div>

      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-4 border-[#E2E8F0] shadow-sm animate-bounce-in">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="hover:scale-105 transition-transform flex items-center shrink-0">
             <Image src="https://i.ibb.co.com/cXwhYkn7/Desain-tanpa-judul-21.png" alt="Readify Logo" width={120} height={35} className="object-contain drop-shadow-md" unoptimized={true} />
          </Link>

          <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
             {/* Navigation Links */}
             <div className="hidden md:flex items-center gap-2">
                <Link href="/explore/library" className="px-5 py-2 rounded-3xl bg-white text-[#A0AEC0] border-4 border-transparent hover:border-[#E2E8F0] hover:bg-[#F8FAFC] flex items-center gap-2 font-bold text-xs uppercase tracking-wide transition-all group">
                  <span className="material-symbols-rounded text-lg group-hover:text-[#FFB347]">auto_stories</span>
                  <span>Perpustakaan</span>
                </Link>
                <Link href="/explore/diagnostic" className="px-5 py-2 rounded-3xl bg-[#FFB347] text-white border-4 border-[#E69A2E] shadow-[0_4px_0_#E69A2E] flex items-center gap-2 font-bold text-xs uppercase tracking-wide transition-all">
                  <span className="material-symbols-rounded text-lg">stairs</span>
                  <span>Diagnosis Membaca</span>
                </Link>
             </div>

             {/* Profile & Logout */}
             <div className="flex items-center gap-3 bg-[#F0F8FF] px-4 py-1.5 rounded-full border-2 border-[#E2E8F0] shadow-inner ml-2">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-[#FFB347] overflow-hidden flex items-center justify-center shrink-0">
                  <img src={getAvatarUrl()} alt="User Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:block">
                   <p className="text-[9px] font-black text-[#A0AEC0] tracking-widest leading-none mb-0.5">Petualang</p>
                   <h4 className="text-[11px] font-black text-[#5AAFD1] truncate tracking-wide max-w-[100px]">{profile.name}</h4>
                </div>
                <button 
                  onClick={handleLogout}
                  className="ml-2 flex items-center justify-center w-8 h-8 rounded-full hover:bg-white text-[#FF4757]/60 hover:text-[#FF4757] transition-all group border-2 border-transparent hover:border-[#FF4757]/20"
                  title="Keluar"
                >
                   <span className="material-symbols-rounded text-base group-hover:rotate-12 transition-transform">logout</span>
                </button>
             </div>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-6xl mt-24 px-4 md:px-8 pb-10 relative z-50">
        

        <div className="max-w-[1400px] mx-auto mb-10 animate-bounce-in">
           <div className="flex flex-col lg:flex-row items-center justify-center gap-8 bg-white/40 backdrop-blur-xl rounded-[48px] border-4 border-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-6 md:p-10 overflow-visible relative group">
              
              {/* Metamorphosis Cycle - Scaled for 1-Page fit */}
              <div className="flex items-center justify-center relative w-[420px] h-[420px] shrink-0 group/orbit">
                {/* Center Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#FFB347]/10 rounded-full blur-3xl animate-pulse"></div>
                
                {/* SVG Arrows Layer (Orbits) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible animate-orbit group-hover/orbit:[animation-play-state:paused]" viewBox="0 0 420 420">
                    <defs>
                      <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                          </feMerge>
                      </filter>
                      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#5AAFD1" />
                          <stop offset="100%" stopColor="#FFB347" />
                      </linearGradient>
                    </defs>
                    <circle cx="210" cy="210" r="140" fill="none" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="10 10" className="opacity-40" />
                    <circle cx="210" cy="210" r="140" fill="none" stroke="url(#lineGrad)" strokeWidth="6" strokeDasharray="20 360" strokeLinecap="round" style={{ filter: 'url(#glow)' }}>
                      <animateTransform attributeName="transform" type="rotate" from="0 210 210" to="360 210 210" dur="10s" repeatCount="indefinite" />
                    </circle>
                </svg>

                {/* Rotating Wrapper for Stages */}
                <div className="absolute inset-0 animate-orbit group-hover/orbit:[animation-play-state:paused]">
                  {STAGES.map((stage, i) => {
                      const radius = 150;
                      const rad = (stage.angle - 90) * (Math.PI / 180);
                      const x = 210 + radius * Math.cos(rad);
                      const y = 210 + radius * Math.sin(rad);

                      return (
                        <div 
                            key={stage.id}
                            className="absolute group z-20 cursor-pointer"
                            style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
                            onClick={() => setActiveStage(activeStage === i ? null : i)}
                        >
                            <div className="animate-counter-orbit group-hover/orbit:[animation-play-state:paused]">
                              {/* Symbolic Level Badge (Star, Circle, Triangle) */}
                              <div 
                                className={`absolute -top-10 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 transform ${activeStage === i ? 'opacity-100 -translate-y-2 scale-110' : 'opacity-0'} group-hover:opacity-100 group-hover:-translate-y-2 group-hover:scale-110`}
                              >
                                 <div 
                                   className={`w-8 h-8 flex items-center justify-center text-[11px] font-black shadow-xl border-2 border-white transform transition-transform ${
                                     stage.id === 'A' ? 'bg-[#FF4757] text-white' : // Merah
                                     stage.id === 'B' ? 'bg-[#8E44AD] text-white rounded-full' : // Ungu Lingkaran
                                     stage.id === 'C' ? 'bg-[#1E3A8A] text-white rounded-full' : // Biru Tua Lingkaran
                                     stage.id === 'D' ? 'bg-[#22C55E] text-white' : // Hijau
                                     'bg-[#FACC15] text-[#333333] rounded-sm' // Kuning
                                   }`}
                                   style={{
                                     clipPath: stage.id === 'A' 
                                       ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' 
                                       : stage.id === 'D'
                                       ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                                       : 'none'
                                   }}
                                 >
                                   <span className={stage.id === 'D' ? 'mt-2' : ''}>{stage.id}</span>
                                 </div>
                              </div>
                              <div className={`relative w-20 h-20 bg-white rounded-full border-4 shadow-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110`} style={{ borderColor: activeStage === i ? stage.color : '#E2E8F0' }}>
                                <img src={stage.img} alt={stage.title} className="w-12 h-12 object-contain" />
                                {activeStage === i && <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: stage.color }}></div>}
                              </div>
                              {activeStage === i && (
                                <div className="absolute top-[105%] left-1/2 -translate-x-1/2 w-56 p-3 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#E2E8F0] shadow-2xl z-50 animate-bounce-in text-center">
                                    <h4 className="text-[10px] font-black mb-1" style={{ color: stage.color }}>{stage.title}</h4>
                                    <p className="text-[9px] font-bold text-[#666666] leading-relaxed italic">{stage.desc}</p>
                                </div>
                              )}
                            </div>
                        </div>
                      );
                  })}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none">
                    <span className="text-[9px] font-black text-[#A0AEC0] tracking-widest block mb-0.5">Perjalanan</span>
                    <span className="text-xl font-black text-[#5AAFD1] leading-none">Membaca</span>
                </div>
              </div>

              {/* Right: Diagnostic Info Side */}
              <div className="flex-1 p-2 md:pl-16 flex flex-col justify-center relative z-10">
                <div className="inline-block self-start px-3 py-1 bg-[#FFF3E0] text-[#E69A2E] rounded-lg text-[9px] font-black tracking-widest mb-3 border-2 border-[#FFE0B2]">Rekomendasi Utama</div>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-[#333333] mb-4">Diagnosis Pintar</h2>
                
                <p className="text-base text-[#666666] font-bold leading-relaxed mb-8 max-w-xl">
                  Uji kemampuan membacamu secara menyeluruh! Mulailah petualangan hebat ini dan temukan seberapa jauh sayapmu bisa terbang.
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                   <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#FFFAF0] flex items-center justify-center border-2 border-[#FFB347] font-bold text-[#FFB347] text-[10px]">A</div>
                      <span className="text-[11px] font-black text-[#555555] tracking-wide">Pembaca Dini</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#F0F9FF] flex items-center justify-center border-2 border-[#87CEEB] font-bold text-[#87CEEB] text-[10px]">B</div>
                      <span className="text-[11px] font-black text-[#555555] tracking-wide">Pembaca Awal</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#F0FDF4] flex items-center justify-center border-2 border-[#34D399] font-bold text-[#34D399] text-[10px]">C</div>
                      <span className="text-[11px] font-black text-[#555555] tracking-wide">Semenjana</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#FEF2F2] flex items-center justify-center border-2 border-[#FF4757] font-bold text-[#FF4757] text-[10px]">D</div>
                      <span className="text-[11px] font-black text-[#555555] tracking-wide">Pembaca Madya</span>
                   </div>
                </div>

                <Link 
                  href="/explore/diagnostic/integrated"
                  className="w-full max-w-sm py-4 rounded-[24px] bg-[#FFB347] text-white font-black text-lg tracking-widest text-center transition-all duration-300 flex items-center justify-center gap-4 shadow-[0_8px_0_#E69A2E] hover:translate-y-1 hover:shadow-[0_4px_0_#E69A2E] group/btn"
                >
                  Mulai Petualangan
                  <span className="material-symbols-rounded text-xl font-bold group-hover/btn:translate-x-2 transition-transform">rocket_launch</span>
                </Link>
              </div>
           </div>
        </div>

         {/* Bottom Info - Compact & Single-Page Fit */}
         <div className="animate-bounce-in text-center mt-4" style={{ animationDelay: '0.3s' }}>
           <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border-2 border-[#E2E8F0] rounded-full px-5 py-2 shadow-sm">
             <span className="material-symbols-rounded text-base text-[#34D399]">info</span>
             <p className="text-[10px] font-black text-[#A0AEC0] tracking-widest uppercase">Diagnosis Terintegrasi & Adaptif Sesuai Kemampuanmu</p>
           </div>
         </div>

      </main>
    </div>
  );
}

