import { useEffect, useState } from 'react'
import { useAuthStore } from '@store/authStore'
import { useEmployeeStore } from '@store/employeeStore'
import { useCertificatesStore } from '@store/certificatesStore'
import { usePayrollStore } from '@store/payrollStore'
import DashboardCard from '@components/common/DashboardCard'
import { Navigate } from 'react-router-dom'

const EliteAdminDashboard = () => {
  const { user } = useAuthStore()
  const { employees, fetchEmployees } = useEmployeeStore()
  const { certificates, templates, fetchTemplates, searchCertificates } = useCertificatesStore()
  const { summary, fetchPayrollSummary } = usePayrollStore()

  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeEmployees: 0,
    totalCertificates: 0,
    monthlyPayroll: 0,
    pendingVerifications: 0,
    systemHealth: 98
  })

  const [recentActivity] = useState([
    { type: 'certificate', message: 'Certificate generated for Full Stack Development', time: '2 hours ago', icon: '🎓' },
    { type: 'payroll', message: 'Monthly payroll processed for 15 employees', time: '1 day ago', icon: '💰' },
    { type: 'employee', message: 'New employee added: John Doe', time: '2 days ago', icon: '👤' },
    { type: 'system', message: 'System backup completed successfully', time: '3 days ago', icon: '💾' }
  ])

  // Initial data fetching
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchEmployees()
      fetchTemplates()
      searchCertificates({ limit: 100 })
      fetchPayrollSummary({
        start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
      })
    }
  }, [user?.id]) // Only re-fetch if user changes

  // Sync store data to local stats
  useEffect(() => {
    if (user?.role === 'admin') {
      setSystemStats({
        totalUsers: 1250,
        activeEmployees: employees.filter(emp => emp.is_active).length,
        totalCertificates: certificates.length,
        monthlyPayroll: summary?.totalNetAmount || 0,
        pendingVerifications: employees.filter(emp => emp.bank_details && !emp.bank_details.is_verified).length,
        systemHealth: 98
      })
    }
  }, [employees, certificates, summary, user?.role])

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/profile" replace />
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-black rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <span className="mr-3">🛠️</span>
                Administrator Console
              </h1>
              <div className="text-sm text-gray-400 font-bold uppercase tracking-widest">System Health</div>
            </div>
          </div>

          {/* Admin Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Total Users</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-xl font-bold">{systemStats.activeEmployees}</div>
              <div className="text-sm text-gray-300">Employees</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-xl font-bold">{systemStats.totalCertificates}</div>
              <div className="text-sm text-gray-300">Certificates</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-xl font-bold">₹{(systemStats.monthlyPayroll / 100000).toFixed(1)}L</div>
              <div className="text-sm text-gray-300">YTD Payroll</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-gray-300">{systemStats.pendingVerifications}</div>
              <div className="text-sm text-gray-300">Pending Tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* HR Management */}
        {/* <DashboardCard
          title="HR Management"
          subtitle="Employee & Payroll Operations"
          value={`${systemStats.activeEmployees} Active`}
          icon="👥"
          gradient="blue"
          href="/admin/hr"
          trend={{
            value: 5,
            label: 'new this month',
            isPositive: true
          }}
        >
          <div className="space-y-2">
            <div className="text-xs text-gray-600">Recent Actions:</div>
            <div className="text-xs">• {systemStats.pendingVerifications} bank verifications pending</div>
            <div className="text-xs">• Monthly payroll ready for processing</div>
          </div>
        </DashboardCard> */}

        {/* Certificate Administration */}
        <DashboardCard
          title="Certificate System"
          subtitle="Templates & Verification"
          value={`${templates.length} Templates`}
          icon="🎖️"
          gradient="green"
          href="/admin/certificates"
        >
          <div className="space-y-2">
            <div className="text-xs text-gray-600">System Status:</div>
            <div className="text-xs">• {systemStats.totalCertificates} total certificates issued</div>
            <div className="text-xs">• All templates active and verified</div>
          </div>
        </DashboardCard>

        {/* System Health */}
        <DashboardCard
          title="System Performance"
          subtitle="Platform Health & Metrics"
          value={`${systemStats.systemHealth}% `}
          icon="📊"
          gradient="purple"
          trend={{
            value: 2,
            label: 'improvement',
            isPositive: true
          }}
        >
          <div className="space-y-2">
            <div className="text-xs text-gray-600">Performance:</div>
            <div className="text-xs">• Database: 99.9% uptime</div>
            <div className="text-xs">• API Response: &lt;145ms avg</div>
          </div>
        </DashboardCard>

        {/* User Management */}
        {/* <DashboardCard
          title="User Management"
          subtitle="Platform Users & Security"
          value={`${systemStats.totalUsers.toLocaleString()} `}
          icon="🔐"
          gradient="orange"
          href="/admin"
        >
          <div className="space-y-2">
            <div className="text-xs text-gray-600">Security Status:</div>
            <div className="text-xs">• All users verified</div>
            <div className="text-xs">• No security incidents</div>
          </div>
        </DashboardCard> */}

        {/* Financial Overview */}
        {/* <DashboardCard
          title="Financial Overview"
          subtitle="Payroll & Expenses"
          value={`₹${(systemStats.monthlyPayroll / 100000).toFixed(1)} L`}
          icon="💰"
          gradient="indigo"
          href="/admin/hr"
        >
          <div className="space-y-2">
            <div className="text-xs text-gray-600">This Year:</div>
            <div className="text-xs">• Total disbursed: ₹{(systemStats.monthlyPayroll / 100000).toFixed(1)}L</div>
            <div className="text-xs">• Average salary: ₹{summary ? Math.round(summary.averageSalary / 1000) : 0}K</div>
          </div>
        </DashboardCard> */}

        {/* Subscription & Billing */}
        {/* <DashboardCard
          title="Subscription & Billing"
          subtitle="Plan Management & Payments"
          icon="💳"
          gradient="gray"
          href="/subscription"
        >
          <div className="space-y-2">
            <div className="text-xs text-gray-600">Billing Status:</div>
            <div className="text-xs">• Manage subscription plans</div>
            <div className="text-xs">• View payment history</div>
            <div className="text-xs">• Razorpay integration active</div>
          </div>
        </DashboardCard> */}

        {/* Quick Actions */}
        {/* <DashboardCard
          title="Quick Actions"
          subtitle="Common Admin Tasks"
          icon="⚡"
          gradient="red"
        >
          <div className="space-y-2">
            <a href="/admin/hr" className="block text-xs text-gray-900 font-bold hover:underline transition-colors">
              → Process Monthly Payroll
            </a>
            <a href="/admin/certificates" className="block text-xs text-gray-900 font-bold hover:underline transition-colors">
              → Create Certificate Template
            </a>
            <a href="/bank-details" className="block text-xs text-gray-900 font-bold hover:underline transition-colors">
              → Manage Bank Details
            </a>
            <a href="/subscription" className="block text-xs text-gray-900 font-bold hover:underline transition-colors">
              → Subscription Management
            </a>
          </div>
        </DashboardCard> */}
      </div>

      {/* Management Modules */}
        {/* HR Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">🏢</span>
            HR Operations Center
          </h2>

          <div className="space-y-4">
            <a
              href="/admin/hr"
              className="block p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-black uppercase tracking-wide">Employee Management</div>
                  <div className="text-sm text-gray-500">Manage employee records and hierarchy</div>
                </div>
                <div className="text-2xl">👥</div>
              </div>
            </a>

            <a
              href="/admin/hr"
              className="block p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-black uppercase tracking-wide">Payroll Processing</div>
                  <div className="text-sm text-gray-500">Calculate and process monthly salaries</div>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </a>

            <a
              href="/bank-details"
              className="block p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-black uppercase tracking-wide">Banking Operations</div>
                  <div className="text-sm text-gray-500">Manage company and employee bank details</div>
                </div>
                <div className="text-2xl">🏦</div>
              </div>
            </a>
          </div>
        </div> */}

        {/* Certificate Operations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-2">🎓</span>
            Certificate Operations
          </h2>

          <div className="space-y-4">
            <a
              href="/admin/certificates"
              className="block p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-indigo-900 dark:text-indigo-300">Template Management</div>
                  <div className="text-sm text-indigo-700 dark:text-indigo-400">Create and manage certificate templates</div>
                </div>
                <div className="text-2xl">🎨</div>
              </div>
            </a>

            <a
              href="/admin/certificates"
              className="block p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-teal-900 dark:text-teal-300">Certificate Verification</div>
                  <div className="text-sm text-teal-700 dark:text-teal-400">Monitor and manage certificate authenticity</div>
                </div>
                <div className="text-2xl">🔍</div>
              </div>
            </a>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-yellow-900 dark:text-yellow-300">Bulk Operations</div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-400">Generate certificates for multiple learners</div>
                </div>
                <div className="text-2xl">📋</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center uppercase tracking-tight">
            <span className="mr-2">📈</span>
            Recent Platform Activity
          </h2>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white shadow-md">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {activity.message}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </div>
                </div>
                <div className={`w - 2 h - 2 rounded - full ${activity.type === 'certificate' ? 'bg-green-500' :
                  activity.type === 'payroll' ? 'bg-blue-500' :
                    activity.type === 'employee' ? 'bg-purple-500' :
                      'bg-gray-500'
                  } `}></div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <a href="/admin" className="text-sm text-primary hover:text-primary-600 font-medium">
              View full activity log →
            </a>
          </div>
        </div>

        {/* System Alerts & Tasks */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center uppercase tracking-tight">
            <span className="mr-2">🔔</span>
            Alerts & Tasks
          </h2>

          <div className="space-y-3">
            {systemStats.pendingVerifications > 0 && (
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-black text-sm uppercase tracking-widest">
                      Bank Verification Required
                    </div>
                    <div className="text-xs text-gray-500">
                      {systemStats.pendingVerifications} employees need bank verification
                    </div>
                  </div>
                  <a href="/bank-details" className="text-black font-black hover:underline text-xs uppercase tracking-tighter">
                    Review →
                  </a>
                </div>
              </div>
            )}

            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-black text-sm uppercase tracking-widest">
                    System Healthy
                  </div>
                  <div className="text-xs text-gray-500">
                    All services running optimally
                  </div>
                </div>
                <div className="text-gray-900 text-xl">✅</div>
              </div>
            </div>

            {/* <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-black text-sm uppercase tracking-widest">
                    Monthly Reports Ready
                  </div>
                  <div className="text-xs text-gray-500"> 
                    Payroll and certificate reports available
                  </div>
                </div>
                <a href="/admin/hr" className="text-black font-black hover:underline text-xs uppercase tracking-tighter">
                  View →
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Administrative Quick Actions */}
      <div className="bg-black rounded-xl p-6 text-white shadow-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center uppercase tracking-widest">
          <span className="mr-2">⚡</span>
          Administrative Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* <button
            onClick={() => window.location.href = '/admin/hr'}
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors text-left"
          >
            <div className="text-lg font-semibold flex items-center">
              <span className="mr-2">🚀</span>Process Payroll
            </div>
            <div className="text-sm text-gray-300 mt-1">Run monthly salary processing</div>
          </button> */}

          <button
            onClick={() => window.location.href = '/admin/certificates'}
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors text-left"
          >
            <div className="text-lg font-semibold flex items-center">
              <span className="mr-2">🎨</span>Create Template
            </div>
            <div className="text-sm text-gray-300 mt-1">Design new certificate template</div>
          </button>

          {/* <button
            onClick={() => window.location.href = '/bank-details'}
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors text-left"
          >
            <div className="text-lg font-semibold flex items-center">
              <span className="mr-2">🏦</span>Verify Banks
            </div>
            <div className="text-sm text-gray-300 mt-1">Approve banking information</div>
          </button> */}

          <button
            onClick={() => window.location.href = '/admin'}
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors text-left"
          >
            <div className="text-lg font-semibold flex items-center">
              <span className="mr-2">📊</span>View Reports
            </div>
            <div className="text-sm text-gray-300 mt-1">System analytics and reports</div>
          </button>

          {/* <button
            onClick={() => window.location.href = '/subscription'}
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors text-left"
          >
            <div className="text-lg font-semibold flex items-center">
              <span className="mr-2">💳</span>Manage Subscription
            </div>
            <div className="text-sm text-gray-300 mt-1">Plans, billing, and payments</div>
          </button> */}
        </div>
      </div>
    </div>
  )
}

export default EliteAdminDashboard