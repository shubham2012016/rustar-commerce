"use client"

import { Search } from "lucide-react"
import { useState } from "react"

import SearchOverlay from "./search-overlay"

export default function SearchButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-blue-600 hover:text-blue-600 hover:shadow-md active:scale-95"
      >
        <Search className="h-5 w-5" />
      </button>

      <SearchOverlay open={open} onClose={() => setOpen(false)} />
    </> 
  )
}
