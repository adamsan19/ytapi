import type { VideoItem } from "./types"

// In-memory cache for development
const dataCache: VideoItem[] = []

// Function to fetch data from YouTube
async function fetchFromYouTube(
  url: string,
  userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    return html
  } catch (error) {
    console.error("Error fetching from YouTube:", error)
    return null
  }
}

// Function to parse YouTube HTML response
function parseYouTubeHTML(html: string): VideoItem[] {
  const results: VideoItem[] = []

  try {
    // Find ytInitialData
    const startIndex = html.indexOf("ytInitialData") + "ytInitialData".length + 3
    const endIndex = html.indexOf("};", startIndex) + 1
    const jsonStr = html.substring(startIndex, endIndex)

    const data = JSON.parse(jsonStr)

    // Extract video data
    const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || []

    for (const content of contents) {
      const itemSection = content.itemSectionRenderer || {}
      const videoItems = itemSection.contents || []

      for (const item of videoItems) {
        if (item.videoRenderer) {
          const videoData = item.videoRenderer

          // Extract data
          const videoId = videoData.videoId || ""
          const title = videoData.title?.runs?.[0]?.text || ""
          const views = (videoData.viewCountText?.simpleText || "0").replace(" views", "")
          const thumbnails = videoData.thumbnail?.thumbnails || []
          const length = videoData.lengthText?.simpleText || "0"
          const uploaded = videoData.publishedTimeText?.simpleText || ""

          // Clean and format title
          const cleanTitle = cleanText(title)

          // Get thumbnail URLs
          const splashImg = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url.split("?")[0] : ""
          const singleImg = thumbnails.length > 0 ? thumbnails[0].url.split("?")[0] : ""

          // Build result item
          const resultItem: VideoItem = {
            splash_img: splashImg,
            size: "0",
            last_view: new Date().toISOString(),
            title: cleanTitle,
            views: views,
            filecode: videoId,
            file_code: videoId,
            protected_dl: `/d/${videoId}`,
            canplay: 1,
            length: length,
            single_img: singleImg,
            protected_embed: `https://www.youtube.com/embed/${videoId}`,
            uploaded: uploaded,
            status: 200,
          }

          results.push(resultItem)
        }
      }
    }
  } catch (error) {
    console.error("Error parsing YouTube HTML:", error)
  }

  return results
}

// Function to clean text
function cleanText(text: string): string {
  // Remove special characters except spaces
  let cleaned = text.replace(/[^a-zA-Z0-9\s]/g, " ")

  // Replace multiple spaces with a single space
  cleaned = cleaned.replace(/\s+/g, " ")

  // Convert to lowercase
  cleaned = cleaned.replace(/\b\w/g, (char) => char.toUpperCase())

  // Remove duplicate words
  const words = cleaned.split(" ")
  const uniqueWords = [...new Set(words)]
  cleaned = uniqueWords.join(" ")

  return cleaned
}

// Function to save data to cache
function saveToCache(newData: VideoItem[]) {
  // Add new data to cache, avoiding duplicates
  for (const newItem of newData) {
    const isDuplicate = dataCache.some((existingItem) => existingItem.filecode === newItem.filecode)
    if (!isDuplicate) {
      dataCache.push(newItem)
    }
  }
}

// Function to search videos
export async function searchVideos(query: string, maxResults?: number): Promise<VideoItem[]> {
  const encodedQuery = encodeURIComponent(query)
  const url = `https://m.youtube.com/results?search_query=${encodedQuery}`

  const html = await fetchFromYouTube(url)
  if (!html) return []

  const results = parseYouTubeHTML(html)
  saveToCache(results)

  return maxResults ? results.slice(0, maxResults) : results
}

// Function to get video details
export async function getVideoDetails(fileCode: string): Promise<VideoItem[]> {
  // First check if we have it in cache
  const cachedVideo = dataCache.find((item) => item.filecode === fileCode)
  if (cachedVideo) {
    return [cachedVideo]
  }

  // If not in cache, fetch from YouTube
  const url = `https://m.youtube.com/watch?v=${fileCode}`
  const html = await fetchFromYouTube(url)
  if (!html) return []

  const results = parseYouTubeHTML(html)

  // Filter for the specific video
  const videoDetails = results.filter((video) => video.filecode === fileCode)

  if (videoDetails.length > 0) {
    saveToCache(videoDetails)
    return videoDetails
  }

  return []
}

// Function to get related videos
export async function getRelatedVideos(videoId: string, maxResults = 10): Promise<VideoItem[]> {
  // First check if we have enough videos in cache
  if (dataCache.length > maxResults) {
    // Filter out the current video
    const filteredCache = dataCache.filter((item) => item.filecode !== videoId)
    // Return random selection of videos from cache
    return filteredCache.sort(() => 0.5 - Math.random()).slice(0, maxResults)
  }

  // If not enough in cache, fetch from YouTube
  // We'll use the video title as a search query to find related videos
  const cachedVideo = dataCache.find((item) => item.filecode === videoId)

  if (cachedVideo) {
    // Extract keywords from the title
    const keywords = cachedVideo.title.split(" ").slice(0, 3).join(" ")
    return searchVideos(keywords, maxResults)
  }

  // If we don't have the video in cache, fetch trending videos
  const url = `https://m.youtube.com/trending`
  const html = await fetchFromYouTube(url)
  if (!html) return []

  const results = parseYouTubeHTML(html)
  saveToCache(results)

  // Filter out the current video
  const filteredResults = results.filter((video) => video.filecode !== videoId)
  return filteredResults.slice(0, maxResults)
}

// Function to get video list with pagination
export async function getVideoList(page = 1, perPage = 50) {
  const total = dataCache.length
  const offset = (page - 1) * perPage
  const paginatedData = dataCache.slice(offset, offset + perPage)

  return {
    status: 200,
    result: paginatedData,
    total: total,
    page: page,
    per_page: perPage,
    server_time: new Date().toISOString(),
    msg: "OK",
  }
}
