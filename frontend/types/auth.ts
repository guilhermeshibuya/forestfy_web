export type LoginResponse = {
  message: string
}

export type User = {
  id: string
  full_name: string
  email: string
  profile_picture_url: string
}

export type UserCreate = {
  full_name: string
  email: string
  password: string
}
