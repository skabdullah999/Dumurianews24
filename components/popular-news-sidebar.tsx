"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getLatestNews } from "@/lib/news-service"
import type { NewsItem } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import AdPlaceholder from "./ad-placeholder"

export default function PopularNewsSidebar() {
  const [popularNews, setPopularNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPopularNews = async () => {
      try {
        // For demo purposes, we're using latest news as popular news
        const news = await getLatestNews()
        setPopularNews(news.slice(0, 3))
      } catch (error) {
        console.error("Error fetching popular news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularNews()
  }, [])

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">জনপ্রিয় সংবাদ</h3>

      {loading
        ? Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="animate-pulse flex space-x-3">
                <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))
        : popularNews.map((news) => (
            <div key={news.id} className="flex space-x-3">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={news.image || "/placeholder.svg?height=80&width=80"}
                  alt={news.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <Link href={`/news/${news.id}`} className="font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
                  {news.title}
                </Link>
                <p className="text-xs text-gray-500 mt-1">{formatDate(news.date)}</p>
              </div>
            </div>
          ))}

      <AdPlaceholder position="sidebar" />
    </div>
  )
}
