export interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  image: string
  category: string
  categoryId: string
  date: string
  author: string
  isBreaking?: boolean
}

export interface Category {
  id: string
  name: string
}

export interface Comment {
  id: string
  newsId: string
  name: string
  text: string
  date: string
  isApproved: boolean
}
