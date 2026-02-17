"use client";

import { useTranslation } from "@/lib/hooks/useTranslation"
import { ImageFallback } from "@/components/ui/image-fallback"

export default function Header() {
  const { t } = useTranslation();
  
  return (
    <header className="bg-[#2A2A2A] shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap">
        <div className="w-[50%] sm:w-[25%]">
          {/* Use the ImageFallback component for better image loading */}
          <ImageFallback 
            src="/Filmbank_CMYK_Blue_Dark Grey_Art 1.png" 
            alt="Filmbankmedia Logo" 
            width={250} 
            height={50} 
            className="w-auto h-auto max-w-full" 
            priority 
            fallbackClassName="w-full h-[50px] bg-gray-700 animate-pulse rounded"
          />
        </div>
        <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#CFCDC5]">{t('header.title')}</h2>
        </div>
      </div>
    </header>
  )
}
