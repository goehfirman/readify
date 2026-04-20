"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProfile } from "@/lib/profile-context";
import { useBooks } from "@/hooks/useBooks";

const MENU_ITEMS = [
  { icon: "auto_stories", label: "Perpustakaan", active: true },
  { icon: "stairs", label: "Diagnosis Membaca", active: false, href: "/explore/diagnostic" },
];

export default function ExploreLibrary() {
  const { profile, logout, getAvatarUrl } = useProfile();
  const { allBooks } = useBooks();
  
  const jenjangOptions = Array.from(new Set(allBooks.map(b => b.level).filter(Boolean))).sort();
  const sdgOptions = Array.from(new Set(allBooks.map(b => b.theme).filter(Boolean))).sort();

  const [activeFilter, setActiveFilter] = useState({ type: 'sort', value: 'Terbaru' });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);

  const displayedBooks = [...allBooks].sort((a, b) => {
    if (activeFilter.type === 'sort' && activeFilter.value === 'Terpopuler') {
      const popA = a.title.charCodeAt(0) + a.title.length;
      const popB = b.title.charCodeAt(0) + b.title.length;
      return popB - popA;
    }
    const indexA = allBooks.indexOf(a);
    const indexB = allBooks.indexOf(b);
    return indexB - indexA; // Default sort is newest
  }).filter(b => {
    if (activeFilter.type === 'jenjang') return b.level === activeFilter.value;
    if (activeFilter.type === 'sdg') return b.theme === activeFilter.value;
    return true;
  });

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-[#F0F8FF] font-body text-[#333333]">
      


      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto mt-24 px-6 md:px-10 pb-20 pt-8 relative overflow-hidden z-50 transition-all duration-300" style={{ zoom: 0.9 }}>
        
        {/* Decorative Clouds */}
        <div className="cloud-blob w-[400px] h-[250px] top-[-50px] right-[-50px] bg-white shadow-[0_0_80px_rgba(255,255,255,1)]"></div>
        <div className="cloud-blob w-[300px] h-[200px] bottom-[-100px] left-20 bg-white opacity-80 shadow-[0_0_80px_rgba(255,255,255,1)]"></div>

        {/* Student Profile Bar - Removed per request */}

        {/* Header Section */}
        <div className="mb-8 relative z-10 animate-bounce-in">
           <p className="text-xs font-black text-[#5AAFD1] tracking-[0.2em] mb-2 drop-shadow-sm">Pilih Petualanganmu</p>
           <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight drop-shadow-sm text-[#333333]">Jelajahi Dunia <span className="text-gradient-bubbly">Membaca!</span></h1>
        </div>
        
        {/* Sorting & Filter Navbar */}
        <div className="mb-12 flex relative z-50 animate-bounce-in w-full overflow-hidden" style={{ animationDelay: '0.05s' }}>
           <div className="flex gap-2 bg-white p-2 rounded-3xl border-4 border-[#E2E8F0] shadow-sm overflow-x-auto scrollbar-hide shrink-0 z-50 max-w-full">
              <button
                onClick={() => { setActiveFilter({ type: 'sort', value: 'Terbaru' }); setOpenDropdown(null); }}
                className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-3 rounded-2xl text-[10px] md:text-xs font-black tracking-widest transition-all border-2 ${activeFilter.type === 'sort' && activeFilter.value === 'Terbaru' ? 'bg-[#FFB347] text-white border-[#E69A2E] shadow-[0_4px_0_#E69A2E]' : 'bg-transparent border-transparent text-[#A0AEC0] hover:text-[#333333]'}`}
              >
                Terbaru
              </button>
              
              <button
                onClick={() => { setActiveFilter({ type: 'sort', value: 'Terpopuler' }); setOpenDropdown(null); }}
                className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-3 rounded-2xl text-[10px] md:text-xs font-black tracking-widest transition-all border-2 ${activeFilter.type === 'sort' && activeFilter.value === 'Terpopuler' ? 'bg-[#FFB347] text-white border-[#E69A2E] shadow-[0_4px_0_#E69A2E]' : 'bg-transparent border-transparent text-[#A0AEC0] hover:text-[#333333]'}`}
              >
                Terpopuler
              </button>

              <div className="relative">
                 <button
                   onClick={() => setOpenDropdown(openDropdown === 'jenjang' ? null : 'jenjang')}
                   className={`flex items-center gap-1 whitespace-nowrap px-4 md:px-6 py-2 md:py-3 rounded-2xl text-[10px] md:text-xs font-black tracking-widest transition-all border-2 ${activeFilter.type === 'jenjang' || openDropdown === 'jenjang' ? 'bg-[#FFB347] text-white border-[#E69A2E] shadow-[0_4px_0_#E69A2E]' : 'bg-transparent border-transparent text-[#A0AEC0] hover:text-[#333333]'}`}
                 >
                   {activeFilter.type === 'jenjang' ? activeFilter.value : 'Jenjang Pembaca'}
                   <span className="material-symbols-rounded text-sm">{openDropdown === 'jenjang' ? 'expand_less' : 'expand_more'}</span>
                 </button>
                 {openDropdown === 'jenjang' && (
                    <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white border-2 border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden animate-bounce-in p-2 space-y-1">
                       {jenjangOptions.map(jenjang => (
                          <button 
                             key={jenjang} 
                             onClick={() => { setActiveFilter({ type: 'jenjang', value: jenjang }); setOpenDropdown(null); }}
                             className={`w-full text-left px-4 py-2 text-xs font-bold rounded-xl transition-colors truncate ${activeFilter.type === 'jenjang' && activeFilter.value === jenjang ? 'bg-[#F0F8FF] text-[#5AAFD1]' : 'text-[#333333] hover:bg-[#F8FAFC]'}`}
                          >
                             {jenjang}
                          </button>
                       ))}
                    </div>
                 )}
              </div>

              <div className="relative">
                 <button
                   onClick={() => setOpenDropdown(openDropdown === 'sdg' ? null : 'sdg')}
                   className={`flex items-center gap-1 whitespace-nowrap px-4 md:px-6 py-2 md:py-3 rounded-2xl text-[10px] md:text-xs font-black tracking-widest transition-all border-2 ${activeFilter.type === 'sdg' || openDropdown === 'sdg' ? 'bg-[#FFB347] text-white border-[#E69A2E] shadow-[0_4px_0_#E69A2E]' : 'bg-transparent border-transparent text-[#A0AEC0] hover:text-[#333333]'}`}
                 >
                   {activeFilter.type === 'sdg' ? (activeFilter.value.split(':')[0] || 'Tema SDG\'s') : 'Tema SDG\'s'}
                   <span className="material-symbols-rounded text-sm">{openDropdown === 'sdg' ? 'expand_less' : 'expand_more'}</span>
                 </button>
                 {openDropdown === 'sdg' && (
                    <div className="absolute top-full right-0 md:left-0 md:right-auto mt-2 w-[240px] bg-white border-2 border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden animate-bounce-in p-2 space-y-1 max-h-[300px] overflow-y-auto">
                       {sdgOptions.map(sdg => (
                          <button 
                             key={sdg} 
                             onClick={() => { setActiveFilter({ type: 'sdg', value: sdg }); setOpenDropdown(null); }}
                             className={`w-full text-left px-4 py-2 text-xs font-bold rounded-xl transition-colors truncate ${activeFilter.type === 'sdg' && activeFilter.value === sdg ? 'bg-[#F0F8FF] text-[#5AAFD1]' : 'text-[#333333] hover:bg-[#F8FAFC]'}`}
                             title={sdg}
                          >
                             {sdg}
                          </button>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>



        {/* Book Grid - Bubbly Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
          {displayedBooks.map((book, i) => (
            <div 
              key={book.id} 
              onClick={() => setActiveBookId(activeBookId === String(book.id) ? null : String(book.id))}
              className="group flex flex-col animate-bounce-in relative overflow-hidden h-[260px] sm:h-[280px] rounded-[28px] border-4 border-[#E2E8F0] shadow-sm transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_20px_rgba(0,0,0,0.1)] p-0 bg-white cursor-pointer" 
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
               {/* Top Level Badge - Custom Shapes & Colors (Solid) */}
               <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <div 
                    className={`w-10 h-10 flex items-center justify-center text-[11px] font-black shadow-md transform hover:scale-110 transition-transform ${
                      book.level.includes('Dini') ? 'bg-[#FF4757] text-white' : // Merah
                      book.level.includes('Awal') ? 'bg-[#8E44AD] text-white rounded-full' : // Ungu Lingkaran
                      book.level.includes('Semenjana') ? 'bg-[#1E3A8A] text-white rounded-full' : // Biru Tua Lingkaran
                      book.level.includes('Madya') ? 'bg-[#22C55E] text-white' : // Hijau
                      'bg-[#FACC15] text-[#333333] rounded-sm' // Kuning Segi Empat
                    }`}
                    style={{
                      clipPath: book.level.includes('Dini') 
                        ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' // Bintang
                        : book.level.includes('Madya')
                        ? 'polygon(50% 0%, 0% 100%, 100% 100%)' // Segitiga
                        : 'none'
                    }}
                  >
                    <span className={book.level.includes('Madya') ? 'mt-3' : ''}>
                      {book.level.includes('Dini') ? 'A' : 
                       book.level.includes('B-1') ? 'B1' : 
                       book.level.includes('B-2') ? 'B2' : 
                       book.level.includes('B-3') ? 'B3' : 
                       book.level.includes('Awal') ? 'B' : 
                       book.level.includes('Semenjana') ? 'C' : 
                       book.level.includes('Madya') ? 'D' : 
                       'E'}
                    </span>
                  </div>
               </div>

               {/* Full Cover Image */}
               <div className="absolute inset-0 bg-white">
                  <Image 
                     src={book.cover} 
                     alt={book.title} 
                     fill 
                     className={`object-cover transition-transform duration-700 group-hover:scale-105 ${activeBookId === String(book.id) ? 'scale-105' : ''}`} 
                     unoptimized={typeof book.cover === 'string' && book.cover.startsWith('data:')}
                  />
                  
                  {/* Bottom Right Level Code Indicator */}
                  <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <span className="text-[10px] font-black text-[#555555]">
                        {book.level.includes('Dini') ? 'A' : 
                         book.level.includes('B-1') ? 'B1' : 
                         book.level.includes('B-2') ? 'B2' : 
                         book.level.includes('B-3') ? 'B3' : 
                         book.level.includes('Awal') ? 'B' : 
                         book.level.includes('Semenjana') ? 'C' : 
                         book.level.includes('Madya') ? 'D' : 
                         'E'}
                      </span>
                    </div>
                  </div>
               </div>

               {/* Slide Up Content Panel */}
               <div className={`absolute left-0 right-0 p-2 pb-3 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-20 group-hover:bottom-0 ${activeBookId === String(book.id) ? 'bottom-0' : '-bottom-[120px]'}`}>
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t-4 border-[#E2E8F0]">
                     <h3 className="text-sm font-black text-[#333333] leading-tight mb-2 line-clamp-2">{book.title}</h3>
                     <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-sm flex items-center ${
                           book.level === 'Pembaca Dini' ? 'bg-[#FFB347] border-2 border-[#E69A2E]' : 
                           book.level === 'Pembaca Awal' ? 'bg-[#FF4757] border-2 border-[#D63031]' : 
                           book.level === 'Pembaca Semenjana' ? 'bg-[#34D399] border-2 border-[#059669]' : 
                           book.level === 'Pembaca Madya' ? 'bg-[#5AAFD1] border-2 border-[#3894B7]' : 
                           'bg-[#8E44AD] border-2 border-[#6C3483]'
                        }`}>
                           <span className="text-[12px] mr-1">📚</span>{book.level}
                        </span>
                     </div>
                     
                     {/* Hidden details that appear on hover */}
                     <div className={`transition-opacity duration-300 delay-100 group-hover:opacity-100 ${activeBookId === String(book.id) ? 'opacity-100' : 'opacity-0'}`}>
                        <p className="text-[#666666] text-[10px] font-medium leading-relaxed mb-3 line-clamp-2">{book.desc}</p>
                        <Link href={`/explore/read/${book.id}`} className="bg-[#5AAFD1] text-white hover:bg-[#489DBF] font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-2 w-full transition-colors shadow-sm">
                           <span>Mulai Baca</span>
                           <span className="material-symbols-rounded text-[18px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>menu_book</span>
                        </Link>
                     </div>
                  </div>
               </div>
               
               {/* Dark overlay behind panel */}
               <div className={`absolute inset-0 bg-black/10 transition-opacity duration-700 z-10 pointer-events-none group-hover:opacity-100 ${activeBookId === String(book.id) ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
