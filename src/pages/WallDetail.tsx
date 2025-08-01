import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subHours } from 'date-fns'
import { ArrowLeft, Users, Clock, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

export function WallDetail() {
  const { wallId } = useParams<{ wallId: string }>()
  
  if (!wallId) {
    return <div>Wall not found</div>
  }

  const { data: sensorData, isLoading, error } = useQuery({
    queryKey: ['sensorData', wallId],
    queryFn: () => api.getSensorData({
      wall_id: wallId,
      start_time: subHours(new Date(), 24).toISOString(),
      limit: 100
    }),
    refetchInterval: 60000, // Refetch every minute
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load sensor data. Please try again later.</p>
      </div>
    )
  }

  const chartData = sensorData?.data
    .slice()
    .reverse()
    .map(reading => ({
      time: format(new Date(reading.server_timestamp), 'HH:mm'),
      devices: reading.device_count,
      timestamp: reading.server_timestamp
    })) || []

  const latestReading = sensorData?.data[0]
  const avgDevices = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, d) => sum + d.devices, 0) / chartData.length)
    : 0

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {wallId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            24-hour activity monitoring for this climbing wall
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-blue-600" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">Current Activity</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {latestReading?.device_count || 0}
          </p>
          <p className="text-sm text-gray-500">devices detected</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-green-600" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">24h Average</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{avgDevices}</p>
          <p className="text-sm text-gray-500">devices on average</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-purple-600" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">Last Update</h3>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {latestReading 
              ? format(new Date(latestReading.server_timestamp), 'HH:mm:ss')
              : 'No data'
            }
          </p>
          <p className="text-sm text-gray-500">
            {latestReading 
              ? format(new Date(latestReading.server_timestamp), 'MMM d, yyyy')
              : 'No recent data'
            }
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Activity Over Time</h3>
          <p className="text-sm text-gray-500">Device count over the last 24 hours</p>
        </div>
        <div className="p-6">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Devices', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  labelFormatter={(value, payload) => {
                    if (payload && payload[0]) {
                      return format(new Date(payload[0].payload.timestamp), 'MMM d, HH:mm')
                    }
                    return value
                  }}
                  formatter={(value) => [value, 'Devices']}
                />
                <Line 
                  type="monotone" 
                  dataKey="devices" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
              <p className="mt-1 text-sm text-gray-500">
                No sensor readings found for this wall in the last 24 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}