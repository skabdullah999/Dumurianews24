"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import NewsCard from "@/components/news-card"
import BreakingNewsBar from "@/components/breaking-news-bar"
import AdPlaceholder from "@/components/ad-placeholder"
import { searchNews } from "@/lib/search-service"
import type { NewsItem } from "@/lib/types"
import SearchBar from "@/components/search-bar"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const searchResults = await searchNews(query)
        setResults(searchResults)
      } catch (error) {
        console.error("Error searching news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          {query ? `"${query}" এর জন্য অনুসন্ধান ফলাফল` : "অনুসন্ধান করুন"}
        </h1>

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
          ) : results.length > 0 ? (
            results.map((item) => <NewsCard key={item.id} news={item} />)
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-gray-600">
                {query ? `"${query}" এর জন্য কোন সংবাদ পাওয়া যায়নি` : "অনুসন্ধান করতে উপরের বাক্সে লিখুন"}
              </p>
            </div>
          )}
        </div>

        <AdPlaceholder position="bottom" />
      </div>
    </div>
  )
}
