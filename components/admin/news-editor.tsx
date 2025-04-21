"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, ImageIcon } from "lucide-react"
import { addNews, updateNews, getCategories } from "@/lib/news-service"
import type { NewsItem } from "@/lib/types"
import { supabase } from "@/lib/supabase"

interface NewsEditorProps {
  news: NewsItem | null
  onBack: () => void
}

export default function NewsEditor({ news, onBack }: NewsEditorProps) {
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [image, setImage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [author, setAuthor] = useState("")
  const [isBreaking, setIsBreaking] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories)

      if (fetchedCategories.length > 0 && !categoryId) {
        setCategoryId(fetchedCategories[0].id)
      }
    }

    fetchCategories()
  }, [categoryId])

  useEffect(() => {
    if (news) {
      setTitle(news.title)
      setSummary(news.summary)
      setContent(news.content)
      setCategoryId(news.categoryId)
      setImage(news.image)
      setImagePreview(news.image)
      setAuthor(news.author)
      setIsBreaking(news.isBreaking || false)
    } else {
      // Default values for new article
      setTitle("")
      setSummary("")
      setContent("")
      setImage("")
      setImagePreview("")
      setAuthor("")
      setIsBreaking(false)
    }
  }, [news])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return image

    try {
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `news/${fileName}`

      const { error: uploadError } = await supabase.storage.from("media").upload(filePath, imageFile)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from("media").getPublicUrl(filePath)
      return data.publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!title || !summary || !content || !categoryId || !author) {
      setError("সব ফিল্ড পূরণ করুন")
      return
    }

    setLoading(true)

    try {
      // Upload image if there's a new one
      let imageUrl = image
      if (imageFile) {
        imageUrl = await uploadImage()
      }

      if (news) {
        await updateNews({
          ...news,
          title,
          summary,
          content,
          categoryId,
          image: imageUrl,
          author,
          isBreaking,
        })
      } else {
        await addNews({
          title,
          summary,
          content,
          categoryId,
          image: imageUrl,
          author,
          date: new Date().toISOString(),
          isBreaking,
        })
      }

      setSuccess(true)

      // Reset form if creating new article
      if (!news) {
        setTitle("")
        setSummary("")
        setContent("")
        setImage("")
        setImagePreview("")
        setImageFile(null)
        setAuthor("")
        setIsBreaking(false)
      }

      // Auto navigate back after success
      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (error) {
      console.error("Error saving news:", error)
      setError("সংবাদ সংরক্ষণ করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 p-1 text-gray-600 hover:bg-gray-100 rounded-full" title="ফিরে যান">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold">{news ? "সংবাদ সম্পাদনা করুন" : "নতুন সংবাদ যোগ করুন"}</h2>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          সংবাদ সফলভাবে সংরক্ষিত হয়েছে। আপনাকে তালিকায় ফিরিয়ে নেওয়া হচ্ছে...
        </div>
      )}

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            শিরোনাম
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="সংবাদের শিরোনাম লিখুন"
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            সারসংক্ষেপ
          </label>
          <textarea
            id="summary"
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="সংবাদের সারসংক্ষেপ লিখুন (২-৩ লাইন)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              ক্যাটাগরি
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">ক্যাটাগরি নির্বাচন করুন</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              লেখক
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="লেখকের নাম"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ছবি</label>

          {imagePreview && (
            <div className="mb-3">
              <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex items-center">
            <label className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
              <ImageIcon className="w-5 h-5 mr-2" />
              ছবি আপলোড করুন
              <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG, or GIF ফাইল আপলোড করুন। সর্বোচ্চ সাইজ 5MB।</p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isBreaking"
            checked={isBreaking}
            onChange={(e) => setIsBreaking(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isBreaking" className="ml-2 block text-sm text-gray-700">
            ব্রেকিং নিউজ হিসেবে প্রকাশ করুন
          </label>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            সম্পূর্ণ সংবাদ
          </label>
          <textarea
            id="content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="সম্পূর্ণ সংবাদ লিখুন"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-50"
            disabled={loading}
          >
            বাতিল করুন
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </div>
  )
}
