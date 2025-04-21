"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { getSearchSuggestions } from "@/lib/search-service"

interface SearchBarProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  className?: string
}

export default function SearchBar({ value, onChange, onClear, className = "" }: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<{ id: string; title: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.trim().length < 2) {
        setSuggestions([])
        return
      }

      setLoading(true)
      try {
        const results = await getSearchSuggestions(value)
        setSuggestions(results)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [value])

  useEffect(() => {
    // Show suggestions when input has value and is focused
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSuggestionClick = (id: string) => {
    router.push(`/news/${id}`)
    setShowSuggestions(false)
    onClear()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value)}`)
      setShowSuggestions(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="সংবাদ খুঁজুন..."
          value={value}
          onChange={onChange}
          onFocus={() => setShowSuggestions(true)}
          className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && value.trim().length >= 2 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {loading ? (
            <div className="p-3 text-center text-gray-500">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-1">অনুসন্ধান করা হচ্ছে...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion.id)}
                >
                  <div className="flex items-center">
                    <Search size={14} className="text-gray-400 mr-2 flex-shrink-0" />
                    <span className="line-clamp-1">{suggestion.title}</span>
                  </div>
                </li>
              ))}
              <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-blue-600 font-medium text-center border-t border-gray-200">
                <button onClick={handleSubmit} className="w-full text-center">
                  "{value}" এর জন্য সব ফলাফল দেখুন
                </button>
              </li>
            </ul>
          ) : (
            <div className="p-3 text-center text-gray-500">কোন ফলাফল পাওয়া যায়নি</div>
          )}
        </div>
      )}
    </div>
  )
}
