"use client"

import { useState } from "react"
import clsx from "clsx"

import DescriptionTab from "./DescriptionTab"
import FeaturesTab from "./FeaturesTab"
import HowToUseTab from "./UsageTab"
import SpecificationsTab from "./SpecificationsTab"

const TABS = [
  "Description",
  "Features",
  "Specifications",
  "How to Use",
] as const

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState<
    (typeof TABS)[number]
  >("Description")

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "rounded-full px-5 py-3 text-sm font-semibold transition-all",
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Description" && <DescriptionTab />}
      {activeTab === "Features" && <FeaturesTab />}
      {activeTab === "Specifications" && <SpecificationsTab />}
      {activeTab === "How to Use" && <HowToUseTab />}
    </section>
  )
}