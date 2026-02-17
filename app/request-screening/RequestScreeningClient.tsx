"use client";

import MultiStepForm from "./Multiform/MultiStepForm"
import Header from "@/components/Header"

export default function RequestScreeningClient() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <MultiStepForm />
      </div>
    </main>
  )
}
