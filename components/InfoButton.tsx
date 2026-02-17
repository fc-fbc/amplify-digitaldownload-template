"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HelpCircle } from "lucide-react"

interface InfoButtonProps {
  content: React.ReactNode
}

export default function InfoButton({ content }: InfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full bg-[#81D4FA] text-[#0288d1] hover:bg-[#81D4FA]/90"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">More information</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 text-sm bg-white">
        <div>{content}</div>
      </PopoverContent>
    </Popover>
  )
}
