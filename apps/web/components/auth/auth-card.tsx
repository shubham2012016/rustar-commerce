"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface AuthCardProps {
  children: ReactNode
  className?: string
}

export default function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl",
        className
      )}
    >
      {children}
    </div>
  )
}
