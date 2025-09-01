import React, { useState, useEffect } from 'react'
import { authService } from '../../services/authService'
import { skillbridgeService } from '../../services/skillbridgeService'
import { User, UserType } from '../../services/api'
import Header from '../../components/ui/Header'

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    location: '',
    skills: [] as string[],
    experience: 0,
    dailyRate: 0,
    availability: '',
    companyName: '',
    industry: '',
    companySize: '',
    description: '',
    website: ''
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const currentUser = authService.getCurrentUser()
      setUser(currentUser)
      
      if (currentUser) {
        // Set basic user info
        setFormData(prev => ({
          ...prev,
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || ''
        }))

        // Load profile data based on user type
        if (currentUser.userType === UserType.FREELANCER) {
          try {
            const freelanceProfile = await skillbridgeService.getFreelanceProfile()
            setFormData(prev => ({
              ...prev,
              bio: freelanceProfile.bio || '',
              location: freelanceProfile.location || '',
              skills: freelanceProfile.skills || [],
              experience: freelanceProfile.experience || 0,
              dailyRate: freelanceProfile.dailyRate || 0,
              availability: freelanceProfile.availability || ''
            }))
          } catch (err: any) {
            if (err.response?.status !== 404) {
              console.error('Error loading freelance profile:', err)
            }
          }
        } else if (currentUser.userType === UserType.COMPANY) {
          try {
            const companyProfile = await skillbridgeService.getCompanyProfile()
            setFormData(prev => ({
              ...prev,
              location: companyProfile.location || '',
              companyName: companyProfile.companyName || '',
              industry: companyProfile.industry || '',
              companySize: companyProfile.size || '',
              description: companyProfile.description || '',
              website: companyProfile.website || ''
            }))
          } catch (err: any) {
            if (err.response?.status !== 404) {
              console.error('Error loading company profile:', err)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    // Handle number inputs
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
    setFormData(prev => ({
      ...prev,
      skills
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (user?.userType === UserType.COMPANY) {
        // Validate required fields
        if (!formData.companyName.trim()) {
          setError('Company name is required')
          return
        }
        if (!formData.industry.trim()) {
          setError('Industry is required')
          return
        }
        if (!formData.companySize) {
          setError('Company size is required')
          return
        }

        // Create or update company profile
        const companyProfileData = {
          companyName: formData.companyName.trim(),
          industry: formData.industry.trim(),
          size: formData.companySize as 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE',
          description: formData.description?.trim() || undefined,
          website: formData.website?.trim() || undefined,
          location: formData.location?.trim() || undefined
        }

        try {
          // Try to create first (in case profile doesn't exist)
          console.log('Attempting to create company profile with data:', companyProfileData)
          await skillbridgeService.createCompanyProfile(companyProfileData)
          setSuccess('Company profile created successfully!')
        } catch (err: any) {
          console.log('Create failed with error:', err.response?.status, err.response?.data?.message)
          if (err.response?.status === 400 && err.response?.data?.message?.includes('already exists')) {
            // Profile already exists, update it
            console.log('Profile already exists, updating company profile with data:', companyProfileData)
            await skillbridgeService.updateCompanyProfile(companyProfileData)
            setSuccess('Company profile updated successfully!')
          } else {
            throw err
          }
        }
      } else if (user?.userType === UserType.FREELANCER) {
        // Validate required fields for freelancer
        if (formData.skills.length === 0) {
          setError('At least one skill is required')
          return
        }
        if (formData.dailyRate <= 0) {
          setError('Daily rate must be greater than 0')
          return
        }
        if (formData.availability <= 0 || formData.availability > 168) {
          setError('Availability must be between 1 and 168 hours per week')
          return
        }
        if (formData.experience < 0) {
          setError('Experience cannot be negative')
          return
        }

        // Create or update freelance profile
        const freelanceProfileData = {
          skills: formData.skills,
          experience: formData.experience,
          dailyRate: formData.dailyRate,
          availability: formData.availability,
          bio: formData.bio?.trim() || undefined,
          location: formData.location?.trim() || undefined
        }

        try {
          // Try to create first (in case profile doesn't exist)
          console.log('Attempting to create freelance profile with data:', freelanceProfileData)
          await skillbridgeService.createFreelanceProfile(freelanceProfileData)
          setSuccess('Freelance profile created successfully!')
        } catch (err: any) {
          console.log('Create failed with error:', err.response?.status, err.response?.data?.message)
          if (err.response?.status === 400 && err.response?.data?.message?.includes('already exists')) {
            // Profile already exists, update it
            console.log('Profile already exists, updating freelance profile with data:', freelanceProfileData)
            await skillbridgeService.updateFreelanceProfile(freelanceProfileData)
            setSuccess('Freelance profile updated successfully!')
          } else {
            throw err
          }
        }
      }

      setIsEditing(false)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save profile'
      console.error('Profile save error:', err)
      setError(errorMessage)
    } finally {
      setSaving(false)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
            <p className="text-gray-600">Please log in to view your profile.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information and preferences.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          {/* Profile Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-xl font-medium text-white">
                    {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">
                    {user.userType} • {user.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="City, Country"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Freelancer-specific fields */}
              {user.userType === UserType.FREELANCER && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Tell us about yourself and your expertise..."
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills.join(', ')}
                      onChange={handleSkillsChange}
                      disabled={!isEditing}
                      placeholder="JavaScript, React, Node.js"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Daily Rate (€)</label>
                    <input
                      type="number"
                      name="dailyRate"
                      value={formData.dailyRate}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Availability (hours per week)</label>
                    <input
                      type="number"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      min="1"
                      max="168"
                      placeholder="40"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">Enter hours per week (1-168)</p>
                  </div>
                </>
              )}

              {/* Company-specific fields */}
              {user.userType === UserType.COMPANY && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Size</label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">Select company size</option>
                      <option value="STARTUP">Startup (1-10)</option>
                      <option value="SMALL">Small (11-50)</option>
                      <option value="MEDIUM">Medium (51-200)</option>
                      <option value="LARGE">Large (200+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="https://example.com"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Company Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Tell us about your company..."
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      </div>
    </div>
  )
}

export default ProfilePage
