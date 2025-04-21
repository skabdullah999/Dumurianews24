import { supabase } from "./supabase"
import type { Comment } from "./types"

// Comment Service Functions
export async function getComments(newsId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("news_id", newsId)
      .eq("is_approved", true)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching comments:", error)
      return []
    }

    return data.map((item) => ({
      id: item.id,
      newsId: item.news_id,
      name: item.name,
      text: item.text,
      date: item.date,
      isApproved: item.is_approved,
    }))
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export async function getAllComments(): Promise<Comment[]> {
  try {
    const { data, error } = await supabase.from("comments").select("*").order("date", { ascending: false })

    if (error) {
      console.error("Error fetching all comments:", error)
      return []
    }

    return data.map((item) => ({
      id: item.id,
      newsId: item.news_id,
      name: item.name,
      text: item.text,
      date: item.date,
      isApproved: item.is_approved,
    }))
  } catch (error) {
    console.error("Error fetching all comments:", error)
    return []
  }
}

export async function addComment(newsId: string, name: string, text: string): Promise<Comment | null> {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        news_id: newsId,
        name,
        text,
        date: new Date().toISOString(),
        is_approved: true, // Auto-approve for demo purposes
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding comment:", error)
      return null
    }

    return {
      id: data.id,
      newsId: data.news_id,
      name: data.name,
      text: data.text,
      date: data.date,
      isApproved: data.is_approved,
    }
  } catch (error) {
    console.error("Error adding comment:", error)
    return null
  }
}

export async function approveComment(id: string): Promise<Comment | null> {
  try {
    const { data, error } = await supabase.from("comments").update({ is_approved: true }).eq("id", id).select().single()

    if (error) {
      console.error("Error approving comment:", error)
      return null
    }

    return {
      id: data.id,
      newsId: data.news_id,
      name: data.name,
      text: data.text,
      date: data.date,
      isApproved: data.is_approved,
    }
  } catch (error) {
    console.error("Error approving comment:", error)
    return null
  }
}

export async function deleteComment(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("comments").delete().eq("id", id)

    if (error) {
      console.error("Error deleting comment:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting comment:", error)
    return false
  }
}
