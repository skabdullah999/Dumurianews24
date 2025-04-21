"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import NewsCard from "@/components/news-card"
import BreakingNewsBar from "@/components/breaking-news-bar"
import AdPlaceholder from "@/components/ad-placeholder"
import { getNewsByCategory, getCategories } from "@/lib/news-service"
import type { NewsItem } from "@/lib/types"
import SearchBar from "@/components/search-bar"

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<NewsItem[]>([])
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchCategoryNews = async () => {
      if (!params.id) return

      try {
        // Get category name
        const categories = await getCategories()
        const category = categories.find((cat) => cat.id === params.id)

        if (!category) {
          router.push("/")
          return
        }

        setCategoryName(category.name)

        // Get news for this category
        const categoryNews = await getNewsByCategory(params.id as string)
        setNews(categoryNews)
      } catch (error) {
        console.error("Error fetching category news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryNews()
  }, [params.id, router])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <BreakingNewsBar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{categoryName}</h1>

        <div className="mb-8">
          <SearchBar value={searchQuery} onChange={handleSearchChange} onClear={handleClearSearch} />
        </div>

        <AdPlaceholder position="top" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              ))
          ) : filteredNews.length > 0 ? (
            filteredNews.map((item) => <NewsCard key={item.id} news={item} />)
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-gray-600">এই বিভাগে কোন সংবাদ পাওয়া যায়নি</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                হোমপেজে ফিরে যান
              </button>
            </div>
          )}
        </div>

        <AdPlaceholder position="bottom" />
      </div>
    </div>
  )
}
