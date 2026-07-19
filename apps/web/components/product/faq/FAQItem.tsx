"use client"

import { useState } from "react"

import { ChevronDown } from "lucide-react"

interface FAQItemProps {
  question: string
  answer: string
}

export default function FAQItem({
  question,
  answer,
}: FAQItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <span className="text-lg font-semibold text-slate-900">
          {question}
        </span>

        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-6 pb-6 text-slate-600 leading-7">
          {answer}
        </div>
      )}
    </div>
  )
}