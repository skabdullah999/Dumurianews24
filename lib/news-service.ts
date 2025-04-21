import { supabase } from "./supabase"
import type { NewsItem, Category } from "./types"

// News Service Functions
// Fix the getLatestNews function similarly
export async function getLatestNews(): Promise<NewsItem[]> {
  try {
    // First, get the latest news items
    const { data, error } = await supabase.from("news").select("*").order("date", { ascending: false }).limit(5)

    if (error) {
      console.error("Error fetching latest news:", error)
      return []
    }

    // If no news, return empty array
    if (!data || data.length === 0) {
      return []
    }

    // Get all categories to map category_id to category name
    const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*")

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      return []
    }

    // Create a map of category_id to category name
    const categoryMap = new Map(categoriesData.map((category) => [category.id, category.name]))

    // Map the news data to the NewsItem format
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image,
      category: categoryMap.get(item.category_id) || "Uncategorized",
      categoryId: item.category_id,
      date: item.date,
      author: item.author,
      isBreaking: item.is_breaking,
    }))
  } catch (error) {
    console.error("Error fetching latest news:", error)
    return []
  }
}

// Fix the getAllNews function similarly
export async function getAllNews(): Promise<NewsItem[]> {
  try {
    // First, get all news items
    const { data, error } = await supabase.from("news").select("*").order("date", { ascending: false })

    if (error) {
      console.error("Error fetching all news:", error)
      return []
    }

    // If no news, return empty array
    if (!data || data.length === 0) {
      return []
    }

    // Get all categories to map category_id to category name
    const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*")

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      return []
    }

    // Create a map of category_id to category name
    const categoryMap = new Map(categoriesData.map((category) => [category.id, category.name]))

    // Map the news data to the NewsItem format
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image,
      category: categoryMap.get(item.category_id) || "Uncategorized",
      categoryId: item.category_id,
      date: item.date,
      author: item.author,
      isBreaking: item.is_breaking,
    }))
  } catch (error) {
    console.error("Error fetching all news:", error)
    return []
  }
}

// Fix the getNewsById function similarly
export async function getNewsById(id: string): Promise<NewsItem | null> {
  try {
    // First, get the news item
    const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching news by ID:", error)
      return null
    }

    // Get the category name
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("name")
      .eq("id", data.category_id)
      .single()

    if (categoryError) {
      console.error("Error fetching category:", categoryError)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      summary: data.summary,
      content: data.content,
      image: data.image,
      category: categoryData?.name || "Uncategorized",
      categoryId: data.category_id,
      date: data.date,
      author: data.author,
      isBreaking: data.is_breaking,
    }
  } catch (error) {
    console.error("Error fetching news by ID:", error)
    return null
  }
}

// Fix the getNewsByCategory function similarly
export async function getNewsByCategory(categoryId: string): Promise<NewsItem[]> {
  try {
    // First, get the news items for the category
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("category_id", categoryId)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching news by category:", error)
      return []
    }

    // If no news, return empty array
    if (!data || data.length === 0) {
      return []
    }

    // Get the category name
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("name")
      .eq("id", categoryId)
      .single()

    if (categoryError) {
      console.error("Error fetching category:", categoryError)
      return []
    }

    const categoryName = categoryData?.name || "Uncategorized"

    // Map the news data to the NewsItem format
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image,
      category: categoryName,
      categoryId: item.category_id,
      date: item.date,
      author: item.author,
      isBreaking: item.is_breaking,
    }))
  } catch (error) {
    console.error("Error fetching news by category:", error)
    return []
  }
}

// Fix the getBreakingNews function to not rely on the relationship
export async function getBreakingNews(): Promise<NewsItem[]> {
  try {
    // First, get the breaking news items
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("is_breaking", true)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching breaking news:", error)
      return []
    }

    // If no breaking news, return empty array
    if (!data || data.length === 0) {
      return []
    }

    // Get all categories to map category_id to category name
    const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*")

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      return []
    }

    // Create a map of category_id to category name
    const categoryMap = new Map(categoriesData.map((category) => [category.id, category.name]))

    // Map the news data to the NewsItem format
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image,
      category: categoryMap.get(item.category_id) || "Uncategorized",
      categoryId: item.category_id,
      date: item.date,
      author: item.author,
      isBreaking: item.is_breaking,
    }))
  } catch (error) {
    console.error("Error fetching breaking news:", error)
    return []
  }
}

export async function addNews(newsData: Omit<NewsItem, "id">): Promise<NewsItem | null> {
  try {
    const { data, error } = await supabase
      .from("news")
      .insert({
        title: newsData.title,
        summary: newsData.summary,
        content: newsData.content,
        image: newsData.image,
        category_id: newsData.categoryId,
        author: newsData.author,
        date: new Date().toISOString(),
        is_breaking: newsData.isBreaking || false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding news:", error)
      return null
    }

    // Fetch the category name
    const { data: categoryData } = await supabase.from("categories").select("name").eq("id", data.category_id).single()

    return {
      id: data.id,
      title: data.title,
      summary: data.summary,
      content: data.content,
      image: data.image,
      category: categoryData?.name || "",
      categoryId: data.category_id,
      date: data.date,
      author: data.author,
      isBreaking: data.is_breaking,
    }
  } catch (error) {
    console.error("Error adding news:", error)
    return null
  }
}

export async function updateNews(newsData: NewsItem): Promise<NewsItem | null> {
  try {
    const { data, error } = await supabase
      .from("news")
      .update({
        title: newsData.title,
        summary: newsData.summary,
        content: newsData.content,
        image: newsData.image,
        category_id: newsData.categoryId,
        author: newsData.author,
        is_breaking: newsData.isBreaking,
      })
      .eq("id", newsData.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating news:", error)
      return null
    }

    // Fetch the category name
    const { data: categoryData } = await supabase.from("categories").select("name").eq("id", data.category_id).single()

    return {
      id: data.id,
      title: data.title,
      summary: data.summary,
      content: data.content,
      image: data.image,
      category: categoryData?.name || "",
      categoryId: data.category_id,
      date: data.date,
      author: data.author,
      isBreaking: data.is_breaking,
    }
  } catch (error) {
    console.error("Error updating news:", error)
    return null
  }
}

export async function deleteNews(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("news").delete().eq("id", id)

    if (error) {
      console.error("Error deleting news:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting news:", error)
    return false
  }
}

// Category Service Functions
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function addCategory(name: string): Promise<Category | null> {
  try {
    const id = name.toLowerCase().replace(/\s+/g, "-")

    const { data, error } = await supabase
      .from("categories")
      .insert({
        id,
        name,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding category:", error)
      return null
    }

    return {
      id: data.id,
      name: data.name,
    }
  } catch (error) {
    console.error("Error adding category:", error)
    return null
  }
}

export async function updateCategory(id: string, name: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase.from("categories").update({ name }).eq("id", id).select().single()

    if (error) {
      console.error("Error updating category:", error)
      return null
    }

    return {
      id: data.id,
      name: data.name,
    }
  } catch (error) {
    console.error("Error updating category:", error)
    return null
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.error("Error deleting category:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting category:", error)
    return false
  }
}
