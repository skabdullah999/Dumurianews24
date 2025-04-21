"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { addCategory, deleteCategory, getCategories, updateCategory } from "@/lib/news-service"
import type { Category } from "@/lib/types"

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setCategories(getCategories())
  }, [])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCategory.trim()) {
      setError("ক্যাটাগরির নাম দিন")
      return
    }

    setError("")
    setLoading(true)

    try {
      const category = await addCategory(newCategory)
      setCategories([...categories, category])
      setNewCategory("")
    } catch (error) {
      console.error("Error adding category:", error)
      setError("ক্যাটাগরি যোগ করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCategory = async (id: string) => {
    if (!editName.trim()) {
      setError("ক্যাটাগরির নাম দিন")
      return
    }

    setError("")
    setLoading(true)

    try {
      await updateCategory(id, editName)
      setCategories(categories.map((cat) => (cat.id === id ? { ...cat, name: editName } : cat)))
      setEditingId(null)
    } catch (error) {
      console.error("Error updating category:", error)
      setError("ক্যাটাগরি আপডেট করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত যে আপনি এই ক্যাটাগরিটি মুছতে চান?")) {
      try {
        await deleteCategory(id)
        setCategories(categories.filter((cat) => cat.id !== id))
      } catch (error) {
        console.error("Error deleting category:", error)
        setError("ক্যাটাগরি মুছতে সমস্যা হয়েছে")
      }
    }
  }

  const startEditing = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.name)
    setError("")
  }

  const cancelEditing = () => {
    setEditingId(null)
    setError("")
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">ক্যাটাগরি ব্যবস্থাপনা</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleAddCategory} className="flex mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="নতুন ক্যাটাগরির নাম"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          যোগ করুন
        </button>
      </form>

      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-4">কোন ক্যাটাগরি নেই</p>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
              {editingId === category.id ? (
                <div className="flex flex-1 items-center">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleUpdateCategory(category.id)}
                    disabled={loading}
                    className="ml-2 p-1 text-green-600 hover:bg-green-100 rounded"
                    title="সংরক্ষণ করুন"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="ml-1 p-1 text-gray-600 hover:bg-gray-100 rounded"
                    title="বাতিল করুন"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{category.name}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => startEditing(category)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="সম্পাদনা করুন"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
