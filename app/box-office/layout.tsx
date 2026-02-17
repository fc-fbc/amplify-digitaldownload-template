import Image from "next/image"
import type { Metadata } from "next"
import { ImageFallback } from "@/components/ui/image-fallback"

export const metadata: Metadata = {
  title: "Box Office Returns",
  description: "Box Office Returns for German STSL screenings.",
};

export default function BoxOfficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-[#2A2A2A] shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="w-[25%]">
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
          <h2 className="text-2xl font-semibold text-[#CFCDC5]">Box Office Returns</h2>
        </div>
      </header>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  )
}
