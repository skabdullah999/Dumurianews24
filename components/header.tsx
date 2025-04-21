"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, ChevronRight, Home, User, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { getCategories } from "@/lib/news-service"
import { supabase } from "@/lib/supabase"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check authentication status and fetch categories
    const initializeHeader = async () => {
      try {
        // Check auth status
        const { data } = await supabase.auth.getSession()
        setIsLoggedIn(!!data.session)

        // Fetch categories
        const fetchedCategories = await getCategories()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Error initializing header:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeHeader()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Close menu when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    // Add event listener when menu is open
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ডুমুরিয়া নিউজ ২৪
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              হোম
            </Link>
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`} className="text-gray-700 hover:text-blue-600">
                {category.name}
              </Link>
            ))}
            {isLoggedIn && (
              <>
                <Link href="/admin/dashboard" className="text-gray-700 hover:text-blue-600">
                  অ্যাডমিন
                </Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600">
                  লগআউট
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation - Sliding from right */}
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)} />

            {/* Sliding Menu */}
            <div
              ref={menuRef}
              className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out"
              style={{ transform: isMenuOpen ? "translateX(0)" : "translateX(100%)" }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold text-lg text-blue-600">মেনু</h2>
                <button onClick={() => setIsMenuOpen(false)} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>

              <nav className="py-4">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Home className="w-5 h-5 mr-3" />
                      হোম
                      <ChevronRight className="w-5 h-5 ml-auto" />
                    </Link>
                  </li>

                  <li className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">বিভাগসমূহ</li>

                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/category/${category.id}`}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                        <ChevronRight className="w-5 h-5 ml-auto" />
                      </Link>
                    </li>
                  ))}

                  {isLoggedIn && (
                    <>
                      <li className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase mt-4">অ্যাডমিন</li>
                      <li>
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="w-5 h-5 mr-3" />
                          অ্যাডমিন প্যানেল
                          <ChevronRight className="w-5 h-5 ml-auto" />
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsMenuOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          লগআউট
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
