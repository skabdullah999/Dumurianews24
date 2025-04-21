"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminTabs from "@/components/admin/admin-tabs"
import NewsManager from "@/components/admin/news-manager"
import NewsEditor from "@/components/admin/news-editor"
import CategoryManager from "@/components/admin/category-manager"
import type { NewsItem } from "@/lib/types"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("news")
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication on client-side
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("bengali_news_auth_token")
        if (!authData) {
          router.push("/admin")
          return
        }
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error checking authentication:", error)
        router.push("/admin")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleEditNews = (news: NewsItem) => {
    setSelectedNews(news)
    setActiveTab("editor")
  }

  const handleCreateNews = () => {
    setSelectedNews(null)
    setActiveTab("editor")
  }

  const handleBackToList = () => {
    setSelectedNews(null)
    setActiveTab("news")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Router will redirect, no need to render anything
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">অ্যাডমিন ড্যাশবোর্ড</h1>

        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          {activeTab === "news" && <NewsManager onEdit={handleEditNews} onCreate={handleCreateNews} />}

          {activeTab === "editor" && <NewsEditor news={selectedNews} onBack={handleBackToList} />}

          {activeTab === "categories" && <CategoryManager />}
        </div>
      </div>
    </div>
  )
}
