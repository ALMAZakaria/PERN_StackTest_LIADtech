import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { skillbridgeService } from '../../services/skillbridgeService'
import { Mission, MissionStatus } from '../../services/api'
import Header from '../../components/ui/Header'

const MissionBoardPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([])
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    skills: '',
    minBudget: '',
    maxBudget: '',
    location: '',
    isRemote: false
  })

  useEffect(() => {
    loadMissions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [missions, filters])

  const loadMissions = async () => {
    try {
      setLoading(true)
      const data = await skillbridgeService.getMissions()
      setMissions(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load missions')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...missions]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(mission =>
        mission.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        mission.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(mission => mission.status === filters.status)
    }

    // Skills filter
    if (filters.skills) {
      const skills = filters.skills.split(',').map(s => s.trim().toLowerCase())
      filtered = filtered.filter(mission =>
        mission.requiredSkills.some(skill =>
          skills.some(filterSkill => skill.toLowerCase().includes(filterSkill))
        )
      )
    }

    // Budget filters
    if (filters.minBudget) {
      filtered = filtered.filter(mission => mission.budget >= Number(filters.minBudget))
    }
    if (filters.maxBudget) {
      filtered = filtered.filter(mission => mission.budget <= Number(filters.maxBudget))
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(mission =>
        mission.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Remote filter
    if (filters.isRemote) {
      filtered = filtered.filter(mission => mission.isRemote)
    }

    setFilteredMissions(filtered)
  }

  const handleFilterChange = (name: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      skills: '',
      minBudget: '',
      maxBudget: '',
      location: '',
      isRemote: false
    })
  }

  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case MissionStatus.OPEN:
        return 'bg-green-100 text-green-800'
      case MissionStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800'
      case MissionStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800'
      case MissionStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mission Board</h1>
          <p className="mt-2 text-gray-600">Find your next opportunity or browse available missions</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                id="search"
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search missions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Status</option>
                <option value={MissionStatus.OPEN}>Open</option>
                <option value={MissionStatus.IN_PROGRESS}>In Progress</option>
                <option value={MissionStatus.COMPLETED}>Completed</option>
              </select>
            </div>

            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <input
                id="skills"
                type="text"
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                placeholder="React, TypeScript..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                id="location"
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Paris, France"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Budget Range */}
            <div>
              <label htmlFor="minBudget" className="block text-sm font-medium text-gray-700 mb-1">Min Budget (€)</label>
              <input
                id="minBudget"
                type="number"
                value={filters.minBudget}
                onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="maxBudget" className="block text-sm font-medium text-gray-700 mb-1">Max Budget (€)</label>
              <input
                id="maxBudget"
                type="number"
                value={filters.maxBudget}
                onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                placeholder="50000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Remote Only */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRemote"
                checked={filters.isRemote}
                onChange={(e) => handleFilterChange('isRemote', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-900">
                Remote Only
              </label>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''} found
          </h2>
          <Link
            to="/missions/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Post Mission
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => (
            <div key={mission.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {mission.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                    {mission.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {mission.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {mission.location}
                    {mission.isRemote && <span className="ml-2 text-indigo-600">(Remote)</span>}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    €{mission.budget.toLocaleString()}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {mission.duration} days
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {mission.requiredSkills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {mission.requiredSkills.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{mission.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Posted {new Date(mission.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/missions/${mission.id}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMissions.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No missions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or check back later for new opportunities.
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default MissionBoardPage
