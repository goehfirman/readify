"use client";
import React, { useState } from "react";
import { useProfile } from "@/lib/profile-context";

interface NamePromptModalProps {
  onClose?: () => void;
  isCompulsory?: boolean;
}

export default function NamePromptModal({ onClose, isCompulsory = false }: NamePromptModalProps) {
  const { updateProfile, profile } = useProfile();
  const [inputName, setInputName] = useState("");

  const saveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      updateProfile({ name: inputName.trim() });
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 transition-all animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md" 
        onClick={() => !isCompulsory && onClose?.()}
      ></div>
      
      <div className="bg-white rounded-[40px] border-8 border-[#FFB347] p-8 md:p-12 max-w-[440px] w-full relative z-10 shadow-[0_30px_70px_rgba(0,0,0,0.3)] animate-bounce-in">
        
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#F0F8FF] rounded-3xl border-4 border-[#FFB347] flex items-center justify-center animate-bounce">
            <span className="text-4xl">👋</span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-[#5AAFD1] tracking-tighter mb-4 text-center leading-tight">
          Halo Petualang!
        </h2>
        
        <p className="text-xs md:text-sm font-bold text-[#666666] mb-8 leading-relaxed text-center">
          Siapa namamu? Beritahu kami agar petualangan membacamu jadi lebih seru dan personal!
        </p>
        
        <form onSubmit={saveName} className="space-y-5">
          <div className="relative group">
            <input 
              type="text" 
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Ketik namamu di sini..."
              autoFocus
              className="w-full bg-[#F0F8FF] border-4 border-[#E2E8F0] rounded-[24px] px-8 py-4 text-base font-black text-[#333333] placeholder:text-[#A0AEC0] outline-none focus:border-[#FFB347] transition-all shadow-inner text-center focus:scale-[1.02]"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-rounded text-[#A0AEC0] group-focus-within:text-[#FFB347] transition-colors">edit</span>
          </div>
          
          <button 
            type="submit" 
            disabled={!inputName.trim()}
            className={`w-full py-5 rounded-[24px] font-black text-lg tracking-[0.1em] transition-all uppercase ${
              inputName.trim() 
              ? 'bg-[#FFB347] text-white shadow-[0_8px_0_#E69A2E] hover:-translate-y-1 hover:shadow-[0_12px_0_#E69A2E] active:translate-y-1 active:shadow-none' 
              : 'bg-[#E2E8F0] text-[#A0AEC0] cursor-not-allowed'
            }`}
          >
            Mulai Petualangan! 🚀
          </button>
        </form>

        {!isCompulsory && (
          <button 
            onClick={onClose}
            className="mt-6 w-full text-center text-[#A0AEC0] font-black text-[10px] uppercase tracking-widest hover:text-[#5AAFD1] transition-colors"
          >
            Lewati untuk Sekarang
          </button>
        )}
      </div>
    </div>
  );
}
