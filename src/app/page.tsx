"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useProfile } from "@/lib/profile-context";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { profile, logout, getAvatarUrl } = useProfile();
  const router = useRouter();

  const handleMulai = () => {
    router.push("/explore/library");
  };

  const handleLogout = () => {
    logout();
  };

  const STAGES = [
    { id: 'A', title: 'Pembaca Dini', desc: 'Mengenal huruf & bunyi suku kata.', img: 'https://i.ibb.co.com/RptQhrgk/A.png', angle: 0, color: '#FF4757' },
    { id: 'B', title: 'Pembaca Awal', desc: 'Mulai merangkai kata & kalimat pendek.', img: 'https://i.ibb.co.com/ZRcw6TTW/B.png', angle: 72, color: '#8E44AD' },
    { id: 'C', title: 'Pembaca Semenjana', desc: 'Lancar membaca & paham isi cerita.', img: 'https://i.ibb.co.com/h1CsCtdN/C.png', angle: 144, color: '#1E3A8A' },
    { id: 'D', title: 'Pembaca Madya', desc: 'Mampu analisis & ambil pesan cerita.', img: 'https://i.ibb.co.com/G3W8wFSf/D.png', angle: 216, color: '#22C55E' },
    { id: 'E', title: 'Pembaca Mahir', desc: 'Berpikir kritis & evaluasi teks sulit.', img: 'https://i.ibb.co.com/t01VSX5/E.png', angle: 288, color: '#FACC15' },
  ];

  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#F0F8FF] font-body text-[#333333] relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="cloud-blob w-[600px] h-[400px] -top-20 -left-20 bg-white shadow-[0_0_50px_rgba(255,255,255,1)]"></div>
      <div className="cloud-blob w-[500px] h-[300px] top-1/3 right-[-100px] bg-white opacity-80"></div>
      <div className="cloud-blob w-[400px] h-[250px] bottom-10 left-10 bg-white opacity-90"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-[#FFB347] rounded-full opacity-20 filter blur-2xl"></div>
      
      {/* SOLID NAVBAR */}



      {/* HERO SECTION */}
      <section className="relative z-50 pt-32 pb-10 px-6 md:px-8 max-w-6xl mx-auto flex flex-col justify-center min-h-[80vh]">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Text Content */}
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2 mb-3 animate-bounce-in" style={{ animationDelay: '0.1s' }}>
              <span className="px-3 py-1.5 rounded-full bg-[#FFB347]/20 border-2 border-[#FFB347] text-[#E69A2E] text-[10px] font-black tracking-widest shadow-sm">
                Teman Membaca Pintar
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#87CEEB]/20 border-2 border-[#87CEEB] text-[#5AAFD1] text-[10px] font-black tracking-widest shadow-sm">
                Versi 2.0 Terbaru
              </span>
            </div>
          
            <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter mb-3 animate-bounce-in text-[#333333]" style={{ animationDelay: '0.2s' }}>
              Petualangan <br/>
              <span className="text-gradient-bubbly">Membaca!</span>
              <span className="inline-block ml-3 animate-float-cloud text-4xl md:text-5xl">🚀</span>
            </h1>
          
            <p className="text-sm md:text-base text-[#666666] font-semibold leading-relaxed mb-5 max-w-xl animate-bounce-in" style={{ animationDelay: '0.3s' }}>
               Membantu anak-anak hebat sepertimu jadi jago memecahkan rahasia cerita sambil menjaga bumi tetap hijau. Belajar membaca jadi semenyenangkan bermain game!
            </p>
 
            <div className="flex flex-wrap gap-4 animate-bounce-in" style={{ animationDelay: '0.4s' }}>
              <button onClick={handleMulai} className="btn-bubbly !text-sm !px-6 !py-3 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                Mulai Membaca Sekarang <span className="material-symbols-rounded font-bold text-lg">rocket_launch</span>
              </button>
            </div>
          </div>

          {/* Right: Interactive Metamorphosis Cycle */}
          <div className="hidden lg:flex items-center justify-center relative w-[500px] h-[500px] shrink-0 group/orbit">
             {/* Center Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FFB347]/10 rounded-full blur-3xl animate-pulse"></div>
             
             {/* SVG Arrows Layer (Orbits) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible animate-orbit group-hover/orbit:[animation-play-state:paused]" viewBox="0 0 500 500">
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
                {/* Circular Path for Pulse Animation */}
                <circle cx="250" cy="250" r="160" fill="none" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="10 10" className="opacity-40" />
                <circle cx="250" cy="250" r="160" fill="none" stroke="url(#lineGrad)" strokeWidth="6" strokeDasharray="20 400" strokeLinecap="round" style={{ filter: 'url(#glow)' }}>
                   <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="360 250 250" dur="10s" repeatCount="indefinite" />
                </circle>
             </svg>

             {/* Rotating Wrapper for Stages */}
             <div className="absolute inset-0 animate-orbit group-hover/orbit:[animation-play-state:paused]">
               {STAGES.map((stage, i) => {
                  const radius = 175;
                  const rad = (stage.angle - 90) * (Math.PI / 180);
                  const x = 250 + radius * Math.cos(rad);
                  const y = 250 + radius * Math.sin(rad);

                  return (
                    <div 
                        key={stage.id}
                        className="absolute group z-20 cursor-pointer"
                        style={{ 
                          left: `${x}px`, 
                          top: `${y}px`, 
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => setActiveStage(activeStage === i ? null : i)}
                    >
                        {/* Wrapper that counter-rotates to keep content upright */}
                        <div className="animate-counter-orbit group-hover/orbit:[animation-play-state:paused]">
                          {/* Badge Tag */}
                          <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-white border-2 rounded-full text-[10px] font-black shadow-lg transition-all transform whitespace-nowrap ${activeStage === i ? 'opacity-100 -translate-y-2' : 'opacity-0'} group-hover:opacity-100 group-hover:-translate-y-2`} style={{ borderColor: stage.color, color: stage.color }}>
                            Level {stage.id}
                          </div>

                          {/* Icon Container */}
                          <div className={`relative w-24 h-24 bg-white rounded-full border-4 shadow-xl flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.1)]`} style={{ borderColor: activeStage === i ? stage.color : '#E2E8F0' }}>
                            <img src={stage.img} alt={stage.title} className="w-16 h-16 object-contain" />
                            
                            {/* Pulse Ring */}
                            {activeStage === i && (
                              <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: stage.color }}></div>
                            )}
                          </div>

                          {/* Description Popup */}
                          {activeStage === i && (
                            <div className="absolute top-[110%] left-1/2 -translate-x-1/2 w-64 p-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#E2E8F0] shadow-2xl z-50 animate-bounce-in text-center">
                                <h4 className="text-xs font-black uppercase mb-1" style={{ color: stage.color }}>{stage.title}</h4>
                                <p className="text-[10px] font-bold text-[#666666] leading-relaxed italic">{stage.desc}</p>
                            </div>
                          )}
                        </div>
                    </div>
                  );
               })}
             </div>

             {/* Center Label */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none">
                <span className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest block mb-1">Perjalanan</span>
                <span className="text-2xl font-black text-[#5AAFD1] uppercase leading-none">Membaca</span>
             </div>
          </div>
        </div>
      </section>



      {/* JENJANG PEMBACA SECTION */}
      <section className="bg-[#FFB347] pt-20 pb-32 px-8 relative overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/20 rounded-full animate-float-cloud"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-float-cloud" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#1E3A5F] tracking-tighter mb-4 drop-shadow-md">
            Jenjang <span className="underline decoration-[#1E3A5F]/30 underline-offset-8">Pembaca</span>
          </h2>
          <p className="text-[#1E3A5F]/80 font-bold mb-16 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
             Setiap petualang punya level keberaniannya sendiri! Di tahap mana kamu sekarang?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { id: 'A', title: 'Pembaca Dini', desc: 'Mengenal huruf & bunyi suku kata.', color: '#FFB347', image: 'https://i.ibb.co.com/RptQhrgk/A.png' },
              { id: 'B', title: 'Pembaca Awal', desc: 'Mulai merangkai kata & kalimat pendek.', color: '#87CEEB', image: 'https://i.ibb.co.com/ZRcw6TTW/B.png' },
              { id: 'C', title: 'Pembaca Semenjana', desc: 'Lancar membaca & paham isi cerita.', color: '#34D399', image: 'https://i.ibb.co.com/h1CsCtdN/C.png' },
              { id: 'D', title: 'Pembaca Madya', desc: 'Mampu analisis & ambil pesan cerita.', color: '#A78BFA', image: 'https://i.ibb.co.com/G3W8wFSf/D.png' },
              { id: 'E', title: 'Pembaca Mahir', desc: 'Berpikir kritis & evaluasi teks sulit.', color: '#F472B6', image: 'https://i.ibb.co.com/t01VSX5/E.png' },
            ].map((level, i) => (
              <div 
                key={level.id} 
                className="group relative cursor-pointer"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="card-bubbly !bg-white p-6 h-full flex flex-col items-center text-center transition-all duration-300 group-hover:-translate-y-4 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-4 border-transparent group-hover:border-white">
                  <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    <img src={level.image} alt={level.title} className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                  <h3 className="text-base md:text-lg font-black text-[#333333] leading-tight mb-2 tracking-tight group-hover:text-[#5AAFD1] transition-colors">{level.title}</h3>
                  <p className="text-[10px] md:text-xs text-[#666666] font-bold leading-relaxed">{level.desc}</p>
                  
                  {/* Hover Tag */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                     <span className="px-3 py-1 bg-[#5AAFD1] text-white text-[10px] font-black rounded-full tracking-widest shadow-lg">Level {level.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER BANNER STYLE */}
      <footer className="mt-20 border-t-4 border-[#E2E8F0] py-16 px-8 bg-white relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <Link href="/" className="hover:scale-105 transition-transform">
             <Image src="https://i.ibb.co.com/cXwhYkn7/Desain-tanpa-judul-21.png" alt="Readify Logo" width={140} height={45} className="object-contain" />
          </Link>
          <div className="flex gap-8 text-xs font-black tracking-widest text-[#A0AEC0]">
             <a href="#" className="hover:text-[#FFB347] transition-colors">Rahasia Data</a>
             <a href="#" className="hover:text-[#FFB347] transition-colors">Aturan Pakai</a>
             <a href="#" className="hover:text-[#FFB347] transition-colors">Hubungi Kami</a>
          </div>
        </div>
      </footer>

      {/* STICKY BOTTOM BUTTON (MOBILE ONLY) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-[100] animate-bounce-in" style={{ animationDelay: '0.6s' }}>
        <button 
          onClick={handleMulai}
          className="w-full bg-[#FFB347] text-white py-4 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(255,179,71,0.4)] border-4 border-white flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <span>Ayo Mulai Membaca! 👋</span>
          <span className="material-symbols-rounded font-bold text-lg">rocket_launch</span>
        </button>
      </div>

    </main>
  );
}
