import { useEffect } from 'react'
import { useAuthStore } from '@store/authStore'
import { useOrganizationStore } from '@store/organizationStore'
import DashboardCard from '@components/common/DashboardCard'

const ManagerDashboard = () => {
  const { user } = useAuthStore()
  const {
    myOrganization,
    userLimits,
    fetchMyOrganization,
    fetchUserLimits
  } = useOrganizationStore()

  useEffect(() => {
    if (user?.tier === 'manager' || user?.role === 'manager' || user?.role === 'admin') {
      fetchMyOrganization()
      fetchUserLimits()
    }
  }, [user, fetchMyOrganization, fetchUserLimits])

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'trial':
        return 'bg-blue-100 text-blue-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const utilizationPercentage = myOrganization && myOrganization.user_limit > 0
    ? Math.round((myOrganization.current_users / myOrganization.user_limit) * 100)
    : 0

  const daysUntilRenewal = 25 // This would come from subscription data

  return (
    <div className="space-y-8">
      {/* Manager Header */}
      <div className="bg-black rounded-xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <span className="mr-3">👑</span>
                Organization Manager
              </h1>
              <p className="text-blue-100 text-lg">
                {myOrganization?.name || 'Your Organization'} • {myOrganization?.plan?.charAt(0).toUpperCase()}{myOrganization?.plan?.slice(1)} Plan
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black">{utilizationPercentage}%</div>
              <div className="text-sm text-gray-400">License Utilization</div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-xl font-black">{myOrganization?.current_users || 0}/{myOrganization?.user_limit || 0}</div>
              <div className="text-sm text-gray-400">Users</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-xl font-black">{myOrganization?.current_managers || 0}/{myOrganization?.manager_limit || 0}</div>
              <div className="text-sm text-gray-400">Managers</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-xl font-black">{daysUntilRenewal}</div>
              <div className="text-sm text-gray-400">Days to Renewal</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className={`text-xl font-black ${myOrganization?.status === 'active' ? 'text-white' : 'text-gray-300'}`}>
                {myOrganization?.status?.toUpperCase() || 'UNKNOWN'}
              </div>
              <div className="text-sm text-gray-400">Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* License Usage & Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="User Management"
          subtitle="Manage organization users"
          value={`${userLimits?.remainingSlots || 0} Slots Left`}
          icon="👥"
          gradient="gray"
          href="/employees"
        >
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <span>Used</span>
              <span>{userLimits?.currentUsers || 0}/{userLimits?.userLimit || 0}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-black h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${userLimits && userLimits.userLimit > 0 ? (userLimits.currentUsers / userLimits.userLimit) * 100 : 0}%` }}
              />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="HR Operations"
          subtitle="Employee & payroll management"
          value="5 Certificates"
          icon="🏢"
          gradient="gray"
          href="/admin/hr"
        >
          <div className="space-y-1 text-gray-500">
            <div className="text-[10px] uppercase tracking-widest font-bold">Payroll cycles: 3</div>
            <div className="text-[10px] uppercase tracking-widest font-bold">Active employees: {myOrganization?.current_users || 0}</div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Subscription"
          subtitle="Plan and billing info"
          value={myOrganization?.plan?.charAt(0).toUpperCase() + (myOrganization?.plan?.slice(1) || '')}
          icon="💳"
          gradient="gray"
          href="/subscription"
        >
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">
              ₹{myOrganization?.plan === 'starter' ? '2,999' :
                myOrganization?.plan === 'professional' ? '9,999' :
                  myOrganization?.plan === 'enterprise' ? '24,999' : '49,999'}/month
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Renews in {daysUntilRenewal} days</div>
            <div className="mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${getSubscriptionStatusColor(myOrganization?.status || 'unknown')}`}>
                {myOrganization?.status || 'unknown'}
              </span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Quick Actions"
          subtitle="Common manager tasks"
          icon="⚡"
          gradient="gray"
        >
          <div className="space-y-2">
            <a href="/employees" className="block text-[10px] font-bold uppercase tracking-widest text-black hover:underline transition-colors">
              → Add Team Member
            </a>
            <a href="/admin/hr" className="block text-[10px] font-bold uppercase tracking-widest text-black hover:underline transition-colors">
              → Process Payroll
            </a>
            <a href="/certificates" className="block text-[10px] font-bold uppercase tracking-widest text-black hover:underline transition-colors">
              → Generate Certificate
            </a>
          </div>
        </DashboardCard>
      </div>

      {/* User Limit Warning */}
      {utilizationPercentage > 80 && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-lg font-black text-black uppercase tracking-tight">
                Approaching User Limit
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                You're using {myOrganization?.current_users} of {myOrganization?.user_limit} users ({utilizationPercentage}% capacity).
                Consider upgrading to add more team members.
              </p>
              <a href="/subscription" className="mt-3 inline-block px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-800 transition-colors">
                Upgrade Plan
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Manager Tools */}
      <div className="bg-black rounded-xl p-6 text-white relative overflow-hidden">
        <h2 className="text-xl font-bold mb-6 flex items-center uppercase tracking-tight relative z-10">
          <span className="mr-2">🛠️</span>
          Manager Tools & Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <a
            href="/employees"
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-colors text-left"
          >
            <div className="text-sm font-bold uppercase tracking-widest flex items-center">
              <span className="mr-2">👤</span>Add Team Member
            </div>
            <div className="text-[10px] text-gray-400 mt-1">{userLimits?.remainingSlots || 0} slots available</div>
          </a>

          <a
            href="/admin/hr"
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-colors text-left"
          >
            <div className="text-sm font-bold uppercase tracking-widest flex items-center">
              <span className="mr-2">💰</span>Process Payroll
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Monthly salary processing</div>
          </a>

          <a
            href="/admin/certificates"
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-colors text-left"
          >
            <div className="text-sm font-bold uppercase tracking-widest flex items-center">
              <span className="mr-2">🎓</span>Issue Certificates
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Create and manage certificates</div>
          </a>

          <a
            href="/subscription"
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-colors text-left"
          >
            <div className="text-sm font-bold uppercase tracking-widest flex items-center">
              <span className="mr-2">📈</span>Upgrade Plan
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Get more users and features</div>
          </a>
        </div>
      </div>

      {/* Feature Access & Limits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Features */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center uppercase tracking-tight">
            <span className="mr-2">✨</span>
            Available Features
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-black text-xl">👥</span>
                <div>
                  <div className="font-bold uppercase tracking-widest text-[10px] text-black">HR Management</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">Employee records and management</div>
                </div>
              </div>
              <span className="text-black text-xl">
                {myOrganization?.features_enabled?.hr_management ? '✅' : '❌'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-black text-xl">💰</span>
                <div>
                  <div className="font-bold uppercase tracking-widest text-[10px] text-black">Payroll Processing</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">Automated salary calculations</div>
                </div>
              </div>
              <span className="text-black text-xl">
                {myOrganization?.features_enabled?.payroll_processing ? '✅' : '❌'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-black text-xl">🎓</span>
                <div>
                  <div className="font-bold uppercase tracking-widest text-[10px] text-black">Certificate Automation</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">Generate and manage certificates</div>
                </div>
              </div>
              <span className="text-black text-xl">
                {myOrganization?.features_enabled?.certificate_automation ? '✅' : '❌'}
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg border ${myOrganization?.features_enabled?.api_access
              ? 'bg-gray-50 border-gray-100'
              : 'bg-gray-50 border-gray-100 opacity-50'
              }`}>
              <div className="flex items-center space-x-3">
                <span className={`text-xl ${myOrganization?.features_enabled?.api_access ? 'text-black' : 'text-gray-400'}`}>🔗</span>
                <div>
                  <div className={`font-bold uppercase tracking-widest text-[10px] ${myOrganization?.features_enabled?.api_access ? 'text-black' : 'text-gray-400'}`}>
                    API Access
                  </div>
                  <div className={`text-[10px] uppercase tracking-widest ${myOrganization?.features_enabled?.api_access ? 'text-gray-500' : 'text-gray-400'}`}>
                    {myOrganization?.features_enabled?.api_access ? 'Full API access available' : 'Upgrade to Enterprise for API access'}
                  </div>
                </div>
              </div>
              <span className={`text-xl ${myOrganization?.features_enabled?.api_access ? 'text-black' : 'text-gray-400'}`}>
                {myOrganization?.features_enabled?.api_access ? '✅' : '❌'}
              </span>
            </div>
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center uppercase tracking-tight">
            <span className="mr-2">📊</span>
            Usage Analytics
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black">User Capacity</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-black">{utilizationPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-black h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${utilizationPercentage}%` }}
                />
              </div>
              <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {myOrganization?.current_users || 0} of {myOrganization?.user_limit || 0} users ({userLimits?.remainingSlots || 0} remaining)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-black">5</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Certificates Issued</div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-black">3</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Payroll Cycles</div>
              </div>
            </div>

            <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-center pt-3 border-t border-gray-100">
              💡 Upgrade to Enterprise for advanced analytics and API access
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Management */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center uppercase tracking-tight">Subscription Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Plan */}
          <div className="text-center p-6 bg-black text-white rounded-xl">
            <div className="text-lg font-black mb-2 capitalize uppercase tracking-tight">{myOrganization?.plan || 'Unknown'} Plan</div>
            <div className="text-3xl font-black mb-2">
              ₹{myOrganization?.plan === 'starter' ? '2,999' :
                myOrganization?.plan === 'professional' ? '9,999' :
                  myOrganization?.plan === 'enterprise' ? '24,999' : '49,999'}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-4">per month</div>
            <div className="space-y-1 text-[10px] font-bold uppercase tracking-widest">
              <div>✅ {myOrganization?.user_limit === -1 ? 'Unlimited' : myOrganization?.user_limit} users included</div>
              <div>✅ HR & Employee Management</div>
              <div>{myOrganization?.features_enabled?.payroll_processing ? '✅' : '❌'} Payroll Processing</div>
              <div>✅ Certificate automation</div>
              <div>{myOrganization?.features_enabled?.advanced_analytics ? '✅' : '❌'} Advanced analytics</div>
            </div>
          </div>

          {/* Upgrade Options */}
          <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="text-lg font-black mb-2 text-black uppercase tracking-tight">Enterprise Plan</div>
            <div className="text-3xl font-black mb-2 text-black">₹24,999</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">per month</div>
            <div className="space-y-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
              <div>✅ 500 users included</div>
              <div>✅ All Professional features</div>
              <div>✅ API access</div>
              <div>✅ Custom branding</div>
            </div>
            <a href="/subscription" className="w-full inline-block px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-800 transition-colors">
              Upgrade Plan
            </a>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-black mb-2">Current Usage Summary</div>
              <div className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <div className="flex justify-between">
                  <span>Users:</span>
                  <span className="text-black">{myOrganization?.current_users || 0}/{myOrganization?.user_limit || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Certificates:</span>
                  <span className="text-black">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Payroll cycles:</span>
                  <span className="text-black">3</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 p-3 bg-gray-50 rounded border border-gray-100">
              💡 <strong>Need more users?</strong> Contact support or upgrade your plan to increase your user limit.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard