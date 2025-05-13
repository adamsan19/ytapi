import { type NextRequest, NextResponse } from "next/server"
import { searchVideos } from "@/lib/youtube"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const maxResults = searchParams.get("max_results")

  if (!query) {
    return NextResponse.json({ status: 400, msg: "Parameter 'q' tidak boleh kosong." }, { status: 400 })
  }

  try {
    const results = await searchVideos(query, maxResults ? Number.parseInt(maxResults) : undefined)

    return NextResponse.json({
      status: 200,
      result: results,
      server_time: new Date().toISOString(),
      msg: "OK",
    })
  } catch (error) {
    console.error("Error searching videos:", error)
    return NextResponse.json({ status: 500, msg: "Internal server error" }, { status: 500 })
  }
}
