import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const axiosInstance = axios.create({
    baseURL: config.public.baseUrl as string,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error)
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      axios: axiosInstance
    }
  }
})
