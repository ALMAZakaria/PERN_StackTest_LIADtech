import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { skillbridgeService } from '../../services/skillbridgeService'
import { MissionStatus, UrgencyLevel } from '../../services/api'
import Header from '../../components/ui/Header'

interface CreateMissionForm {
  title: string
  description: string
  requiredSkills: string[]
  budget: number
  duration: number
  location: string
  isRemote: boolean
  urgency: UrgencyLevel
}

const CreateMissionPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([])
  const [hasCompanyProfile, setHasCompanyProfile] = useState<boolean | null>(null)
  const [checkingProfile, setCheckingProfile] = useState(true)

  const [formData, setFormData] = useState<CreateMissionForm>({
    title: '',
    description: '',
    requiredSkills: [],
    budget: 0,
    duration: 1,
    location: '',
    isRemote: true,
    urgency: UrgencyLevel.NORMAL
  })

  useEffect(() => {
    loadAvailableSkills()
    checkCompanyProfile()
  }, [])

  useEffect(() => {
    if (skillInput.length > 2) {
      searchSkills(skillInput)
    } else {
      setSuggestedSkills([])
    }
  }, [skillInput])

  const loadAvailableSkills = async () => {
    try {
      const skills = await skillbridgeService.getSkills()
      // Note: availableSkills is not used in the current implementation
      console.log('Available skills loaded:', skills)
    } catch (err: any) {
      console.error('Failed to load skills:', err)
    }
  }

  const checkCompanyProfile = async () => {
    try {
      setCheckingProfile(true)
      await skillbridgeService.getCompanyProfile()
      setHasCompanyProfile(true)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setHasCompanyProfile(false)
      } else {
        console.error('Failed to check company profile:', err)
        setHasCompanyProfile(false)
      }
    } finally {
      setCheckingProfile(false)
    }
  }

  const searchSkills = async (query: string) => {
    try {
      const skills = await skillbridgeService.searchSkills(query)
      setSuggestedSkills(skills.filter(skill => 
        !formData.requiredSkills.includes(skill)
      ))
    } catch (err: any) {
      console.error('Failed to search skills:', err)
    }
  }

  const handleInputChange = (field: keyof CreateMissionForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !formData.requiredSkills.includes(trimmedSkill)) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, trimmedSkill]
      }))
    }
    setSkillInput('')
    setSuggestedSkills([])
  }

  const handleSkillInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      addSkill(skillInput.trim())
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Mission title is required')
      return false
    }
    if (!formData.description.trim()) {
      setError('Mission description is required')
      return false
    }
    if (formData.requiredSkills.length === 0) {
      setError('At least one required skill is needed')
      return false
    }
    if (formData.budget <= 0) {
      setError('Budget must be greater than 0')
      return false
    }
    if (formData.duration <= 0) {
      setError('Duration must be greater than 0')
      return false
    }
    if (!formData.isRemote && !formData.location.trim()) {
      setError('Location is required for non-remote missions')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const missionData = {
        ...formData,
        status: MissionStatus.OPEN
      }
      
      await skillbridgeService.createMission(missionData)
      navigate('/missions', { 
        state: { message: 'Mission created successfully!' }
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create mission'
      
      // Check if it's a company profile error
      if (errorMessage.includes('Company profile required')) {
        setError('You need to create a company profile first. Please click "Create Company Profile" below.')
        setHasCompanyProfile(false)
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  // Show company profile requirement if user doesn't have one
  if (hasCompanyProfile === false) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Profile Required</h2>
              <p className="text-gray-600 mb-6">
                You need to create a company profile before you can post missions. This helps freelancers understand your company and project requirements.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/dashboard/profile')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Create Company Profile
                </button>
                <div>
                  <button
                    onClick={() => navigate('/missions')}
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    ← Back to Missions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Mission</h1>
            <p className="mt-2 text-gray-600">
              Post a new mission to find the perfect freelancer for your project
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700">{error}</p>
              {error.includes('company profile') && (
                <div className="mt-3">
                  <button
                    onClick={() => navigate('/dashboard/profile')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Company Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Mission Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., React Developer for E-commerce Platform"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project requirements, goals, and expectations..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

                             {/* Required Skills */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Required Skills *
                 </label>
                 <p className="text-sm text-gray-500 mb-3">
                   Type to search existing skills or enter custom skills. Press Enter or click Add to include a skill.
                 </p>
                 <div className="space-y-3">
                   {/* Skill Input */}
                   <div className="relative">
                     <div className="flex">
                       <input
                         type="text"
                         value={skillInput}
                         onChange={(e) => setSkillInput(e.target.value)}
                         onKeyPress={handleSkillInputKeyPress}
                         placeholder="Type to search skills or press Enter to add custom skill..."
                         className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                       />
                       <button
                         type="button"
                         onClick={() => skillInput.trim() && addSkill(skillInput.trim())}
                         disabled={!skillInput.trim()}
                         className="px-4 py-2 bg-indigo-600 text-white border border-indigo-600 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         Add
                       </button>
                     </div>
                     {/* Skill Suggestions */}
                     {suggestedSkills.length > 0 && (
                       <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                         {suggestedSkills.map((skill) => (
                           <button
                             key={skill}
                             type="button"
                             onClick={() => addSkill(skill)}
                             className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                           >
                             {skill}
                           </button>
                         ))}
                       </div>
                     )}
                   </div>

                  {/* Selected Skills */}
                  {formData.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-indigo-600 hover:text-indigo-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Budget and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (€) *
                  </label>
                  <input
                    id="budget"
                    type="number"
                    min="1"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                    placeholder="5000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days) *
                  </label>
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', Number(e.target.value))}
                    placeholder="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Location and Remote */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Paris, France"
                    disabled={formData.isRemote}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      formData.isRemote ? 'bg-gray-100' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isRemote}
                        onChange={(e) => handleInputChange('isRemote', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">Remote work allowed</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  id="urgency"
                  value={formData.urgency}
                  onChange={(e) => handleInputChange('urgency', e.target.value as UrgencyLevel)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={UrgencyLevel.LOW}>Low - Flexible timeline</option>
                  <option value={UrgencyLevel.NORMAL}>Normal - Standard timeline</option>
                  <option value={UrgencyLevel.HIGH}>High - Urgent completion needed</option>
                  <option value={UrgencyLevel.URGENT}>Urgent - Immediate start required</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/missions')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Mission'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateMissionPage
