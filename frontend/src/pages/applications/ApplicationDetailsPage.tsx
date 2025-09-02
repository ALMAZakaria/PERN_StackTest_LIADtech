import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import applicationService from '../../services/applicationService';
import { Application, ApplicationStatus } from '../../services/api';
import Header from '../../components/ui/Header';

const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadApplication();
    }
  }, [id]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationService.getApplication(id!);
      setApplication(data);
    } catch (err) {
      setError('Failed to load application details');
      console.error('Error loading application:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    if (!application) return;

    try {
      setUpdating(true);
      await applicationService.updateApplication(application.id, { status: newStatus });
      await loadApplication(); // Reload to get updated data
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const handleWithdraw = async () => {
    if (!application) return;

    if (!confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    try {
      setUpdating(true);
      await applicationService.updateApplication(application.id, { status: ApplicationStatus.WITHDRAWN });
      await loadApplication();
    } catch (err) {
      console.error('Error withdrawing application:', err);
      alert('Failed to withdraw application');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = {
      [ApplicationStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      [ApplicationStatus.ACCEPTED]: { color: 'bg-green-100 text-green-800', text: 'Accepted' },
      [ApplicationStatus.REJECTED]: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      [ApplicationStatus.WITHDRAWN]: { color: 'bg-gray-100 text-gray-800', text: 'Withdrawn' },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isCompanyOwner = () => {
    return application?.company?.userId === user?.id;
  };

  const isFreelancerOwner = () => {
    return application?.freelancer?.userId === user?.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h2>
              <p className="text-gray-600 mb-6">{error || 'The application you are looking for does not exist.'}</p>
              <button
                onClick={() => navigate('/applications')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Back to Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/applications')}
            className="text-blue-600 hover:text-blue-900 mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Applications
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
              <p className="mt-2 text-gray-600">
                {application.mission?.title || 'Mission Application'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusBadge(application.status)}
              {application.status === ApplicationStatus.PENDING && (
                <div className="flex space-x-2">
                  {isCompanyOwner() && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(ApplicationStatus.ACCEPTED)}
                        disabled={updating}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {updating ? 'Accepting...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(ApplicationStatus.REJECTED)}
                        disabled={updating}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        {updating ? 'Rejecting...' : 'Reject'}
                      </button>
                    </>
                  )}
                  {isFreelancerOwner() && (
                    <button
                      onClick={handleWithdraw}
                      disabled={updating}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                    >
                      {updating ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mission Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mission Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{application.mission?.title}</h3>
                  <p className="text-gray-600 mt-2">{application.mission?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Budget</span>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(application.mission?.budget || 0)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration</span>
                    <p className="text-lg font-semibold text-gray-900">
                      {application.mission?.duration} days
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location</span>
                    <p className="text-lg font-semibold text-gray-900">
                      {application.mission?.location}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Remote</span>
                    <p className="text-lg font-semibold text-gray-900">
                      {application.mission?.isRemote ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
                {application.mission?.requiredSkills && application.mission.requiredSkills.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Required Skills</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {application.mission.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Proposal */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Proposal</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{application.proposal}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Summary */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Summary</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Proposed Rate</span>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(application.proposedRate)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Estimated Duration</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {application.estimatedDuration} days
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Applied Date</span>
                  <p className="text-sm text-gray-900">
                    {formatDate(application.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Last Updated</span>
                  <p className="text-sm text-gray-900">
                    {formatDate(application.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Freelancer Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Freelancer</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {application.freelancer?.user?.firstName} {application.freelancer?.user?.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Location</span>
                  <p className="text-sm text-gray-900">
                    {application.freelancer?.location || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Experience</span>
                  <p className="text-sm text-gray-900">
                    {application.freelancer?.experience} years
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Daily Rate</span>
                  <p className="text-sm text-gray-900">
                    {formatCurrency(application.freelancer?.dailyRate || 0)}
                  </p>
                </div>
                {application.freelancer?.skills && application.freelancer.skills.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Skills</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {application.freelancer.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {application.freelancer.skills.length > 5 && (
                        <span className="text-xs text-gray-500">
                          +{application.freelancer.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {application.freelancer?.bio && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Bio</span>
                    <p className="text-sm text-gray-900 mt-1 line-clamp-3">
                      {application.freelancer.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Company</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Company Name</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {application.company?.companyName}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Industry</span>
                  <p className="text-sm text-gray-900">
                    {application.company?.industry || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Size</span>
                  <p className="text-sm text-gray-900">
                    {application.company?.size || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Location</span>
                  <p className="text-sm text-gray-900">
                    {application.company?.location || 'Not specified'}
                  </p>
                </div>
                {application.company?.website && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Website</span>
                    <a
                      href={application.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-900 block"
                    >
                      {application.company.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
