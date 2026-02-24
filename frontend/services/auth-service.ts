import { LoginFormData } from '@/schemas/login-schema'
import { api } from '@/utils/api'

export async function login(data: LoginFormData) {
  const formData = new FormData()

  formData.append('username', data.username)
  formData.append('password', data.password)

  return await api('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    body: formData,
  })
}
