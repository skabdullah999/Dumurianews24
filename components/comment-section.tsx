"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { addComment, getComments } from "@/lib/comment-service"
import type { Comment } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface CommentSectionProps {
  newsId: string
}

export default function CommentSection({ newsId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getComments(newsId)
        setComments(fetchedComments)
      } catch (error) {
        console.error("Error fetching comments:", error)
      }
    }

    fetchComments()
  }, [newsId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !newComment.trim()) {
      setError("নাম এবং মন্তব্য উভয়ই প্রয়োজন")
      return
    }

    setError("")
    setLoading(true)

    try {
      const newCommentObj = await addComment(newsId, name, newComment)
      setComments([...comments, newCommentObj])
      setNewComment("")
      setName("")
    } catch (error) {
      console.error("Error adding comment:", error)
      setError("মন্তব্য যোগ করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-gray-800 mb-4">মন্তব্য ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            আপনার নাম
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="আপনার নাম লিখুন"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            আপনার মন্তব্য
          </label>
          <textarea
            id="comment"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="আপনার মন্তব্য লিখুন"
          />
        </div>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
        >
          {loading ? "পাঠানো হচ্ছে..." : "মন্তব্য পাঠান"}
        </button>
      </form>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">{comment.name}</h4>
                <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
              </div>
              <p className="mt-2 text-gray-700">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 italic">এখনো কোন মন্তব্য নেই। প্রথম মন্তব্যকারী হোন!</p>
        )}
      </div>
    </div>
  )
}
