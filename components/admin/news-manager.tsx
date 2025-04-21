"use client"

import { useEffect, useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import { deleteNews, getAllNews } from "@/lib/news-service"
import type { NewsItem } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface NewsManagerProps {
  onEdit: (news: NewsItem) => void
  onCreate: () => void
}

export default function NewsManager({ onEdit, onCreate }: NewsManagerProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const allNews = await getAllNews()
        setNews(allNews)
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        await deleteNews(id)
        setNews(news.filter((item) => item.id !== id))
      } catch (error) {
        console.error("Error deleting news:", error)
      }
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">সংবাদ তালিকা</h2>
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="border rounded-md p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">সংবাদ তালিকা</h2>
        <button
          onClick={onCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          নতুন সংবাদ
        </button>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">কোন সংবাদ পাওয়া যায়নি</p>
          <button onClick={onCreate} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            প্রথম সংবাদ যোগ করুন
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="border rounded-md p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-lg">{item.title}</h3>
                  <div className="flex text-sm text-gray-500 mt-1">
                    <span>{item.category}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(item.date)}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="সম্পাদনা করুন"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className={`p-1 rounded ${
                      deleteConfirm === item.id ? "bg-red-100 text-red-600" : "text-red-600 hover:bg-red-100"
                    }`}
                    title={deleteConfirm === item.id ? "নিশ্চিত করুন" : "মুছে ফেলুন"}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mt-2 line-clamp-2">{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
