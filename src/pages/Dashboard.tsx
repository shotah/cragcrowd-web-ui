import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Activity, Users, TrendingUp } from 'lucide-react'
import { api } from '../services/api'

export function Dashboard() {
  const { data: walls, isLoading, error } = useQuery({
    queryKey: ['walls'],
    queryFn: api.getWalls,
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
        <p className="text-red-600">Failed to load wall data. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Crag Activity Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Real-time monitoring of climbing wall activity across all sensor locations.
          </p>
        </div>
      </div>

      {walls && walls.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {walls.map((wall) => (
            <Link
              key={wall.wall_id}
              to={`/wall/${wall.wall_id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-6 w-6 text-blue-600" />
                    <h3 className="ml-2 text-lg font-medium text-gray-900">
                      {wall.wall_id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    wall.device_count > 10 
                      ? 'bg-red-100 text-red-800' 
                      : wall.device_count > 5 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {wall.device_count > 10 ? 'Busy' : wall.device_count > 5 ? 'Moderate' : 'Quiet'}
                  </span>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Current Activity</p>
                      <p className="text-lg font-semibold text-gray-900">{wall.device_count} devices</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Last Update</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDistanceToNow(new Date(wall.latest_reading), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sensor data</h3>
          <p className="mt-1 text-sm text-gray-500">
            No climbing walls are currently being monitored.
          </p>
        </div>
      )}
    </div>
  )
}