import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@store/authStore'
import { useGroupsStore } from '@store/groupsStore'
import { useProblemsStore } from '@store/problemsStore'
import { useContestsStore } from '@store/contestsStore'
import { Navigate } from 'react-router-dom'
import { adminAPI } from '@services/api'
import { config } from '@/config'
import toast from 'react-hot-toast'

interface SystemStats {
  total_users: number
  active_users: number
  admin_users: number
  verified_users: number
  total_problems: number
  total_contests: number
  total_submissions: number
  server_uptime: number
  memory_usage: number
  cpu_usage: number
}

interface User {
  id: string
  username: string
  email: string
  full_name?: string
  role: 'admin' | 'user' | 'problem_setter' | 'moderator'
  rating: number
  max_rating: number
  problems_solved: number
  contests_participated_count: number
  created_at: string
  last_login?: string
  is_banned: boolean
  is_verified: boolean
  is_active: boolean
}

const AdminConsolePage = () => {
  const { user } = useAuthStore()
  const { groups, deleteGroup } = useGroupsStore()
  const { problems, deleteProblem } = useProblemsStore()
  const { contests, deleteContest } = useContestsStore()

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'content' | 'system'>('dashboard')
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const fetchRef = useRef(false)

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    if (user?.role === 'admin' && !fetchRef.current) {
      fetchRef.current = true
      fetchSystemStats()
      fetchUsers()
    }
  }, [user?.id])

  const fetchSystemStats = async () => {
    try {
      const response = await adminAPI.getSystemStats() as any
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching system stats:', error)
      toast.error('Error loading system statistics')
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers() as any
      setUsers(response.data?.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Error loading users')
    }
  }

  const handleBanUser = async (userId: string, ban: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${ban ? 'ban' : 'unban'}`, {
        method: 'PUT'
      })

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, is_banned: ban } : u))
        toast.success(`User ${ban ? 'banned' : 'unbanned'} successfully`)
      } else {
        toast.error(`Failed to ${ban ? 'ban' : 'unban'} user`)
      }
    } catch (error) {
      console.error(`Error ${ban ? 'banning' : 'unbanning'} user:`, error)
      toast.error(`Error ${ban ? 'banning' : 'unbanning'} user`)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId))
        toast.success('User deleted successfully')
      } else {
        toast.error('Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error deleting user')
    }
  }

  const handlePromoteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to promote this user to admin?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/promote`, {
        method: 'PUT'
      })

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: 'admin' as const } : u))
        toast.success('User promoted to admin')
      } else {
        toast.error('Failed to promote user')
      }
    } catch (error) {
      console.error('Error promoting user:', error)
      toast.error('Error promoting user')
    }
  }

  const handleBulkAction = (action: 'ban' | 'unban' | 'delete') => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first')
      return
    }

    const actionText = action === 'delete' ? 'delete' : action
    if (confirm(`Are you sure you want to ${actionText} ${selectedUsers.length} selected users?`)) {
      if (action === 'delete') {
        setUsers(users.filter(u => !selectedUsers.includes(u.id)))
      } else {
        setUsers(users.map(u =>
          selectedUsers.includes(u.id) ? { ...u, is_banned: action === 'ban' } : u
        ))
      }
      setSelectedUsers([])
      toast.success(`Selected users ${actionText === 'delete' ? 'deleted' : actionText + 'ned'} successfully`)
    }
  }

  const handleDeleteGroup = (groupId: number) => {
    if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      deleteGroup(groupId)
      toast.success('Group deleted successfully')
    }
  }

  const handleDeleteProblem = (problemId: number) => {
    if (confirm('Are you sure you want to delete this problem? This action cannot be undone.')) {
      deleteProblem(problemId)
      toast.success('Problem deleted successfully')
    }
  }

  const handleDeleteContest = (contestId: number) => {
    if (confirm('Are you sure you want to delete this contest? This action cannot be undone.')) {
      deleteContest(contestId)
      toast.success('Contest deleted successfully')
    }
  }

  const clearAllData = async () => {
    if (confirm('Are you sure you want to clear ALL data? This will delete all users, groups, problems, and contests. This action cannot be undone.')) {
      if (confirm('This is your final warning. This will permanently delete ALL data. Are you absolutely sure?')) {
        try {
          await adminAPI.clearData()
          toast.success('All data cleared successfully')
          window.location.href = '/login'
        } catch (error) {
          console.error('Error clearing data:', error)
          toast.error('Error clearing data')
        }
      }
    }
  }

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">Admin Console</h1>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          Master control panel for {config.app.name} platform
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-10 bg-gray-50 p-1.5 rounded-xl w-fit border border-gray-100">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'users', label: 'User Management', icon: '👥' },
          { id: 'content', label: 'Content Management', icon: '📝' },
          { id: 'system', label: 'System Controls', icon: '⚙️' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${activeTab === tab.id
              ? 'bg-black text-white shadow-lg'
              : 'text-gray-400'
              }`}
          >
            <span className="mr-2">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && stats && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-black text-black">
                {stats.total_users.toLocaleString()}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Total Users</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-black text-black">
                {stats.active_users.toLocaleString()}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Active Users</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-black text-black">
                {stats.total_problems}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Problems</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-black text-black">
                {stats.total_submissions.toLocaleString()}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Submissions</div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Memory Usage</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black">{stats.memory_usage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-black h-1.5 rounded-full"
                    style={{ width: `${stats.memory_usage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">CPU Usage</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black">{stats.cpu_usage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-black h-1.5 rounded-full"
                    style={{ width: `${stats.cpu_usage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Server Uptime</div>
                <div className="text-xl font-black text-black">
                  {Math.round(stats.server_uptime)}s
                </div>
              </div>
            </div>
          </div>

          {/* Admin Quick Actions */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6">Admin Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* <a
                href="/admin/hr"
                className="group p-6 bg-gray-50 border border-transparent rounded-xl text-center"
              >
                <div className="text-2xl mb-3 grayscale-0">👥</div>
                <div className="text-xs font-bold uppercase tracking-widest text-black">HR  Management</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mt-1">Employees & Payroll</div>
              </a> */}
              <a
                href="/admin/certificates"
                className="g`roup p-6 bg-gray-50 border border-transparent rounded-xl text-center"
              >
                <div className="text-2xl mb-3 grayscale-0">🎓</div>
                <div className="text-xs font-bold uppercase tracking-widest text-black">Certificates</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mt-1">Templates & Verification</div>
              </a>
              <a
                href="/admin/create-problem"
                className="group p-6 bg-gray-50 border border-transparent rounded-xl text-center"
              >
                <div className="text-2xl mb-3 grayscale-0">📝</div>
                <div className="text-xs font-bold uppercase tracking-widest text-black">Create Problem</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mt-1">Add new problems</div>
              </a>
              <a
                href="/admin/create-contest"
                className="group p-6 bg-gray-50 border border-transparent rounded-xl text-center"
              >
                <div className="text-2xl mb-3 grayscale-0">🏆</div>
                <div className="text-xs font-bold uppercase tracking-widest text-black">Create Contest</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mt-1">Organize contests</div>
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <span className="text-black grayscale text-lg">✅</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-black">User 'john_doe' solved problem 'Two Sum'</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 ml-auto">2m ago</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <span className="text-black grayscale text-lg">👥</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-black">New group 'Algorithm Study Group' created</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 ml-auto">15m ago</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <span className="text-black grayscale text-lg">🏆</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-black">Contest 'Weekly Challenge #42' started</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 ml-auto">1h ago</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <span className="text-black grayscale text-lg">🎓</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-black">Certificate generated for course completion</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 ml-auto">2h ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Controls */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-black">User Management</h3>
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter users..."
                  className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest focus:border-black outline-none transition-all"
                />
                <button
                  onClick={() => handleBulkAction('ban')}
                  className="px-4 py-2 border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                >
                  Ban Selected
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest font-black shadow-lg"
                >
                  Delete Selected
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-100">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 focus:ring-black"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map(u => u.id))
                          } else {
                            setSelectedUsers([])
                          }
                        }}
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-[8px] font-black text-gray-400 uppercase tracking-widest">User Entity</th>
                    <th className="px-4 py-3 text-left text-[8px] font-black text-gray-400 uppercase tracking-widest">Authority</th>
                    <th className="px-4 py-3 text-left text-[8px] font-black text-gray-400 uppercase tracking-widest">Rating</th>
                    <th className="px-4 py-3 text-left text-[8px] font-black text-gray-400 uppercase tracking-widest">Solved</th>
                    <th className="px-4 py-3 text-left text-[8px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3 text-left text-[8px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((userData) => (
                    <tr key={userData.id} className={`${userData.is_banned ? 'bg-gray-50' : ''}`}>
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 focus:ring-black"
                          checked={selectedUsers.includes(userData.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, userData.id])
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== userData.id))
                            }
                          }}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-[10px] font-black text-black uppercase tracking-tight">{userData.username}</div>
                          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{userData.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full ${userData.role === 'admin'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-500'
                          }`}>
                          {userData.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[10px] font-black text-black">{userData.rating}</td>
                      <td className="px-4 py-4 text-[10px] font-bold text-gray-500">{userData.problems_solved}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full ${userData.is_banned
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-black text-white shadow-sm'
                          }`}>
                          {userData.is_banned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          {userData.role !== 'admin' && (
                            <button
                              onClick={() => handlePromoteUser(userData.id)}
                              className="px-2 py-1 border border-gray-100 rounded text-[8px] font-black uppercase tracking-widest"
                            >
                              Promote
                            </button>
                          )}
                          <button
                            onClick={() => handleBanUser(userData.id, !userData.is_banned)}
                            className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${userData.is_banned
                              ? 'bg-black text-white shadow-md'
                              : 'bg-gray-100 text-gray-500'
                              }`}
                          >
                            {userData.is_banned ? 'Unban' : 'Ban'}
                          </button>
                          {userData.username !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(userData.id)}
                              className="px-2 py-1 bg-black text-white rounded text-[8px] font-black uppercase tracking-widest font-black shadow-md"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Content Management Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Groups Management */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6">Groups ({groups.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.length === 0 ? (
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No groups detected</p>
              ) : (
                groups.map((group) => (
                  <div key={group.id} className="flex flex-col p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-[10px] font-black text-black uppercase tracking-tight">{group.name}</div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">ID: {group.id}</div>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="text-[8px] font-black uppercase tracking-widest text-black">{group.member_count} Members</div>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="text-[8px] font-black uppercase tracking-widest text-gray-400"
                      >
                        Purge
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Problems Management */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6">Problems ({problems.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problems.length === 0 ? (
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No content available</p>
              ) : (
                problems.map((problem) => (
                  <div key={problem.id} className="flex flex-col p-4 bg-gray-100 border border-transparent rounded-xl">
                    <div className="text-[10px] font-black text-black uppercase tracking-tight mb-2">{problem.title}</div>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                        {problem.difficulty} • {problem.solved_count} Solved
                      </div>
                      <button
                        onClick={() => handleDeleteProblem(problem.id)}
                        className="text-[8px] font-black uppercase tracking-widest text-gray-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6">Contests ({contests.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contests.length === 0 ? (
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No active sessions</p>
              ) : (
                contests.map((contest) => (
                  <div key={contest.id} className="flex flex-col p-4 border border-gray-100 rounded-xl">
                    <div className="text-[10px] font-black text-black uppercase tracking-tight mb-2">{contest.title}</div>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                        {contest.participants} Participants • {contest.is_public ? 'Public' : 'Private'}
                      </div>
                      <button
                        onClick={() => handleDeleteContest(contest.id)}
                        className="text-[8px] font-black uppercase tracking-widest text-black"
                      >
                        Terminate
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* System Controls Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Danger Zone */}
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4">⚠️ Danger Zone</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8 max-w-sm mx-auto leading-relaxed">
              Permanent system reset. This will purge all user data, content, and configurations. This protocol is irreversible.
            </p>
            <button
              onClick={clearAllData}
              className="px-8 py-3 bg-black text-white rounded-lg text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
            >
              Initialize Purge
            </button>
          </div>

          {/* Storage Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4">Infrastructure Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-[10px] font-black text-black uppercase tracking-tight">Platform Version</div>
                    <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{config.app.name} v{config.app.version}</div>
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-black text-white rounded">Stable</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-[10px] font-black text-black uppercase tracking-tight">Environment</div>
                    <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Master Production Node</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4">System Utilities</h3>
              <button
                onClick={() => {
                  if (confirm('Clear system cache and refresh state?')) {
                    window.location.reload()
                  }
                }}
                className="w-full p-4 border border-black rounded-xl text-[10px] font-black uppercase tracking-widest text-center"
              >
                Flush System Cache
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminConsolePage