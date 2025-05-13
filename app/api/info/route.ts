import { type NextRequest, NextResponse } from "next/server"
import { getVideoDetails } from "@/lib/youtube"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const fileCode = searchParams.get("file_code")

  if (!fileCode) {
    return NextResponse.json({ status: 400, msg: "Parameter 'file_code' tidak boleh kosong." }, { status: 400 })
  }

  try {
    const videoDetails = await getVideoDetails(fileCode)

    return NextResponse.json({
      status: 200,
      result: videoDetails,
      server_time: new Date().toISOString(),
      msg: "OK",
    })
  } catch (error) {
    console.error("Error getting video details:", error)
    return NextResponse.json({ status: 500, msg: "Internal server error" }, { status: 500 })
  }
}
