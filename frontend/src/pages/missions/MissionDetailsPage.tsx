import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { skillbridgeService } from '../../services/skillbridgeService'
import { Mission, MissionStatus, UrgencyLevel, Application, ApplicationStatus } from '../../services/api'
import { useAppSelector } from '../../hooks/hooks'
import Header from '../../components/ui/Header'

const MissionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAppSelector(state => state.auth)
  
  const [mission, setMission] = useState<Mission | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applying, setApplying] = useState(false)
  const [userApplication, setUserApplication] = useState<Application | null>(null)
  
  // Application form state
  const [applicationForm, setApplicationForm] = useState({
    proposal: '',
    proposedRate: 0,
    estimatedDuration: 0
  })

  useEffect(() => {
    if (id) {
      loadMissionDetails()
    }
  }, [id])

  const loadMissionDetails = async () => {
    try {
      setLoading(true)
      const missionData = await skillbridgeService.getMission(id!)
      setMission(missionData)
      
      // Load applications if user is the company owner
      if (user?.userType === 'COMPANY') {
        try {
          const applicationsData = await skillbridgeService.getMissionApplications(id!)
          setApplications(applicationsData)
        } catch (err) {
          // If user is not the owner, this will fail with 403, which is expected
          console.log('User is not the mission owner')
        }
      }
      
      // Check if user has already applied
      if (user?.userType === 'FREELANCER') {
        const userApplications = await skillbridgeService.getApplications()
        const existingApplication = userApplications.find(app => app.missionId === id)
        setUserApplication(existingApplication || null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load mission details')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!mission || !user) return
    
    try {
      setApplying(true)
      const newApplication = await skillbridgeService.createApplication({
        missionId: mission.id,
        proposal: applicationForm.proposal,
        proposedRate: applicationForm.proposedRate,
        estimatedDuration: applicationForm.estimatedDuration
      })
      
      setUserApplication(newApplication)
      setShowApplyModal(false)
      setApplicationForm({ proposal: '', proposedRate: 0, estimatedDuration: 0 })
      
      // Show success message
      alert('Application submitted successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  const handleWithdrawApplication = async () => {
    if (!userApplication) return
    
    try {
      await skillbridgeService.updateApplication(userApplication.id, {
        status: ApplicationStatus.WITHDRAWN
      })
      
      setUserApplication({ ...userApplication, status: ApplicationStatus.WITHDRAWN })
      alert('Application withdrawn successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to withdraw application')
    }
  }

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      await skillbridgeService.updateApplication(applicationId, {
        status: ApplicationStatus.ACCEPTED
      })
      
      // Update the application in the list
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: ApplicationStatus.ACCEPTED }
          : app
      ))
      
      alert('Application accepted successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to accept application')
    }
  }

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await skillbridgeService.updateApplication(applicationId, {
        status: ApplicationStatus.REJECTED
      })
      
      // Update the application in the list
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: ApplicationStatus.REJECTED }
          : app
      ))
      
      alert('Application rejected successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to reject application')
    }
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

  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case UrgencyLevel.LOW:
        return 'bg-gray-100 text-gray-800'
      case UrgencyLevel.NORMAL:
        return 'bg-blue-100 text-blue-800'
      case UrgencyLevel.HIGH:
        return 'bg-orange-100 text-orange-800'
      case UrgencyLevel.URGENT:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getApplicationStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case ApplicationStatus.ACCEPTED:
        return 'bg-green-100 text-green-800'
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800'
      case ApplicationStatus.WITHDRAWN:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  if (error || !mission) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The mission you are looking for does not exist.'}</p>
            <Link
              to="/missions"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Missions
            </Link>
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
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/missions" className="text-gray-700 hover:text-indigo-600">
                  Missions
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2">Mission Details</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Mission Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{mission.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Posted {new Date(mission.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Updated {new Date(mission.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mission.status)}`}>
                  {mission.status.replace('_', ' ')}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(mission.urgency)}`}>
                  {mission.urgency}
                </span>
              </div>
            </div>

            {/* Mission Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">€{mission.budget.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Budget</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mission.duration} days</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mission.location}</p>
                    <p className="text-xs text-gray-500">Location</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mission.isRemote ? 'Remote' : 'On-site'}</p>
                    <p className="text-xs text-gray-500">Work Type</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {user?.userType === 'FREELANCER' && mission.status === MissionStatus.OPEN && (
                <>
                  {userApplication ? (
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${getApplicationStatusColor(userApplication.status)}`}>
                        Application {userApplication.status}
                      </span>
                      {userApplication.status === ApplicationStatus.PENDING && (
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to withdraw your application?')) {
                              handleWithdrawApplication()
                            }
                          }}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Apply for this Mission
                    </button>
                  )}
                </>
              )}
              
              {user?.userType === 'COMPANY' && applications.length > 0 && (
                <div className="flex items-center space-x-4">
                  <Link
                    to={`/missions/${mission.id}/edit`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Edit Mission
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this mission?')) {
                        // Implement delete logic
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    Delete Mission
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{mission.description}</p>
                </div>
              </div>

              {/* Required Skills */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {mission.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Applications (for company owners) */}
              {user?.userType === 'COMPANY' && applications.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Applications ({applications.length})</h2>
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {application.freelancer?.user?.firstName} {application.freelancer?.user?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{application.freelancer?.user?.email}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{application.proposal}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Proposed Rate: €{application.proposedRate}/day</span>
                          <span>Estimated Duration: {application.estimatedDuration} days</span>
                        </div>
                        {application.status === ApplicationStatus.PENDING && (
                          <div className="flex items-center space-x-2 mt-3">
                            <button
                              onClick={() => handleAcceptApplication(application.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectApplication(application.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Information */}
              {mission.company && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">{mission.company.companyName}</p>
                      <p className="text-sm text-gray-500">{mission.company.industry}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{mission.company.location}</p>
                      <p>Size: {mission.company.size}</p>
                    </div>
                    {mission.company.website && (
                      <a
                        href={mission.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500 text-sm"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Mission Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mission Details</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900">{mission.status.replace('_', ' ')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Urgency</dt>
                    <dd className="text-sm text-gray-900">{mission.urgency}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Budget</dt>
                    <dd className="text-sm text-gray-900">€{mission.budget.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Duration</dt>
                    <dd className="text-sm text-gray-900">{mission.duration} days</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="text-sm text-gray-900">
                      {mission.location}
                      {mission.isRemote && <span className="ml-1 text-indigo-600">(Remote)</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Posted</dt>
                    <dd className="text-sm text-gray-900">{new Date(mission.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Apply for Mission</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 mb-1">
                    Proposal *
                  </label>
                  <textarea
                    id="proposal"
                    rows={4}
                    value={applicationForm.proposal}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, proposal: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your approach to this mission..."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="proposedRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Proposed Daily Rate (€) *
                  </label>
                  <input
                    id="proposedRate"
                    type="number"
                    value={applicationForm.proposedRate}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, proposedRate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="200"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Duration (days) *
                  </label>
                  <input
                    id="estimatedDuration"
                    type="number"
                    value={applicationForm.estimatedDuration}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, estimatedDuration: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="10"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying || !applicationForm.proposal || !applicationForm.proposedRate || !applicationForm.estimatedDuration}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MissionDetailsPage
