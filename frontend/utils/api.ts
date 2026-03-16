const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export function loginEndpoint() {
  return API_BASE_URL + '/api/v1/auth/login'
}

export function registerEndpoint() {
  return API_BASE_URL + '/api/v1/auth/register'
}

export function getMeEndpoint() {
  return API_BASE_URL + '/api/v1/auth/me'
}

export function logoutEndpoint() {
  return API_BASE_URL + '/api/v1/auth/logout'
}

export function dashboardMetricsEndpoint() {
  return API_BASE_URL + '/api/v1/dashboard/metrics'
}

export function classificationEndpoint() {
  return API_BASE_URL + '/api/v1/classifications'
}

export function getClassificationByIdEndpoint(id: string) {
  return API_BASE_URL + `/api/v1/classifications/${id}`
}

export function recentActivitiesEndpoint(userId: string) {
  return API_BASE_URL + `/api/v1/users/${userId}/activities`
}

export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || response.statusText)
  }

  return data
}
