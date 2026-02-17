"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { useTranslation } from '@/lib/hooks/useTranslation'
import { useEffect } from 'react'
import { Locale } from '@/lib/translations'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Language = {
  code: Locale
  name: string
  flag: React.ReactNode
}

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useTranslation();
  
  const languages: Language[] = [
    {
      code: "en",
      name: "English",
      flag: <UKFlag className="h-4 w-6" />,
    },
    {
      code: "de",
      name: "Deutsch",
      flag: <GermanyFlag className="h-4 w-6" />,
    },
  ]

  const selectedLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 px-3 py-2 h-10 bg-[#2A2A2A] text-[#CFCDC5] border-[#444444] hover:bg-[#3A3A3A]"
        >
          {selectedLanguage.flag}
          <span className="hidden sm:inline-block">{selectedLanguage.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] bg-[#2A2A2A] border-[#444444] text-[#CFCDC5]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#3A3A3A]"
            onClick={() => changeLocale(language.code)}
          >
            {language.flag}
            <span>{language.name}</span>
            {selectedLanguage.code === language.code && <Check className="h-4 w-4 ml-auto text-[#0288d1]" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UKFlag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" {...props}>
      <clipPath id="a">
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <clipPath id="b">
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <g clipPath="url(#a)">
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" clipPath="url(#b)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

function GermanyFlag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" {...props}>
      <path d="M0 0h5v3H0z" fill="#000" />
      <path d="M0 1h5v2H0z" fill="#D00" />
      <path d="M0 2h5v1H0z" fill="#FFCE00" />
    </svg>
  )
}
