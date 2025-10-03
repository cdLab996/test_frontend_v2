export interface User {
  id?: number
  name: string
  age: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}
