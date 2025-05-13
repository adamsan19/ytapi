"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Menu,
  MailsIcon as Notifications,
  CircleIcon as AccountCircle,
  Mic,
  VideoIcon as VideoLibrary,
  History,
  WatchIcon as WatchLater,
  ThumbsUpIcon as ThumbUp,
  Settings,
  HelpCircle,
  ReplyIcon as Feedback,
  Moon,
  Sun,
  Film,
  Flame,
  TrendingUp,
} from "lucide-react"
import type { VideoItem } from "@/lib/types"
import CinematicLoader from "@/components/cinematic-loader"

export default function HomePage() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true) // Always start with dark mode for cinematic feel
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setInitialLoading(false)
      fetchVideos()
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/list?page=${page}&per_page=12`)
      const data = await response.json()

      if (data.status === 200) {
        setVideos(data.result)
        setTotalPages(Math.ceil(data.total / data.per_page))
      }
    } catch (error) {
      console.error("Error fetching videos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (data.status === 200) {
        setVideos(data.result)
        setPage(1)
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Error searching videos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  if (initialLoading) {
    return <CinematicLoader />
  }

  return (
    <>
      {/* App Bar */}
      <header className="md-app-bar">
        <div className="md-app-bar-content">
          <div className="flex items-center">
            <button className="md-icon-button mr-2" onClick={toggleDrawer} aria-label="Menu">
              <Menu size={24} />
            </button>
            <h1 className="md-app-bar-title">
              <Film size={28} className="text-red-700" />
              <span className="hidden sm:inline">CineTube</span>
            </h1>
          </div>

          <form onSubmit={handleSearch} className="md-search">
            <input
              ref={searchInputRef}
              type="text"
              className="md-search-input"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="md-search-icon">
              <Search size={20} />
            </div>
          </form>

          <div className="md-app-bar-actions">
            <button className="md-icon-button hidden sm:flex" onClick={focusSearch} aria-label="Voice search">
              <Mic size={24} />
            </button>
            <button className="md-icon-button" onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button className="md-icon-button hidden sm:flex" aria-label="Notifications">
              <Notifications size={24} />
            </button>
            <button className="md-icon-button" aria-label="Account">
              <AccountCircle size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Drawer */}
      <div className={`md-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="md-drawer-header">
          <h2 className="md-app-bar-title">
            <Film size={28} />
            <span>CineTube</span>
          </h2>
        </div>
        <div className="md-drawer-content">
          <div className="md-drawer-item">
            <div className="md-drawer-item-icon">
              <Film size={24} />
            </div>
            <div className="md-drawer-item-text">Home</div>
          </div>
          <div className="md-drawer-item">
            <div className="md-drawer-item-icon">
              <TrendingUp size={24} />
            </div>
            <div className="md-drawer-item-text">Trending</div>
          </div>
          <div className="md-drawer-item">
            <div className="md-drawer-item-icon">
              <Flame size={24} />
            </div>
            <div className="md-drawer-item-text">Popular</div>
          </div>
          <div className="md-drawer-item">
            <div className="md-drawer-item-icon">
              <VideoLibrary size={24} />
            </div>
            <div className="md-drawer-item-text">Library</div>
          </div>
          <div className="md-drawer-item">
            <div className="md-drawer-item-icon">
              <History size={24} />
            </div>
            <div className="md-drawer-item-text">History</div>
          </div>
          <div className="md-drawer-item">
            <div className="md-drawer-item-icon">
              <WatchLater size={24} />
            </div>
            <div className="md-drawer-item-text">Watch Later</div>
          </div>
          <div className="md-drawer-item">
            <div className="md-drawer-item-icon">
              <ThumbUp size={24} />
            </div>
            <div className="md-drawer-item-text">Liked Videos</div>
          </div>

          <div className="md-drawer-divider"></div>

          <div className="md-drawer-item">
            <div className="md-drawer-item-icon">
              <Settings size={24} />
            </div>
            <div className="md-drawer-item-text">Settings</div>
          </div>
          <div className="md-drawer-item">
            <div className="md-drawer-item-icon">
              <HelpCircle size={24} />
            </div>
            <div className="md-drawer-item-text">Help</div>
          </div>
          <div className="md-drawer-item">
            <div className="md-drawer-item-icon">
              <Feedback size={24} />
            </div>
            <div className="md-drawer-item-text">Send Feedback</div>
          </div>

          <div className="md-drawer-divider"></div>

          <div className="md-drawer-item" onClick={toggleDarkMode}>
            <div className="md-drawer-item-icon">{darkMode ? <Sun size={24} /> : <Moon size={24} />}</div>
            <div className="md-drawer-item-text">{darkMode ? "Light Mode" : "Dark Mode"}</div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className={`md-backdrop ${drawerOpen ? "open" : ""}`} onClick={toggleDrawer}></div>

      {/* Main Content */}
      <main className="md-main-content">
        <div className="md-container">
          {/* Category Chips */}
          <div className="mb-6 overflow-x-auto whitespace-nowrap pb-2">
            <div className="md-chip md-chip-selected">All</div>
            <div className="md-chip">Action</div>
            <div className="md-chip">Drama</div>
            <div className="md-chip">Thriller</div>
            <div className="md-chip">Comedy</div>
            <div className="md-chip">Sci-Fi</div>
            <div className="md-chip">Horror</div>
            <div className="md-chip">Documentary</div>
            <div className="md-chip">Animation</div>
          </div>

          {/* Videos Grid */}
          {loading ? (
            <div className="md-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="md-card">
                  <div className="md-card-media md-skeleton"></div>
                  <div className="md-card-content">
                    <div className="h-4 md-skeleton w-3/4 mb-2"></div>
                    <div className="h-4 md-skeleton w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-film text-4xl mb-4 opacity-50 text-red-800"></i>
              <p className="text-lg">No videos found. Try searching for something else!</p>
            </div>
          ) : (
            <div className="md-grid">
              {videos.map((video) => (
                <Link href={`/watch/${video.filecode}`} key={video.filecode} className="md-card">
                  <div className="md-card-media">
                    <Image
                      src={video.splash_img || `/placeholder.svg?height=180&width=320`}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="md-badge">{video.length}</div>
                    <div className="md-quality-badge">HD</div>
                  </div>
                  <div className="md-card-content">
                    <h3 className="md-card-title">{video.title}</h3>
                    <div className="md-card-subtitle">
                      <span className="md-views-badge">
                        <i className="fas fa-eye text-red-800"></i>
                        {video.views} views
                      </span>
                      <span>{video.uploaded}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {videos.length > 0 && (
            <div className="md-pagination">
              <button
                className="md-pagination-button"
                onClick={handlePrevPage}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="md-pagination-text">
                Page {page} of {totalPages}
              </div>
              <button
                className="md-pagination-button"
                onClick={handleNextPage}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* FAB */}
      <button className="md-fab" aria-label="Upload video">
        <i className="fas fa-film"></i>
      </button>
    </>
  )
}
