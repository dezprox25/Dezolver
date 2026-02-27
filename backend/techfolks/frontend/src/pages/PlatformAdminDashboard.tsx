import { useEffect, useState } from 'react'
import { useAuthStore } from '@store/authStore'
import { useOrganizationStore } from '@store/organizationStore'
import DashboardCard from '@components/common/DashboardCard'
import LoadingSpinner from '@components/common/LoadingSpinner'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const PlatformAdminDashboard = () => {
  const { user } = useAuthStore()
  const {
    platformStats,
    loading,
    error,
    fetchPlatformStats,
    createOrganization,
    clearError
  } = useOrganizationStore()

  const [showCreateOrg, setShowCreateOrg] = useState(false)
  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    industry: '',
    contact_email: '',
    plan: 'professional',
    manager_user: {
      username: '',
      email: '',
      password: '',
      full_name: ''
    }
  })

  useEffect(() => {
    if (user?.role === 'platform_admin' || user?.tier === 'platform') {
      fetchPlatformStats()
    }
  }, [user, fetchPlatformStats])

  const handleCreateOrganization = async () => {
    if (!newOrgForm.name || !newOrgForm.industry || !newOrgForm.contact_email ||
      !newOrgForm.manager_user.username || !newOrgForm.manager_user.email ||
      !newOrgForm.manager_user.password || !newOrgForm.manager_user.full_name) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await createOrganization({
        ...newOrgForm,
        company_size: 'medium'
      })
      setShowCreateOrg(false)
      setNewOrgForm({
        name: '',
        industry: '',
        contact_email: '',
        plan: 'professional',
        manager_user: {
          username: '',
          email: '',
          password: '',
          full_name: ''
        }
      })
    } catch (error) {
      // Error already handled in store
    }
  }

  // Redirect if not platform admin
  if (!user || user.role !== 'platform_admin') {
    return <Navigate to="/profile" replace />
  }

  return (
    <div className="space-y-8">
      {/* Platform Admin Header */}
      <div className="bg-black rounded-xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <span className="mr-3">🌟</span>
                TechFolks Platform Console
              </h1>
              <p className="text-slate-300 text-lg">
                Multi-tenant enterprise platform administration
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-white">₹{platformStats ? (platformStats.totalRevenue / 100000).toFixed(1) : '0'}L</div>
              <div className="text-sm text-gray-400">Monthly Revenue</div>
            </div>
          </div>

          {/* Platform Metrics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-xl font-black">{platformStats?.totalOrganizations || 0}</div>
              <div className="text-sm text-gray-400">Total Organizations</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-xl font-black">{platformStats?.activeOrganizations || 0}</div>
              <div className="text-sm text-gray-400">Active Orgs</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-xl font-black">{platformStats?.totalUsers?.toLocaleString() || '0'}</div>
              <div className="text-sm text-gray-400">Total Users</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-xl font-black">{platformStats ? Math.round((platformStats.activeOrganizations / platformStats.totalOrganizations) * 100) : 0}%</div>
              <div className="text-sm text-gray-400">Active Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue & Subscription Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Revenue Analytics"
          subtitle="Monthly recurring revenue"
          value={`₹${platformStats ? (platformStats.totalRevenue / 100000).toFixed(1) : '0'}L`}
          icon="💰"
          gradient="gray"
          trend={{
            value: 15,
            label: 'growth',
            isPositive: true
          }}
        >
          <div className="space-y-1">
            <div className="text-xs">ARR: ₹{platformStats ? (platformStats.totalRevenue * 12 / 100000).toFixed(1) : '0'}L</div>
            <div className="text-xs">Avg per org: ₹{platformStats && platformStats.activeOrganizations > 0 ? Math.round(platformStats.totalRevenue / platformStats.activeOrganizations / 1000) : 0}K</div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Organizations"
          subtitle="Platform tenants"
          value={platformStats?.totalOrganizations || 0}
          icon="🏢"
          gradient="gray"
          trend={{
            value: 8,
            label: 'new this month',
            isPositive: true
          }}
        >
          <div className="space-y-1">
            <div className="text-xs">Active: {platformStats?.activeOrganizations || 0}</div>
            <div className="text-xs">Churn rate: 2.1%</div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="User Growth"
          subtitle="Platform-wide users"
          value={platformStats?.totalUsers?.toLocaleString() || '0'}
          icon="👥"
          gradient="gray"
          trend={{
            value: 12,
            label: 'growth',
            isPositive: true
          }}
        >
          <div className="space-y-1">
            <div className="text-xs">Avg per org: {platformStats && platformStats.activeOrganizations > 0 ? Math.round(platformStats.totalUsers / platformStats.activeOrganizations) : 0}</div>
            <div className="text-xs">Monthly active: 89%</div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Platform Health"
          subtitle="System performance"
          value="99.9%"
          icon="📊"
          gradient="gray"
        >
          <div className="space-y-1">
            <div className="text-xs">Uptime: 99.9%</div>
            <div className="text-xs">Avg response: 125ms</div>
          </div>
        </DashboardCard>
      </div>

      {/* Plan Distribution */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Subscription Plan Distribution</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-black text-black">{platformStats?.planDistribution?.starter || 0}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Starter Plans</div>
              <div className="text-[10px] text-gray-400">₹2,999/month • 25 users</div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-black text-black">{platformStats?.planDistribution?.professional || 0}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Professional Plans</div>
              <div className="text-[10px] text-gray-400">₹9,999/month • 100 users</div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-black text-black">{platformStats?.planDistribution?.enterprise || 0}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Enterprise Plans</div>
              <div className="text-[10px] text-gray-400">₹24,999/month • 500 users</div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-black text-black">{platformStats?.planDistribution?.unlimited || 0}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Unlimited Plans</div>
              <div className="text-[10px] text-gray-400">₹49,999/month • Unlimited</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Management */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center uppercase tracking-tight">
            <span className="mr-2">🏢</span>
            Organization Management
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => setShowCreateOrg(true)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold uppercase tracking-widest text-xs text-black">Create New Organization</div>
                  <div className="text-[10px] text-gray-500">Set up new tenant with manager license</div>
                </div>
                <div className="text-xl">➕</div>
              </div>
            </button>

            <button className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold uppercase tracking-widest text-xs text-black">Manage Subscriptions</div>
                  <div className="text-[10px] text-gray-500">View and manage organization licenses</div>
                </div>
                <div className="text-xl">📋</div>
              </div>
            </button>

            <button className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold uppercase tracking-widest text-xs text-black">Platform Analytics</div>
                  <div className="text-[10px] text-gray-500">View detailed platform metrics</div>
                </div>
                <div className="text-xl">📈</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Platform Activity */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center uppercase tracking-tight">
            <span className="mr-2">⚡</span>
            Recent Platform Activity
          </h2>

          <div className="space-y-3">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                💼
              </div>
              <div className="flex-1">
                <div className="font-bold uppercase tracking-widest text-[10px] text-black">
                  New Organization Created
                </div>
                <div className="text-[10px] text-gray-500">
                  Demo Corporation upgraded to Professional plan
                </div>
              </div>
              <div className="text-[10px] text-gray-400 font-bold">2h ago</div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                💰
              </div>
              <div className="flex-1">
                <div className="font-bold uppercase tracking-widest text-[10px] text-black">
                  Payment Processed
                </div>
                <div className="text-[10px] text-gray-500">
                  ₹9,999 subscription renewal - Acme Corp
                </div>
              </div>
              <div className="text-[10px] text-gray-400 font-bold">4h ago</div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                📊
              </div>
              <div className="flex-1">
                <div className="font-bold uppercase tracking-widest text-[10px] text-black">
                  Usage Milestone
                </div>
                <div className="text-[10px] text-gray-500">
                  Platform reached 1,000+ active users
                </div>
              </div>
              <div className="text-[10px] text-gray-400 font-bold">1d ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Management Tools */}
      <div className="bg-black rounded-xl p-6 text-white overflow-hidden relative">
        <h2 className="text-xl font-bold mb-6 flex items-center uppercase tracking-tight relative z-10">
          <span className="mr-2">🛠️</span>
          Platform Management Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-colors text-left">
            <div className="text-sm font-bold uppercase tracking-widest flex items-center">
              <span className="mr-2">🏢</span>Create Organization
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Set up new tenant with licensing</div>
          </button>

          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-colors text-left">
            <div className="text-sm font-bold uppercase tracking-widest flex items-center">
              <span className="mr-2">💳</span>Billing Management
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Process payments and renewals</div>
          </button>

          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-colors text-left">
            <div className="text-sm font-bold uppercase tracking-widest flex items-center">
              <span className="mr-2">📈</span>Platform Analytics
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Detailed usage and revenue analytics</div>
          </button>

          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-colors text-left">
            <div className="text-sm font-bold uppercase tracking-widest flex items-center">
              <span className="mr-2">⚙️</span>System Config
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Platform-wide settings and features</div>
          </button>
        </div>
      </div>

      {/* Organization List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Organizations Overview</h2>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-gray-900">Demo Corporation</div>
                      <div className="text-xs text-gray-400 uppercase tracking-widest">DEMO001</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-emerald-100 text-emerald-800">
                      Professional
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-bold">2 / 100 users</div>
                    <div className="text-[10px] text-gray-400">3 managers allowed</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    ₹9,999/month
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button className="text-black font-bold uppercase tracking-widest text-[10px] hover:underline">View</button>
                      <button className="text-black font-bold uppercase tracking-widest text-[10px] hover:underline">Manage</button>
                      <button className="text-black font-bold uppercase tracking-widest text-[10px] hover:underline">Billing</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Organization Modal */}
      {showCreateOrg && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                Create New Organization
              </h3>
              <p className="text-gray-500 mt-1">
                Set up a new tenant organization with manager license
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Organization Details */}
              <div className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Organization Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                        Organization Name *
                      </label>
                      <input
                        type="text"
                        value={newOrgForm.name}
                        onChange={(e) => setNewOrgForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                        placeholder="Acme Corporation"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                        Industry *
                      </label>
                      <select
                        value={newOrgForm.industry}
                        onChange={(e) => setNewOrgForm(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                      >
                        <option value="">Select Industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        value={newOrgForm.contact_email}
                        onChange={(e) => setNewOrgForm(prev => ({ ...prev, contact_email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                        placeholder="admin@acmecorp.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                        Subscription Plan *
                      </label>
                      <select
                        value={newOrgForm.plan}
                        onChange={(e) => setNewOrgForm(prev => ({ ...prev, plan: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                      >
                        <option value="starter">Starter - ₹2,999/month (25 users)</option>
                        <option value="professional">Professional - ₹9,999/month (100 users)</option>
                        <option value="enterprise">Enterprise - ₹24,999/month (500 users)</option>
                        <option value="unlimited">Unlimited - ₹49,999/month (Unlimited users)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Manager Account</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                        Manager Username *
                      </label>
                      <input
                        type="text"
                        value={newOrgForm.manager_user.username}
                        onChange={(e) => setNewOrgForm(prev => ({
                          ...prev,
                          manager_user: { ...prev.manager_user, username: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                        placeholder="manager123"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                        Manager Email *
                      </label>
                      <input
                        type="email"
                        value={newOrgForm.manager_user.email}
                        onChange={(e) => setNewOrgForm(prev => ({
                          ...prev,
                          manager_user: { ...prev.manager_user, email: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                        placeholder="manager@acmecorp.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                        Manager Full Name *
                      </label>
                      <input
                        type="text"
                        value={newOrgForm.manager_user.full_name}
                        onChange={(e) => setNewOrgForm(prev => ({
                          ...prev,
                          manager_user: { ...prev.manager_user, full_name: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                        Temporary Password *
                      </label>
                      <input
                        type="password"
                        value={newOrgForm.manager_user.password}
                        onChange={(e) => setNewOrgForm(prev => ({
                          ...prev,
                          manager_user: { ...prev.manager_user, password: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                        placeholder="Temporary password"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                    <button onClick={clearError} className="ml-2 underline text-sm">
                      Dismiss
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateOrg(false)
                    clearError()
                  }}
                  className="px-4 py-2 border rounded-md font-bold uppercase tracking-widest text-xs"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrganization}
                  disabled={loading}
                  className="px-4 py-2 bg-black text-white rounded-md font-bold uppercase tracking-widest text-xs"
                >
                  {loading ? 'Creating...' : 'Create Organization'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlatformAdminDashboard