import Link from "next/link"
import Image from "next/image"
import type { VideoItem } from "@/lib/types"

interface VideoGridProps {
  videos: VideoItem[]
  loading: boolean
}

export default function VideoGrid({ videos, loading }: VideoGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-300 dark:bg-gray-700"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No videos found. Try searching for something!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => (
        <Link
          href={`/watch/${video.filecode}`}
          key={video.filecode}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative aspect-video">
            <Image
              src={video.splash_img || `/placeholder.svg?height=180&width=320`}
              alt={video.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
              {video.length}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">{video.title}</h3>
            <div className="mt-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{video.views} views</span>
              <span>{video.uploaded}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
