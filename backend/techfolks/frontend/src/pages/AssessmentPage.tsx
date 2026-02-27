import { useState, useEffect } from 'react'
import { useAuthStore } from '@store/authStore'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { config } from '@/config'
import toast from 'react-hot-toast'
import { cn } from '@utils/cn'

interface Lab {
  id: string
  name: string
  description: string
  lab_hrs: number
  group_name: string
  total_problems: number
  created_at: string
}

const AssessmentPage = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [labs, setLabs] = useState<Lab[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null)

  // Create Lab Form State
  const [labForm, setLabForm] = useState({
    name: '',
    description: '',
    lab_hrs: 2,
    group_name: '',
  })

  // Redirect if not authorized
  if (!user || (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'super_admin' && user.role !== 'user')) {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    fetchLabs()
  }, [])

  const fetchLabs = async () => {
    setLoading(true)
    try {
      // TEMPORARY MOCK DATA - Remove after testing
      const mockLabs: Lab[] = [
        {
          id: '1',
          name: 'Python Fundamentals Lab',
          description: 'Learn the basics of Python programming including variables, data types, control structures, and functions',
          lab_hrs: 3,
          group_name: 'python',
          total_problems: 12,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Data Structures & Algorithms',
          description: 'Master essential data structures like arrays, linked lists, stacks, queues, trees, and graphs',
          lab_hrs: 5,
          group_name: 'data-structures',
          total_problems: 20,
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'JavaScript ES6+ Features',
          description: 'Explore modern JavaScript features including arrow functions, promises, async/await, and destructuring',
          lab_hrs: 2,
          group_name: 'javascript',
          total_problems: 8,
          created_at: new Date().toISOString(),
        },
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setLabs(mockLabs)

      // Uncomment below for real API call
      /*
      const token = localStorage.getItem('token')
      const response = await fetch(`${config.API_URL}/api/labs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLabs(data.data?.labs || [])
      } else {
        toast.error('Failed to fetch labs')
      }
      */
    } catch (error) {
      console.error('Error fetching labs:', error)
      toast.error('Error loading labs')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLab = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${config.API_URL}/api/labs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(labForm),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Lab created successfully')
        setLabs([data.data, ...labs])
        setLabForm({
          name: '',
          description: '',
          lab_hrs: 2,
          group_name: '',
        })
        setShowCreateModal(false)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create lab')
      }
    } catch (error) {
      console.error('Error creating lab:', error)
      toast.error('Error creating lab')
    }
  }

  const handleLabClick = (lab: Lab) => {
    setSelectedLab(lab)
  }

  // If user is a student, show student views
  if (user.role === 'user') {
    if (selectedLab) {
      return <StudentLabDashboard lab={selectedLab} onBack={() => setSelectedLab(null)} />
    }
    return <StudentLabView labs={labs} loading={loading} onSelectLab={handleLabClick} />
  }

  // If a lab is selected, show the admin dashboard
  if (selectedLab) {
    return <LabDashboard lab={selectedLab} onBack={() => setSelectedLab(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-black">Lab Management</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Create and manage coding labs</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Lab
          </button>
        </div>

        {/* Labs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : labs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white dark:bg-gray-50 rounded-full shadow-lg mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-black mb-2">No Labs Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by creating your first lab</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Your First Lab
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab) => (
              <div
                key={lab.id}
                onClick={() => handleLabClick(lab)}
                className="bg-white dark:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-black mb-2 line-clamp-1">
                        {lab.name}
                      </h3>
                      <p className="text-sm text-gray-800 dark:text-gray-700 line-clamp-2 mb-4">
                        {lab.description || 'No description provided'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-50 shadow-md rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Total Problems
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                        {lab.total_problems || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-50 shadow-md rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Lab Hours
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-black">
                        {lab.lab_hrs} hrs
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-50 shadow-md rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Group
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-black capitalize">
                        {lab.group_name}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg hover:from-green-700 hover:to-green-800 font-medium transition-all duration-200 flex items-center justify-center gap-2">
                      View Dashboard
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Lab Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Lab</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateLab} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Lab Name *
                </label>
                <input
                  type="text"
                  required
                  value={labForm.name}
                  onChange={(e) => setLabForm({ ...labForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="e.g., Python Basics Lab"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={labForm.description}
                  onChange={(e) => setLabForm({ ...labForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="Describe the lab objectives and topics covered..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Lab Hours *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={labForm.lab_hrs}
                    onChange={(e) => setLabForm({ ...labForm, lab_hrs: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Group Name *
                  </label>
                  <select
                    required
                    value={labForm.group_name}
                    onChange={(e) => setLabForm({ ...labForm, group_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="">Select Group</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="cpp">C++</option>
                    <option value="data-structures">Data Structures</option>
                    <option value="algorithms">Algorithms</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/create-problem')}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-all"
                >
                  Create Problems First
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Create Lab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Lab Dashboard Component
interface LabDashboardProps {
  lab: Lab
  onBack: () => void
}

interface Problem {
  id: string
  topic: string
  level: string
  status: string
  title: string
  description: string
}

const LabDashboard = ({ lab, onBack }: LabDashboardProps) => {
  const [problems, setProblems] = useState<Problem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('order')
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalStudents: 0,
    completedProblems: 0,
    averageScore: 0,
    activeSubmissions: 0,
  })

  useEffect(() => {
    fetchProblems()
    fetchStats()
  }, [])

  const fetchProblems = async () => {
    setLoading(true)
    try {
      // TEMPORARY MOCK DATA - Remove after testing
      const mockProblems: Problem[] = [
        {
          id: '1',
          topic: 'Variables and Data Types',
          level: 'easy',
          status: 'active',
          title: 'Understanding Python Variables',
          description: 'Learn how to declare and use variables in Python',
        },
        {
          id: '2',
          topic: 'Control Structures',
          level: 'easy',
          status: 'active',
          title: 'If-Else Statements',
          description: 'Master conditional logic with if-else statements',
        },
        {
          id: '3',
          topic: 'Loops',
          level: 'medium',
          status: 'active',
          title: 'For and While Loops',
          description: 'Understand iteration using for and while loops',
        },
        {
          id: '4',
          topic: 'Functions',
          level: 'medium',
          status: 'active',
          title: 'Creating Functions',
          description: 'Learn to define and call functions with parameters',
        },
        {
          id: '5',
          topic: 'Lists and Tuples',
          level: 'medium',
          status: 'active',
          title: 'Working with Lists',
          description: 'Manipulate lists and understand tuple immutability',
        },
        {
          id: '6',
          topic: 'Dictionaries',
          level: 'hard',
          status: 'active',
          title: 'Dictionary Operations',
          description: 'Master key-value pairs and dictionary methods',
        },
        {
          id: '7',
          topic: 'File Handling',
          level: 'hard',
          status: 'active',
          title: 'Reading and Writing Files',
          description: 'Learn to work with files in Python',
        },
        {
          id: '8',
          topic: 'Exception Handling',
          level: 'hard',
          status: 'active',
          title: 'Try-Except Blocks',
          description: 'Handle errors gracefully with exception handling',
        },
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      setProblems(mockProblems)

      // Uncomment below for real API call
      /*
      const token = localStorage.getItem('token')
      const response = await fetch(`${config.API_URL}/api/labs/${lab.id}/problems`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProblems(data.data?.problems || [])
      } else {
        toast.error('Failed to fetch problems')
      }
      */
    } catch (error) {
      console.error('Error fetching problems:', error)
      toast.error('Error loading problems')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // TEMPORARY MOCK DATA - Remove after testing
      const mockStats = {
        totalStudents: 45,
        completedProblems: 156,
        averageScore: 78,
        activeSubmissions: 23,
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      setStats(mockStats)

      // Uncomment below for real API call
      /*
      const token = localStorage.getItem('token')
      const response = await fetch(`${config.API_URL}/api/labs/${lab.id}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data || stats)
      }
      */
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleDownloadReport = async () => {
    try {
      // TEMPORARY MOCK - Show success message for testing
      toast.success(`Report for "${lab.name}" downloaded successfully!`)

      // Uncomment below for real API call
      /*
      const token = localStorage.getItem('token')
      const response = await fetch(`${config.API_URL}/api/labs/${lab.id}/report`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${lab.name}_report.pdf`
        a.click()
        toast.success('Report downloaded successfully')
      } else {
        toast.error('Failed to download report')
      }
      */
    } catch (error) {
      console.error('Error downloading report:', error)
      toast.error('Error downloading report')
    }
  }

  const handlePreviewProblem = (problem: Problem) => {
    // Show problem preview in a modal or navigate to preview page
    toast(`Preview: ${problem.title}`, { icon: '👁️' })
    console.log('Preview problem:', problem)
    // TODO: Implement preview modal or navigation
  }

  const handleEditProblem = (problem: Problem) => {
    // Navigate to edit page or open edit modal
    toast(`Edit: ${problem.title}`, { icon: '✏️' })
    console.log('Edit problem:', problem)
    // TODO: Implement edit functionality
    // Example: navigate(`/problems/${problem.id}/edit`)
  }

  const handleDownloadProblem = async (problem: Problem) => {
    try {
      // TEMPORARY MOCK - Show success message for testing
      toast.success(`Problem "${problem.topic}" downloaded successfully!`)

      // Uncomment below for real API call
      /*
      const token = localStorage.getItem('token')
      const response = await fetch(`${config.API_URL}/api/problems/${problem.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${problem.topic.replace(/\s+/g, '_')}.pdf`
        a.click()
        toast.success('Problem downloaded successfully')
      } else {
        toast.error('Failed to download problem')
      }
      */
    } catch (error) {
      console.error('Error downloading problem:', error)
      toast.error('Error downloading problem')
    }
  }

  const handleShowStudents = async () => {
    try {
      // TEMPORARY MOCK DATA - Remove after testing
      const mockStudents = [
        { id: '1', name: 'John Doe', email: 'john@example.com', progress: 85, completed: 10, total: 12 },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', progress: 92, completed: 11, total: 12 },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com', progress: 67, completed: 8, total: 12 },
        { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', progress: 75, completed: 9, total: 12 },
        { id: '5', name: 'David Brown', email: 'david@example.com', progress: 58, completed: 7, total: 12 },
        { id: '6', name: 'Emily Davis', email: 'emily@example.com', progress: 100, completed: 12, total: 12 },
        { id: '7', name: 'Chris Wilson', email: 'chris@example.com', progress: 42, completed: 5, total: 12 },
        { id: '8', name: 'Lisa Anderson', email: 'lisa@example.com', progress: 83, completed: 10, total: 12 },
      ]

      setStudents(mockStudents)
      setShowStudentsModal(true)

      // Uncomment below for real API call
      /*
      const token = localStorage.getItem('token')
      const response = await fetch(`${config.API_URL}/api/labs/${lab.id}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStudents(data.data?.students || [])
        setShowStudentsModal(true)
      } else {
        toast.error('Failed to fetch students')
      }
      */
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Error loading students')
    }
  }

  const filteredProblems = problems.filter((problem) =>
    problem.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === 'level') {
      const levelOrder = { easy: 1, medium: 2, hard: 3 }
      return levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder]
    }
    return 0
  })

  // Redirect if not authorized
  if (!user || (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'super_admin' && user.role !== 'user')) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Labs
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{lab.name}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{lab.description}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            onClick={handleShowStudents}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Click to view list →</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed Problems</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedProblems}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageScore}%</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Submissions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeSubmissions}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search problems by topic or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="order">Sort by Order</option>
              <option value="level">Sort by Level</option>
            </select>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between gap-10 items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Problems List</h2>
            <button
              onClick={handleDownloadReport}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 font-medium flex items-center gap-2 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Report
            </button>
            <button
              type="button"
              onClick={() => navigate('/create-problem')}
              className="flex-1 bg-gray-100 m dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-all"
            >
              Create Problems 
            </button>

          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
          ) : sortedProblems.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              No problems found. Add problems to this lab.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">S.No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Topic</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedProblems.map((problem, index) => (
                    <tr key={problem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {problem.topic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${problem.level === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          problem.level === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                          {problem.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${problem.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                          {problem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreviewProblem(problem)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="Preview"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditProblem(problem)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDownloadProblem(problem)}
                            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg transition-colors"
                            title="Download"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Students Modal */}
        {showStudentsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Students List</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total: {students.length} students</p>
                </div>
                <button
                  onClick={() => setShowStudentsModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">S.No</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {students.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 max-w-[120px]">
                              <div
                                className={`h-2 rounded-full ${student.progress >= 80 ? 'bg-green-500' :
                                  student.progress >= 50 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[45px]">
                              {student.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <span className="font-semibold">{student.completed}</span>
                            <span className="text-gray-500 dark:text-gray-400"> / {student.total}</span>
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
      </div>
    </div>
  )
}

// --- Student Specific Views ---

interface StudentViewProps {
  labs: Lab[]
  loading: boolean
  onSelectLab: (lab: Lab) => void
}

const StudentLabView = ({ labs, loading, onSelectLab }: StudentViewProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const filteredLabs = labs.filter(lab =>
    lab.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">My Active Labs</h1>
            <p className="text-gray-500 mt-2 text-xl font-medium">Master your skills with structured practice</p>
          </div>
          <div className="relative max-w-md w-full group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all rounded-full opacity-0 group-hover:opacity-100"></div>
            <input
              type="text"
              placeholder="Search by subject name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-gray-100 bg-white transition-all focus:ring-4 focus:ring-gray-200 focus:border-gray-900 shadow-xl text-lg font-medium"
            />
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-4 border-blue-500/20 border-b-blue-500 animate-spin-slow"></div>
            </div>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-sm animate-pulse">Loading Your Experience...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                onClick={() => onSelectLab(lab)}
                className="group relative bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10 cursor-pointer transition-all duration-500 hover:shadow-3xl hover:-translate-y-4 overflow-hidden"
              >
                {/* Decorative Background */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(e, lab.id)}
                  className="absolute top-8 right-8 p-4 rounded-2xl bg-gray-50 hover:bg-red-50 transition-all active:scale-90 z-10"
                >
                  <svg
                    className={cn("w-7 h-7 transition-all duration-300",
                      favorites.includes(lab.id)
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-300 group-hover:text-gray-400"
                    )}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>

                <div className="mb-10 relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-black rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black mb-8 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-500">
                    {lab.name.charAt(0)}
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-3 group-hover:text-black transition-colors leading-tight">{lab.name}</h3>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></span>
                    <span>Incharge: Prof. Sarah Wilson</span>
                  </div>
                </div>

                <div className="space-y-8 pt-8 border-t-2 border-dashed border-gray-100">
                  <div>
                    <div className="flex justify-between text-xs font-black mb-4">
                      <span className="text-gray-900 uppercase tracking-[0.2em]">Practice Progress</span>
                      <span className="bg-gray-200 px-3 py-1 rounded-full text-black font-mono">4 / {lab.total_problems} Problems</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 p-1 shadow-inner">
                      <div className="bg-gray-900 h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${(4 / lab.total_problems) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-orange-50">
                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Duration</span>
                        <span className="text-lg font-black text-gray-900 leading-none">{lab.lab_hrs} HR</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center p-4 rounded-[1.5rem] bg-gray-900 group/btn hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const StudentLabDashboard = ({ lab, onBack }: LabDashboardProps) => {
  // Mock student stats exactly like the flow diagram but enhanced
  const stats = {
    total: lab.total_problems,
    solved: 4,
    unsolved: lab.total_problems - 4 - 2,
    pending: 2
  }

  const studentProblems = [
    { id: '1', topic: 'Variables & Types', status: 'Solved', assignDate: 'Mar 01, 2024', dueDate: 'Mar 15, 2024' },
    { id: '2', topic: 'Control Flows', status: 'Solved', assignDate: 'Mar 05, 2024', dueDate: 'Mar 20, 2024' },
    { id: '3', topic: 'Complex Lists', status: 'Unsolved', assignDate: 'Mar 10, 2024', dueDate: 'Mar 25, 2024' },
    { id: '4', topic: 'Error Handling', status: 'Pending', assignDate: 'Mar 12, 2024', dueDate: 'Mar 30, 2024' },
  ]

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'solved': return 'bg-emerald-100 text-emerald-700'
      case 'unsolved': return 'bg-rose-100 text-rose-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={onBack}
          className="group flex items-center gap-3 text-gray-400 hover:text-primary transition-all text-sm font-black uppercase tracking-[0.2em] mb-12"
        >
          <div className="p-3 rounded-2xl bg-white shadow-sm border border-gray-100 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          Return to Hub
        </button>

        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 mb-20 bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

          <div className="space-y-4 max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-black text-xs font-black uppercase tracking-widest">
              Active Assessment
            </div>
            <h1 className="text-6xl font-black text-gray-900 tracking-tight leading-tight">{lab.name}</h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">{lab.description || 'Access all your problems and track your progress in real-time.'}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto relative z-10">
           
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-4 bg-black text-white px-10 py-5 rounded-[2rem] font-black hover:bg-gray-900 hover:shadow-2xl transition-all active:scale-95 uppercase tracking-widest text-xs">
              <span className="text-2xl">📜</span>
              Lab Report
            </button>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
          {[
            { label: 'Total Tasks', value: stats.total, icon: '📊', color: 'bg-indigo-500', text: 'text-indigo-500', bg: 'bg-indigo-50' },
            { label: 'Remaining', value: stats.unsolved, icon: '⚡', color: 'bg-rose-500', text: 'text-rose-500', bg: 'bg-rose-50' },
            { label: 'Completed', value: stats.solved, icon: '💎', color: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'In Review', value: stats.pending, icon: '🎯', color: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-50' },
          ].map((s, idx) => (
            <div key={idx} className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center text-center">
              <div className={cn("w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500", s.bg)}>
                {s.icon}
              </div>
              <p className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-2">{s.label}</p>
              <p className="text-5xl font-black text-gray-900">{s.value}</p>
              <div className={cn("w-12 h-1.5 rounded-full mt-6", s.color)}></div>
            </div>
          ))}
        </div>

        {/* Problem List */}
        <div className="bg-white rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-16 py-12 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Assigned Curriculum</h2>
              <p className="text-gray-400 font-bold mt-2">Personalized practice list based on your current level</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-black text-black bg-gray-100 px-6 py-3 rounded-2xl border border-gray-200">
                {studentProblems.length} Topics Allocated
              </div>
            </div>
          </div>
          <div className="overflow-x-auto px-10 pb-10">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em] border-b border-gray-50">
                  <th className="px-10 py-8">Section Name</th>
                  <th className="px-10 py-8">Current Status</th>
                  <th className="px-10 py-8 text-center">Issued</th>
                  <th className="px-10 py-8 text-center">Deadline</th>
                  <th className="px-10 py-8 text-right">Practice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {studentProblems.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-all group/row">
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-4">
                        <div className="w-2.5 h-10 rounded-full bg-gray-200 group-hover/row:bg-black transition-colors"></div>
                        <span className="font-black text-gray-900 text-xl tracking-tight">{p.topic}</span>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <span className={cn("px-5 py-2.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest shadow-sm", getStatusStyle(p.status))}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-10 py-10 text-center font-black text-gray-400 text-sm font-mono group-hover/row:text-gray-600 transition-colors uppercase">{p.assignDate}</td>
                    <td className="px-10 py-10 text-center font-black text-gray-400 text-sm font-mono group-hover/row:text-gray-600 transition-colors uppercase">{p.dueDate}</td>
                    <td className="px-10 py-10 text-right">
                      <Link
                        to={`/problems/${p.id}/solve`}
                        className="inline-flex items-center gap-3 bg-black text-white text-xs font-black px-10 py-5 rounded-[2rem] hover:bg-gray-800 hover:scale-105 transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em]"
                      >
                        Solve
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-16 py-10 bg-gray-50/50 text-center border-t border-gray-100">
            <p className="text-gray-400 font-bold tracking-widest uppercase text-sm">
              <span className="mr-2">🚀</span>
              Consistent practice is the key to mastery. Keep pushing your limits!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssessmentPage
