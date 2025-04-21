import Image from "next/image"
import Link from "next/link"
import type { NewsItem } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface NewsCardProps {
  news: NewsItem
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image src={news.image || "/placeholder.svg"} alt={news.title} fill className="object-cover" />
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">{news.category}</div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{news.title}</h2>

        <p className="text-gray-600 mb-3 line-clamp-2">{news.summary}</p>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{formatDate(news.date)}</span>

          <Link href={`/news/${news.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            আরও পড়ুন &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
