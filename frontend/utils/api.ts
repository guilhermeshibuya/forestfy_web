export async function api(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  })

  if (!response.ok) {
    throw new Error('API request failed')
  }

  return response.json()
}
