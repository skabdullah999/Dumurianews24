import { supabase } from "./supabase"
import type { NewsItem } from "./types"

// Mock data for fallback when database is not available
const mockNewsData = [
  {
    id: "1",
    title: "ডুমুরিয়ায় নতুন প্রযুক্তি উদ্যোগ চালু হলো",
    summary: "ডুমুরিয়ায় ডিজিটাল প্রযুক্তি খাতে নতুন উদ্যোগ চালু করা হয়েছে।",
    content: "ডুমুরিয়ায় ডিজিটাল প্রযুক্তি খাতে নতুন উদ্যোগ চালু করা হয়েছে।",
    image: "/placeholder.svg?height=600&width=800",
    category: "technology",
    categoryId: "technology",
    date: new Date().toISOString(),
    author: "রহিম আহমেদ",
    isBreaking: true,
  },
  {
    id: "2",
    title: "ডুমুরিয়া ক্রিকেট দল নতুন কোচ পেল",
    summary: "ডুমুরিয়া ক্রিকেট দলের জন্য নতুন কোচ নিয়োগ দেওয়া হয়েছে।",
    content: "ডুমুরিয়া ক্রিকেট দলের জন্য নতুন কোচ নিয়োগ দেওয়া হয়েছে।",
    image: "/placeholder.svg?height=600&width=800",
    category: "sports",
    categoryId: "sports",
    date: new Date().toISOString(),
    author: "করিম খান",
    isBreaking: false,
  },
  {
    id: "3",
    title: "ডুমুরিয়ায় নতুন মেট্রো রেল লাইন উদ্বোধন",
    summary: "ডুমুরিয়ায় যানজট কমাতে নতুন মেট্রো রেল লাইন উদ্বোধন করা হয়েছে।",
    content: "ডুমুরিয়ায় যানজট কমাতে নতুন মেট্রো রেল লাইন উদ্বোধন করা হয়েছে।",
    image: "/placeholder.svg?height=600&width=800",
    category: "national",
    categoryId: "national",
    date: new Date().toISOString(),
    author: "নাজমুল হাসান",
    isBreaking: true,
  },
]

/**
 * Search for news items by query
 */
export async function searchNews(query: string): Promise<NewsItem[]> {
  if (!query.trim()) return []

  try {
    // Try to search in the database
    const { data, error } = await supabase
      .from("news")
      .select("*, categories:category_id(name)")
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
      .order("date", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error searching news:", error)

      // Fallback to mock data if database error
      return mockNewsData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.summary.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // If no results, return empty array
    if (!data || data.length === 0) {
      return []
    }

    // Map the data to the NewsItem format
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image,
      category: item.categories?.name || "Uncategorized",
      categoryId: item.category_id,
      date: item.date,
      author: item.author,
      isBreaking: item.is_breaking,
    }))
  } catch (error) {
    console.error("Error searching news:", error)

    // Fallback to mock data
    return mockNewsData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.summary.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase()),
    )
  }
}

/**
 * Get search suggestions for autocomplete
 */
export async function getSearchSuggestions(query: string): Promise<{ id: string; title: string }[]> {
  if (!query.trim()) return []

  try {
    // Try to get suggestions from the database
    const { data, error } = await supabase
      .from("news")
      .select("id, title")
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
      .order("date", { ascending: false })
      .limit(5)

    if (error) {
      console.error("Error getting search suggestions:", error)

      // Fallback to mock data if database error
      return mockNewsData
        .filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.summary.toLowerCase().includes(query.toLowerCase()),
        )
        .map((item) => ({ id: item.id, title: item.title }))
    }

    // If no results, return empty array
    if (!data || data.length === 0) {
      return []
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
    }))
  } catch (error) {
    console.error("Error getting search suggestions:", error)

    // Fallback to mock data
    return mockNewsData
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.summary.toLowerCase().includes(query.toLowerCase()),
      )
      .map((item) => ({ id: item.id, title: item.title }))
  }
}
