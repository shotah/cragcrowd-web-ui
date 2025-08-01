import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Request interceptor for adding auth headers if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface SensorReading {
  _id: string
  wall_id: string
  device_count: number
  timestamp: number
  gateway_id?: string
  rssi?: number
  snr?: number
  received_at?: number
  server_timestamp: string
  created_at: string
}

export interface Wall {
  wall_id: string
  latest_reading: string
  device_count: number
}

export interface SensorDataQuery {
  wall_id?: string
  start_time?: string
  end_time?: string
  limit?: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  count?: number
  error?: string
  details?: any
}

export const api = {
  // Health check
  async getHealth() {
    const response = await apiClient.get<{
      status: string
      timestamp: string
      database: string
      uptime: number
    }>('/health')
    return response.data
  },

  // Get sensor data
  async getSensorData(query: SensorDataQuery = {}) {
    const response = await apiClient.get<ApiResponse<SensorReading[]>>('/sensor-data', {
      params: query
    })
    return response.data
  },

  // Submit sensor data (for testing)
  async submitSensorData(data: Partial<SensorReading>) {
    const response = await apiClient.post<ApiResponse<{ id: string }>>('/sensor-data', data)
    return response.data
  },

  // Get list of walls with recent data
  async getWalls() {
    const response = await apiClient.get<ApiResponse<{ walls: Wall[] }>>('/sensor-data/walls')
    return response.data.walls || []
  },
}

export default api