"use client"

import { useEffect, useState } from "react"
import { ImageFallback } from "@/components/ui/image-fallback"

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-[#2A2A2A] text-gray-200">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-700 pb-8">
          <div>
            <ImageFallback
              src="/Filmbank_CMYK_Blue_Dark Grey_Art 1.png" 
              alt="Filmbankmedia Logo"
              width={280}
              height={70}
              className="w-auto h-auto max-w-full"
              priority
              fallbackClassName="w-full h-[70px] bg-gray-700 animate-pulse rounded"
            />
          </div>
          <div className="text-right md:text-right">
            <p className="text-sm font-medium">Filmbank Distributors Limited © {currentYear}. All Rights Reserved.</p>
          </div>
        </div>

        <div className="pt-6">
          <p className="text-xs leading-relaxed text-gray-400 max-w-4xl">
          This website is operated by Filmbank Distributors Ltd. a company incorporated under the laws of England and Wales with company number 1021212 and with its registered address at Warner House, 98 Theobald's Road, London, WC1X 8WB, England.  Vat Reg No: GB 446 029455.
          </p>
        </div>
      </div>
    </footer>
  )
}
