"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getBreakingNews } from "@/lib/news-service"
import type { NewsItem } from "@/lib/types"

export default function BreakingNewsBar() {
  const [breakingNews, setBreakingNews] = useState<NewsItem[]>([])

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const news = await getBreakingNews()
        setBreakingNews(news)
      } catch (error) {
        console.error("Error fetching breaking news:", error)
      }
    }

    fetchBreakingNews()
  }, [])

  if (breakingNews.length === 0) {
    return null
  }

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4 flex items-center">
        <div className="shrink-0 font-bold mr-4 px-2 py-1 bg-white text-red-600 rounded">ব্রেকিং</div>

        <div className="overflow-hidden relative w-full">
          <div className="animate-marquee whitespace-nowrap">
            {breakingNews.map((news, index) => (
              <Link key={news.id} href={`/news/${news.id}`} className="inline-block mr-8 hover:underline">
                {news.title}
                {index < breakingNews.length - 1 && <span className="mx-4">•</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
