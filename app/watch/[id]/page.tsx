"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  MoreVertical,
  Search,
  MailsIcon as Notifications,
  CircleIcon as AccountCircle,
  Film,
  Moon,
  Sun,
} from "lucide-react"
import { useRouter } from "next/navigation"
import CinematicLoader from "@/components/cinematic-loader"

interface VideoDetails {
  title: string
  views: string
  uploaded: string
  length: string
  splash_img: string
  protected_embed: string
  size: string
  filecode: string
}

interface RelatedVideo {
  title: string
  views: string
  uploaded: string
  length: string
  splash_img: string
  filecode: string
}

export default function WatchPage({ params }: { params: { id: string } }) {
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<RelatedVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [videoLoading, setVideoLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setInitialLoading(false)
      fetchVideoDetails()
    }, 1500)

    return () => clearTimeout(timer)
  }, [params.id])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const fetchVideoDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/info?file_code=${params.id}`)
      const data = await response.json()

      if (data.status === 200 && data.result.length > 0) {
        setVideoDetails(data.result[0])

        // Fetch related videos
        const relatedResponse = await fetch(`/api/related?video_id=${params.id}`)
        const relatedData = await response.json()

        if (relatedData.status === 200) {
          setRelatedVideos(relatedData.result)
        }
      }
    } catch (error) {
      console.error("Error fetching video details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayVideo = () => {
    setShowVideo(true)
    setVideoLoading(true)
  }

  const handleVideoLoad = () => {
    setVideoLoading(false)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const goBack = () => {
    router.back()
  }

  if (initialLoading) {
    return <CinematicLoader />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-red-800 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!videoDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-2xl mb-4">Video not found</div>
        <Link href="/" className="md-chip md-chip-selected">
          Go back to home
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* App Bar */}
      <header className="md-app-bar">
        <div className="md-app-bar-content">
          <div className="flex items-center">
            <button className="md-icon-button mr-2" onClick={goBack} aria-label="Back">
              <ArrowLeft size={24} />
            </button>
            <h1 className="md-app-bar-title">
              <Film size={28} className="text-red-800" />
              <span className="hidden sm:inline">CineTube</span>
            </h1>
          </div>

          <div className="md-app-bar-actions">
            <button className="md-icon-button hidden sm:flex" aria-label="Search">
              <Search size={24} />
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

      {/* Main Content */}
      <main className="md-main-content">
        <div className="md-container">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video Player Section */}
            <div className="w-full lg:w-2/3">
              <div className="player_block relative rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                {!showVideo ? (
                  <>
                    <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
                    <Image
                      src={videoDetails.splash_img || `/placeholder.svg?height=720&width=1280`}
                      alt={videoDetails.title}
                      fill
                      className="object-cover"
                    />
                    <button
                      id="playButton"
                      onClick={handlePlayVideo}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-800 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors z-20"
                      style={{ boxShadow: "0 0 20px rgba(139, 0, 0, 0.5)" }}
                    >
                      <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2"></div>
                    </button>
                  </>
                ) : (
                  <>
                    {videoLoading && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16">
                        <div className="w-full h-full border-4 border-t-red-800 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <iframe
                      ref={iframeRef}
                      className="iframe w-full h-full"
                      style={{ display: "block" }}
                      src={videoDetails.protected_embed}
                      frameBorder="0"
                      allowFullScreen
                      referrerPolicy="no-referrer"
                      onLoad={handleVideoLoad}
                      title={videoDetails.title}
                    ></iframe>
                  </>
                )}
              </div>

              {/* Video Info */}
              <div className="mt-4">
                <div className="p-4 rounded-lg bg-black bg-opacity-30 border border-gray-800">
                  <h1 className="text-2xl font-medium mb-2">{videoDetails.title}</h1>
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <div className="text-sm opacity-75">
                      {videoDetails.views} views • {videoDetails.uploaded}
                    </div>
                    <div className="flex mt-2 sm:mt-0">
                      <button className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-900 hover:bg-opacity-30 transition-colors">
                        <ThumbsUp size={20} />
                        <span className="hidden sm:inline">Like</span>
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-900 hover:bg-opacity-30 transition-colors">
                        <ThumbsDown size={20} />
                        <span className="hidden sm:inline">Dislike</span>
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-900 hover:bg-opacity-30 transition-colors">
                        <Share size={20} />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-900 hover:bg-opacity-30 transition-colors">
                        <Download size={20} />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-900 hover:bg-opacity-30 transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Video Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 rounded-lg bg-black bg-opacity-20 border border-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="opacity-75">Length:</span>
                      <span className="font-medium">{videoDetails.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="opacity-75">Size:</span>
                      <span className="font-medium">{videoDetails.size || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="opacity-75">File Code:</span>
                      <span className="font-medium">{videoDetails.filecode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="opacity-75">Quality:</span>
                      <span className="font-medium text-red-600">HD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Videos Section */}
            <div className="w-full lg:w-1/3">
              <h2 className="text-xl font-medium mb-4 flex items-center">
                <i className="fas fa-film text-red-800 mr-2"></i>
                Related Videos
              </h2>
              <div className="overflow-y-auto max-h-[70vh] pr-2 space-y-4" style={{ scrollbarWidth: "thin" }}>
                {relatedVideos.map((video) => (
                  <Link
                    href={`/watch/${video.filecode}`}
                    key={video.filecode}
                    className="flex hover:bg-black hover:bg-opacity-30 p-2 rounded-lg transition-colors border border-transparent hover:border-gray-800"
                  >
                    <div className="relative w-40 min-w-[160px] h-24 rounded-lg overflow-hidden">
                      <Image
                        src={video.splash_img || `/placeholder.svg?height=180&width=320`}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                        {video.length}
                      </div>
                    </div>
                    <div className="ml-3 flex-1 overflow-hidden">
                      <h3 className="font-medium line-clamp-2 text-sm">{video.title}</h3>
                      <div className="mt-1 text-xs opacity-75">
                        <div className="flex items-center">
                          <i className="fas fa-eye text-red-800 mr-1"></i>
                          {video.views} views
                        </div>
                        <div>{video.uploaded}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
