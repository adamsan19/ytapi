export interface VideoItem {
  splash_img: string
  size: string
  last_view: string
  title: string
  views: string
  filecode: string
  file_code: string
  protected_dl: string
  canplay: number
  length: string
  single_img: string
  protected_embed: string
  uploaded: string
  status: number
}

export interface ApiResponse {
  status: number
  result: VideoItem[]
  server_time: string
  msg: string
  total?: number
  page?: number
  per_page?: number
}
