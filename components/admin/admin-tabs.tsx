"use client"

import { Newspaper, Edit, Tag } from "lucide-react"

interface AdminTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AdminTabs({ activeTab, setActiveTab }: AdminTabsProps) {
  const tabs = [
    { id: "news", label: "সংবাদ তালিকা", icon: Newspaper },
    { id: "editor", label: "সংবাদ এডিটর", icon: Edit },
    { id: "categories", label: "ক্যাটাগরি", icon: Tag },
  ]

  return (
    <div className="flex flex-wrap border-b border-gray-200">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            disabled={tab.id === "editor" && activeTab === "editor"}
          >
            <Icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
