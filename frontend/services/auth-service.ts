import { LoginFormData } from '@/schemas/login-schema'
import { RegisterFormData } from '@/schemas/register-schema'
import { api, loginEndpoint, registerEndpoint } from '@/utils/api'

export async function login(data: LoginFormData) {
  const formData = new FormData()

  formData.append('username', data.email)
  formData.append('password', data.password)

  return await api(loginEndpoint(), {
    method: 'POST',
    body: formData,
  })
}

export async function register(data: RegisterFormData) {
  const newUser = {
    full_name: data.name,
    email: data.email,
    password: data.password,
  }

  return await api(registerEndpoint(), {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(newUser),
  })
}
