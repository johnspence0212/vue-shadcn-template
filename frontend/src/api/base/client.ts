import axios from 'axios'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (for auth tokens, logging, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    // config.headers.Authorization = `Bearer ${token}`
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor (for error handling, logging, etc.)
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
    )
    return response
  },
  (error) => {
    console.error(
      `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`,
    )

    // Handle common errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login, etc.
      console.log('Unauthorized access')
    }

    return Promise.reject(error)
  },
)

export default apiClient
