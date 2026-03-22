"use client";

import React from "react";
import { COMMON_ICONS } from "@/lib/icons";

interface IconPickerProps {
  onSelect: (svg: string) => void;
  currentSvg?: string;
}

export function IconPicker({ onSelect, currentSvg }: IconPickerProps) {
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-black/40 border border-white/10 rounded-xl mt-2">
      <p className="w-full text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Quick Select Icon</p>
      {COMMON_ICONS.map((icon) => {
        const isActive = currentSvg === icon.svg;
        return (
          <button
            key={icon.name}
            type="button"
            onClick={() => onSelect(icon.svg)}
            title={icon.name}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border ${
              isActive 
                ? "bg-stone-500 border-stone-500 text-white" 
                : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            }`}
          >
            <div 
              className="w-5 h-5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: icon.svg }}
            />
          </button>
        );
      })}
    </div>
  );
}
