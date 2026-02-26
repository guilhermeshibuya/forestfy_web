const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export function loginEndpoint() {
  return API_BASE_URL + '/api/v1/auth/login'
}

export function registerEndpoint() {
  return API_BASE_URL + '/api/v1/auth/register'
}

export async function api(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
  })

  if (!response.ok) {
    throw new Error(response.status.toString())
  }

  return response.json()
}
