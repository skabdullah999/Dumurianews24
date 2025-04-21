"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { getNewsById } from "@/lib/news-service"
import type { NewsItem } from "@/lib/types"
import AdPlaceholder from "@/components/ad-placeholder"
import CommentSection from "@/components/comment-section"
import { formatDate } from "@/lib/utils"

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!params.id) return

      try {
        const newsItem = await getNewsById(params.id as string)
        if (newsItem) {
          setNews(newsItem)
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching news detail:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsDetail()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="w-full h-72 bg-gray-300 rounded-md mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">সংবাদটি পাওয়া যায়নি</h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            হোমপেজে ফিরে যান
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{news.title}</h1>
        <div className="flex items-center text-gray-600 text-sm mb-6">
          <span>{news.category}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(news.date)}</span>
          <span className="mx-2">•</span>
          <span>{news.author}</span>
        </div>

        <AdPlaceholder position="top" />

        <div className="relative w-full h-72 md:h-96 my-6">
          <Image src={news.image || "/placeholder.svg"} alt={news.title} fill className="object-cover rounded-lg" />
        </div>

        <div className="prose prose-lg max-w-none">
          {news.content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <AdPlaceholder position="bottom" className="my-8" />

        <CommentSection newsId={news.id} />
      </div>
    </div>
  )
}
