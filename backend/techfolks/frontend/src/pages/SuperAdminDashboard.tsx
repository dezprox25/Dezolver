import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@store/authStore'
import { Navigate } from 'react-router-dom'
import { config } from '@/config'
import toast from 'react-hot-toast'

interface Admin {
  id: string
  username: string
  email: string
  full_name?: string
  phone_number?: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login?: string
  contribution_points: number
  managedStudents: number
  managers?: number
  students?: number
}

interface AdminStats {
  totalAdmins: number
  activeAdmins: number
  verifiedAdmins: number
  inactiveAdmins: number
}

interface SuperAdmin {
  id: string
  username: string
  email: string
  full_name?: string
  is_active: boolean
  created_at: string
  last_login?: string
}

const SuperAdminDashboard = () => {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'admins' | 'super-admins' | 'stats'>('admins')
  const [admins, setAdmins] = useState<Admin[]>([])
  const [superAdmins, setSuperAdmins] = useState<SuperAdmin[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newAdmin, setNewAdmin] = useState<{
    username: string
    email: string
    full_name?: string
    phone_number?: string
    password?: string
    title?: string
    hod_name?: string
    hod_department?: string
    college_locations?: string
    group_limit?: number
    contests_limit?: number
    manager_limit?: number
    subscription_months?: number
    subscription_total?: number
    auto_unsubscribe?: boolean
  }>({
    username: '',
    email: '',
    full_name: '',
    phone_number: '',
    password: '',
    title: '',
    hod_name: '',
    hod_department: '',
    college_locations: '',
    group_limit: 0,
    contests_limit: 0,
    manager_limit: 0,
    subscription_months: 0,
    subscription_total: 0,
    auto_unsubscribe: true
  })
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null)

  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null)
  const [selectedAdminDetail, setSelectedAdminDetail] = useState<any | null>(null)

  // Redirect if not super admin
  if (!user || user.role !== 'super_admin') {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    fetchAdmins()
    fetchAdminStats()
  }, [])

  const handleNewAdminChange = (field: string, value: any) => {
    setNewAdmin(prev => {
      // auto-generate username from full name when username is empty
      if (field === 'full_name') {
        const full = String(value || '')
        if ((!prev.username || prev.username.trim() === '') && full.trim() !== '') {
          const generated = full
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, '_')
          return { ...prev, full_name: full, username: generated }
        }
      }

      // numeric fields
      if (['group_limit', 'contests_limit', 'manager_limit', 'subscription_months', 'subscription_total'].includes(field)) {
        const num = Number(value) || 0
        return { ...prev, [field]: num }
      }

      // checkbox
      if (field === 'auto_unsubscribe') {
        return { ...prev, auto_unsubscribe: Boolean(value) }
      }

      return { ...prev, [field]: value }
    })
  }

  const handleCreateAdminSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
      toast.error('Please fill username, email and password')
      return
    }

    try {
      setCreating(true)
      const token = localStorage.getItem(config.auth.tokenKey)
      const url = editingAdminId
        ? `${config.api.baseUrl}/super-admin/admins/${editingAdminId}`
        : `${config.api.baseUrl}/super-admin/admins`

      const method = editingAdminId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
      })

      if (response.ok) {
        toast.success(editingAdminId ? 'Admin updated' : 'Admin created')
        setShowCreateModal(false)
        setEditingAdminId(null)
        setNewAdmin({
          username: '', email: '', full_name: '', phone_number: '', password: '',
          title: '', hod_name: '', hod_department: '', college_locations: '',
          group_limit: 0, contests_limit: 0, manager_limit: 0,
          subscription_months: 0, subscription_total: 0, auto_unsubscribe: true
        })
        fetchAdmins()
        fetchAdminStats()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to save admin')
      }
    } catch (error) {
      console.error('Error creating/updating admin:', error)
      toast.error('Error saving admin')
    } finally {
      setCreating(false)
    }
  }

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem(config.auth.tokenKey)
      const response = await fetch(`${config.api.baseUrl}/super-admin/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAdmins(data.data?.admins || [])
      } else {
        toast.error('Failed to fetch admins')
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast.error('Error loading admins')
    } finally {
      setLoading(false)
    }
  }

  const fetchSuperAdmins = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem(config.auth.tokenKey)
      const response = await fetch(`${config.api.baseUrl}/super-admin/super-admins`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSuperAdmins(data.data?.superAdmins || [])
      } else {
        toast.error('Failed to fetch super admins')
      }
    } catch (error) {
      console.error('Error fetching super admins:', error)
      toast.error('Error loading super admins')
    } finally {
      setLoading(false)
    }
  }

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem(config.auth.tokenKey)
      const response = await fetch(`${config.api.baseUrl}/super-admin/admins/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    }
  }

  // create temporary demo data for grid/list flow


  const selectCollege = (title: string | null) => {
    setSelectedCollegeId(title)
    setSelectedAdminDetail(null)
  }

  const handleEditClick = (admin: any) => {
    // prefill the modal with admin data (use admin fields if available)
    setNewAdmin(prev => ({
      ...prev,
      username: admin.username || '',
      email: admin.email || '',
      full_name: admin.full_name || '',
      phone_number: admin.phone_number || '',
      title: admin.title || admin.college?.title || prev.title || '',
      hod_name: admin.hod_name || admin.college?.hod_name || prev.hod_name || '',
      hod_department: admin.hod_department || admin.college?.hod_department || prev.hod_department || '',
      college_locations: admin.college_locations || admin.college?.college_locations || prev.college_locations || '',
      group_limit: admin.group_limit ?? admin.college?.group_limit ?? prev.group_limit,
      contests_limit: admin.contests_limit ?? admin.college?.contests_limit ?? prev.contests_limit,
      manager_limit: admin.manager_limit ?? admin.college?.manager_limit ?? prev.manager_limit,
      subscription_months: admin.subscription_months ?? admin.college?.subscription_months ?? prev.subscription_months,
      subscription_total: admin.subscription_total ?? admin.college?.subscription_total ?? prev.subscription_total,
      auto_unsubscribe: admin.auto_unsubscribe ?? admin.college?.auto_unsubscribe ?? prev.auto_unsubscribe
    }))
    setEditingAdminId(admin.id)
    setShowCreateModal(true)
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return

    try {
      const token = localStorage.getItem(config.auth.tokenKey)
      const response = await fetch(`${config.api.baseUrl}/super-admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Admin deleted')
        setAdmins(prev => prev.filter(a => a.id !== adminId))
        fetchAdminStats()
      } else {
        toast.error('Failed to delete admin')
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
      toast.error('Error deleting admin')
    }
  }


  const openAdminDetails = (admin: any) => {
    // Derive college info from the admin record if available, otherwise '-'
    const college = {
      title: admin.title || admin.college?.title || '-',
      hod_name: admin.hod_name || admin.college?.hod_name || '-',
      hod_department: admin.hod_department || admin.college?.hod_department || '-',
      college_locations: admin.college_locations || admin.college?.college_locations || '-',
      group_limit: admin.group_limit ?? admin.college?.group_limit ?? '-',
      contests_limit: admin.contests_limit ?? admin.college?.contests_limit ?? '-',
      manager_limit: admin.manager_limit ?? admin.college?.manager_limit ?? '-',
      subscription_months: admin.subscription_months ?? admin.college?.subscription_months ?? '-',
      subscription_total: admin.subscription_total ?? admin.college?.subscription_total ?? '-',
      auto_unsubscribe: admin.auto_unsubscribe ?? admin.college?.auto_unsubscribe ?? '-'
    }
    setSelectedAdminDetail({ admin, college })
  }

  const addManagerToAdmin = (adminId: string) => {
    // update primary admins list
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, managers: (a.managers || 0) + 1 } : a))
  }

  const addStudentToAdmin = (adminId: string) => {
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, students: (a.students || 0) + 1 } : a))
  }

  /*
  const handlePromoteToSuperAdmin = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to promote ${username} to Super Admin ? `)) {
      return
    }

    try {
      const token = localStorage.getItem(config.auth.tokenKey)
      const response = await fetch(`${config.api.baseUrl} /super-admin/users / ${userId}/promote-super-admin`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success(`${username} promoted to Super Admin`)
        fetchAdmins()
        fetchSuperAdmins()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to promote user')
      }
    } catch (error) {
      console.error('Error promoting user:', error)
      toast.error('Error promoting user to Super Admin')
    }
  }

  const handleDemoteToAdmin = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to demote ${username} from Super Admin to Admin?`)) {
      return
    }

    try {
      const token = localStorage.getItem(config.auth.tokenKey)
      const response = await fetch(`${config.api.baseUrl}/super-admin/users/${userId}/demote-to-admin`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success(`${username} demoted to Admin`)
        fetchAdmins()
        fetchSuperAdmins()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to demote user')
      }
    } catch (error) {
      console.error('Error demoting user:', error)
      toast.error('Error demoting Super Admin')
    }
  }
  */

  const filteredAdmins = admins.filter(admin =>
    admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSuperAdmins = superAdmins.filter(sa =>
    sa.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sa.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sa.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // derive colleges from API admin data (group by title/college field). Use '-' when missing.
  const collegesFromAdmins = Object.values(
    filteredAdmins.reduce((acc: any, a: any) => {
      const title = a.title || a.college?.title || a.college_title || '-'
      if (!acc[title]) acc[title] = { title, admins: [] }
      acc[title].admins.push(a)
      return acc
    }, {})
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900"> Admin Management</h1>
            <p className="mt-2 text-gray-600">Manage admins and super admins</p>
          </div>
          <div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold uppercase tracking-widest rounded-md shadow-sm text-white bg-black hover:bg-gray-900"
            >
              Create Admin
            </button>
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-40" onClick={() => setShowCreateModal(false)} />
            <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-lg mx-4">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Create Admin</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <form onSubmit={handleCreateAdminSubmit} className="px-6 py-6">
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Title (e.g., College Name)"
                    value={newAdmin.title}
                    onChange={(e) => handleNewAdminChange('title', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full name (college name)"
                      value={newAdmin.full_name}
                      onChange={(e) => handleNewAdminChange('full_name', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Username (auto from college name if empty)"
                      value={newAdmin.username}
                      onChange={(e) => handleNewAdminChange('username', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="HOD/Admin name"
                      value={newAdmin.hod_name}
                      onChange={(e) => handleNewAdminChange('hod_name', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 text-black"
                    />
                    <input
                      type="text"
                      placeholder="HOD department (optional)"
                      value={newAdmin.hod_department}
                      onChange={(e) => handleNewAdminChange('hod_department', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 text-black"
                    />
                  </div>

                  <textarea
                    placeholder="College locations (comma separated)"
                    value={newAdmin.college_locations}
                    onChange={(e) => handleNewAdminChange('college_locations', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email"
                      value={newAdmin.email}
                      onChange={(e) => handleNewAdminChange('email', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Phone number (optional)"
                      value={newAdmin.phone_number}
                      onChange={(e) => handleNewAdminChange('phone_number', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <input
                    type="password"
                    placeholder="Password"
                    value={newAdmin.password}
                    onChange={(e) => handleNewAdminChange('password', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="number"
                      min={0}
                      placeholder="Group limit (num)"
                      value={String(newAdmin.group_limit || '')}
                      onChange={(e) => handleNewAdminChange('group_limit', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Contests limit (num)"
                      value={String(newAdmin.contests_limit || '')}
                      onChange={(e) => handleNewAdminChange('contests_limit', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Manager limit (num)"
                      value={String(newAdmin.manager_limit || '')}
                      onChange={(e) => handleNewAdminChange('manager_limit', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <input
                      type="number"
                      min={0}
                      placeholder="Subscription months"
                      value={String(newAdmin.subscription_months || '')}
                      onChange={(e) => handleNewAdminChange('subscription_months', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Total payment"
                      value={String(newAdmin.subscription_total || '')}
                      onChange={(e) => handleNewAdminChange('subscription_total', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!newAdmin.auto_unsubscribe}
                        onChange={(e) => handleNewAdminChange('auto_unsubscribe', e.target.checked)}
                        className="h-4 w-4"
                      />
                      Auto unsubscribe when duration ends
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-md border">Cancel</button>
                  <button type="submit" disabled={creating} className="px-4 py-2 rounded-md bg-black text-white font-bold uppercase tracking-widest text-sm">
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admin detail modal (temporary) */}
        {selectedAdminDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-40" onClick={() => setSelectedAdminDetail(null)} />
            <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-md mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Admin Details</h3>
                <button onClick={() => setSelectedAdminDetail(null)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="border-b pb-2 border-gray-100">
                  <div className="font-medium text-gray-900">Admin</div>
                  <div className="mt-1"><strong>Username:</strong> {selectedAdminDetail.admin.username || '-'}</div>
                  <div><strong>Full name:</strong> {selectedAdminDetail.admin.full_name || '-'}</div>
                  <div><strong>Email:</strong> {selectedAdminDetail.admin.email || '-'}</div>
                  <div><strong>Phone:</strong> {selectedAdminDetail.admin.phone_number || '-'}</div>
                  <div><strong>Managers:</strong> {selectedAdminDetail.admin.managers ?? '-'}</div>
                  <div><strong>Students:</strong> {selectedAdminDetail.admin.students ?? '-'}</div>
                </div>

                <div>
                  <div className="font-medium text-gray-900">College</div>
                  {selectedAdminDetail.college ? (
                    <div className="mt-1 space-y-1">
                      <div><strong>Title:</strong> {selectedAdminDetail.college.title}</div>
                      <div><strong>HOD:</strong> {selectedAdminDetail.college.hod_name || '-'}</div>
                      <div><strong>HOD Department:</strong> {selectedAdminDetail.college.hod_department || '-'}</div>
                      <div><strong>Locations:</strong> {selectedAdminDetail.college.college_locations || '-'}</div>
                      <div><strong>Group limit:</strong> {selectedAdminDetail.college.group_limit}</div>
                      <div><strong>Contests limit:</strong> {selectedAdminDetail.college.contests_limit}</div>
                      <div><strong>Manager limit:</strong> {selectedAdminDetail.college.manager_limit}</div>
                      <div><strong>Subscription months:</strong> {selectedAdminDetail.college.subscription_months}</div>
                      <div><strong>Subscription total:</strong> {selectedAdminDetail.college.subscription_total}</div>
                      <div><strong>Auto unsubscribe:</strong> {selectedAdminDetail.college.auto_unsubscribe ? 'Yes' : 'No'}</div>
                    </div>
                  ) : (
                    <div className="mt-1">No college details available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Admins</h3>
              <p className="text-3xl font-black text-black mt-2">{stats.totalAdmins}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Active Admins</h3>
              <p className="text-3xl font-black text-emerald-600 mt-2">{stats.activeAdmins}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Verified Admins</h3>
              <p className="text-3xl font-black text-black mt-2">{stats.verifiedAdmins}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Inactive Admins</h3>
              <p className="text-3xl font-black text-gray-400 mt-2">{stats.inactiveAdmins}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-50 rounded-lg border-gray-500/20 border-2">
          <div className="border-b border-gray-200 dark:border-gray-500">
            <nav className="flex -mb-px">
              <button
                onClick={() => {
                  setActiveTab('admins')
                  fetchAdmins()
                }}
                className={`px-6 py-4 text-sm font-bold uppercase tracking-widest ${activeTab === 'admins'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Admins ({admins.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('super-admins')
                  fetchSuperAdmins()
                }}
                className={`px-6 py-4 text-sm font-bold uppercase tracking-widest ${activeTab === 'super-admins'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Super Admins ({superAdmins.length})
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2 w-full md:w-2/3">
                <input
                  type="text"
                  placeholder="Search by username, email, or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                {/* View toggle removed - Grid only */}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-50">Loading...</p>
              </div>
            ) : (
              <>
                {/* Admins Grid View Only */}
                {activeTab === 'admins' && (
                  <div>
                    {filteredAdmins.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">No admins found</div>
                    ) : (
                      <>
                        {/* Grid view: derive colleges from API admin data */}
                        {!selectedCollegeId ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {collegesFromAdmins.map((col: any) => (
                              <div
                                key={col.title}
                                onClick={() => selectCollege(col.title)}
                                className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                              >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                <div className="p-6">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                                      {col.title.charAt(0)}
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                      {col.admins.length} Admin{col.admins.length !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1" title={col.title}>
                                    {col.title}
                                  </h3>
                                  <div className="space-y-2 text-sm text-gray-500">
                                    {col.admins[0]?.hod_name && (
                                      <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{col.admins[0].hod_name}</span>
                                      </div>
                                    )}
                                    {col.admins[0]?.college_locations && (
                                      <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="line-clamp-1">{col.admins[0].college_locations}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                  <span className="text-xs font-semibold text-blue-600 group-hover:underline">View Details</span>
                                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>
                            <div className="mb-6 flex items-center justify-between">
                              <button
                                onClick={() => selectCollege(null)}
                                className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-400 transition-colors shadow-sm">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                  </svg>
                                </div>
                                Back to Colleges
                              </button>
                              <h3 className="text-xl font-bold text-gray-900">
                                {collegesFromAdmins.find((c: any) => c.title === selectedCollegeId)?.title || selectedCollegeId}
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                              {collegesFromAdmins.find((c: any) => c.title === selectedCollegeId)?.admins.map((ad: any) => (
                                <div key={ad.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                  <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white font-bold text-lg shadow-md">
                                          {ad.username.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-gray-900 text-base">{ad.full_name || ad.username}</h4>
                                          <p className="text-sm text-gray-500">@{ad.username}</p>
                                        </div>
                                      </div>
                                      <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${ad.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {ad.is_active ? 'Active' : 'Inactive'}
                                      </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                      <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="truncate">{ad.email}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>{ad.phone_number || 'No phone'}</span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100 mb-6">
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{ad.managers || 0}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Managers</div>
                                      </div>
                                      <div className="text-center border-l border-gray-100">
                                        <div className="text-2xl font-bold text-gray-900">{ad.students || 0}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Students</div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                      <button
                                        onClick={() => handleEditClick(ad)}
                                        className="px-3 py-2 bg-blue-600 hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteAdmin(ad.id)}
                                        className="px-3 py-2 bg-red-600 hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        onClick={() => openAdminDetails(ad)}
                                        className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                                      >
                                        Details
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Super Admins Grid View */}
                {activeTab === 'super-admins' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSuperAdmins.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
                        No super admins found
                      </div>
                    ) : (
                      filteredSuperAdmins.map(sa => (
                        <div key={sa.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                  {sa.username.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-base">{sa.full_name || sa.username}</h4>
                                  <p className="text-sm text-gray-500">@{sa.username}</p>
                                </div>
                              </div>
                              <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${sa.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {sa.is_active ? 'Active' : 'Inactive'}
                              </div>
                            </div>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="truncate">{sa.email}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Last login: {sa.last_login ? new Date(sa.last_login).toLocaleDateString() : 'Never'}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
                              <button
                                onClick={() => handleEditClick(sa as any)}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAdmin(sa.id)}
                                disabled={sa.id === user.id}
                                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${sa.id === user.id ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
