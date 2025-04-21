"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NewsCard from "@/components/news-card"
import BreakingNewsBar from "@/components/breaking-news-bar"
import AdPlaceholder from "@/components/ad-placeholder"
import { getLatestNews } from "@/lib/news-service"
import type { NewsItem } from "@/lib/types"
import SearchBar from "@/components/search-bar"
import PopularNewsSidebar from "@/components/popular-news-sidebar"

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const latestNews = await getLatestNews()
        setNews(latestNews)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching news:", error)
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BreakingNewsBar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar value={searchQuery} onChange={handleSearchChange} onClear={handleClearSearch} />
        </div>

        <AdPlaceholder position="top" />

        <div className="flex flex-col lg:flex-row gap-8 my-8">
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">সর্বশেষ সংবাদ</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                      <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                  ))
              ) : news.length > 0 ? (
                news.map((item) => <NewsCard key={item.id} news={item} />)
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-lg text-gray-600">কোন সংবাদ পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/3">
            <PopularNewsSidebar />
          </div>
        </div>

        <AdPlaceholder position="bottom" />
      </div>
    </div>
  )
}
