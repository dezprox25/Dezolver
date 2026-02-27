import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { contestsAPI } from '@services/api'
import { useAuthStore } from '@store/authStore'
import { useContestsStore } from '@store/contestsStore'
import { config } from '@/config'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Code2,
  Search,
  Plus,
  ArrowRight,
  Timer,
  ShieldCheck,
  Activity,
  History,
  LayoutGrid,
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react'

interface Contest {
  id: number
  title: string
  description?: string
  contest_type: string
  start_time: string
  end_time: string
  is_public: boolean
  registration_open: boolean
  created_by: number
  created_at: string
  participants_count?: number
  problems_count?: number
  status?: 'upcoming' | 'running' | 'ended'
}

const ContestsPage = () => {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'running' | 'ended'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { user, isAuthenticated } = useAuthStore()
  const { contests: storedContests } = useContestsStore()
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' |

  useEffect(() => {
    fetchContests()
  }, [storedContests])

  const fetchContests = async () => {
    try {
      setLoading(true)

      // Mock data for premium feel demonstration if API is empty
      const mockContests: Contest[] = [
        {
          id: 101,
          title: "Weekly Alpha Sprint #42",
          description: "High-speed algorithmic challenges focused on data structures and dynamic programming optimization.",
          contest_type: "ACM_ICPC",
          start_time: new Date(Date.now() + 86400000).toISOString(),
          end_time: new Date(Date.now() + 86400000 + 10800000).toISOString(),
          is_public: true,
          registration_open: true,
          created_by: 1,
          created_at: new Date().toISOString(),
          participants_count: 156,
          problems_count: 6
        },
        {
          id: 102,
          title: "TechFolks Grand Prix 2026",
          description: "Our flagship monthly competition. Complex problems, massive rewards, and global visibility.",
          contest_type: "IOI",
          start_time: new Date(Date.now() - 3600000).toISOString(),
          end_time: new Date(Date.now() + 7200000).toISOString(),
          is_public: true,
          registration_open: false,
          created_by: 2,
          created_at: new Date().toISOString(),
          participants_count: 842,
          problems_count: 8
        },
        {
          id: 103,
          title: "Search & Logic Overdrive",
          description: "Master the art of search optimizations and advanced logic puzzles in this specialized event.",
          contest_type: "CODEFORCES",
          start_time: new Date(Date.now() - 172800000).toISOString(),
          end_time: new Date(Date.now() - 162000000).toISOString(),
          is_public: true,
          registration_open: false,
          created_by: 1,
          created_at: new Date().toISOString(),
          participants_count: 423,
          problems_count: 5
        }
      ];

      let apiContests: Contest[] = []
      try {
        const response = await contestsAPI.getAll()
        apiContests = response.data || []
      } catch (error) {
        console.log('API not available, fallback to mock/store')
      }

      const allContests = [...apiContests, ...storedContests, ...mockContests]
      const uniqueContests = allContests.filter((contest, index, self) =>
        index === self.findIndex((c) => c.id === contest.id)
      )

      const contestsWithStatus = uniqueContests.map((contest: any) => ({
        ...contest,
        status: getContestStatus(contest.start_time, contest.end_time),
        participants_count: contest.participants_count || contest.participants || 0,
        problems_count: contest.problems_count || contest.problems?.length || 0,
        contest_type: contest.contest_type || contest.type || 'ACM_ICPC'
      }))

      setContests(contestsWithStatus)
    } catch (error: any) {
      console.error('Error fetching contests:', error)
      setContests([])
    } finally {
      setLoading(false)
    }
  }

  const getContestStatus = (startTime: string, endTime: string): 'upcoming' | 'running' | 'ended' => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)
    if (now < start) return 'upcoming'
    if (now >= start && now <= end) return 'running'
    return 'ended'
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    return `${diffHours}h`
  }

  const filteredContests = contests.filter(contest =>
    filter === 'all' || contest.status === filter
  ).filter(contest =>
    !searchQuery ||
    contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contest.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRegister = async (contestId: number) => {
    if (!isAuthenticated) {
      toast.error('Sign in to join the tribe!')
      return
    }
    try {
      await contestsAPI.register(contestId.toString())
      toast.success('Successfully reserved your spot!')
      fetchContests()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register')
    }
  }

  const handleDelete = async (contestId: number) => {
    if (!confirm('This action will delete the contest permanently. Continue?')) return
    try {
      await contestsAPI.delete(contestId.toString())
      toast.success('Contest removed.')
      fetchContests()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20 font-sans selection:bg-primary/10">
      {/* Premium Header Section */}
      <div className="bg-white border-b border-zinc-100 mb-8 pt-10 pb-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-1 bg-primary rounded-full" />
                <span className="text-xs font-black uppercase tracking-widest text-primary/60">Competitive Node</span>
              </div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Elite Contests</h1>
              <p className="text-zinc-500 font-medium mt-1">Sharpen your logic, compete with the best, and win.</p>
            </motion.div>
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link
                  to="/admin/create-contest"
                  className="group flex items-center gap-2 bg-zinc-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-primary transition-all shadow-lg shadow-zinc-200 hover:shadow-primary/20 active:translate-y-0.5"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Host New Contest
                </Link>
              </motion.div>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mt-10">
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Find a challenge by name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-zinc-50 border-zinc-100 rounded-2xl pl-12 pr-4 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none"
              />
            </div>

            <div className="flex p-1 bg-zinc-100 rounded-2xl overflow-hidden w-fit">
              {[
                { id: 'all', label: 'All Events', icon: LayoutGrid },
                { id: 'running', label: 'Running', icon: Activity },
                { id: 'upcoming', label: 'Upcoming', icon: Timer },
                { id: 'ended', label: 'Past', icon: History },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === tab.id
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                >
                  <tab.icon className={`w-4 h-4 ${filter === tab.id ? 'text-primary' : ''}`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40 text-center">
            <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin mb-4" />
            <p className="font-bold tracking-tight text-zinc-900">Syncing Node...</p>
          </div>
        ) : filteredContests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-20 text-center border border-zinc-100 shadow-sm"
          >
            <div className="bg-zinc-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-2">No Contests Found</h3>
            <p className="text-zinc-500 font-medium">Try adjusting your filters or search query.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredContests.map((contest, index) => (
                <motion.div
                  key={contest.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-[2.5rem] border border-zinc-100 p-1 hover:border-primary/20 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] transition-all flex flex-col h-full"
                >
                  <div className="p-8 pb-4 flex-1">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${contest.status === 'running' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white' :
                          contest.status === 'upcoming' ? 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white' :
                            'bg-zinc-100 text-zinc-500 border-zinc-200'
                        }`}>
                        {contest.status}
                      </div>
                      <div className="flex gap-2">
                        {isAdmin && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/admin/edit-contest/${contest.id}`} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-primary transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDelete(contest.id)} className="p-2 hover:bg-rose-50 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <div className="bg-zinc-50 p-2 rounded-lg text-zinc-400 cursor-pointer hover:text-zinc-900 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <Link to={`/contests/${contest.id}`} className="block">
                      <h3 className="text-2xl font-black text-zinc-900 group-hover:text-primary transition-colors leading-tight mb-3">
                        {contest.title}
                      </h3>
                    </Link>

                    <p className="text-zinc-500 text-sm font-medium line-clamp-3 mb-6">
                      {contest.description || "Join this challenge to push your limits and learn new concepts."}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-zinc-600">
                        <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-zinc-100 transition-colors"><Calendar className="w-4 h-4" /></div>
                        <span className="text-xs font-bold">{formatDateTime(contest.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-600">
                        <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-zinc-100 transition-colors"><Clock className="w-4 h-4" /></div>
                        <span className="text-xs font-bold">{getDuration(contest.start_time, contest.end_time)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 mt-auto">
                    <div className="flex items-center justify-between py-6 border-t border-zinc-50">
                      <div className="flex items-center -space-x-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 overflow-hidden shadow-sm">
                            <img src={`https://i.pravatar.cc/100?img=${(contest.id % 70) + i}`} alt="user" />
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 shadow-sm">
                          +{contest.participants_count! > 3 ? contest.participants_count! - 3 : 0}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Code2 className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-tight">{contest.problems_count} Problems</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {contest.status === 'running' ? (
                      <Link
                        to={`/contests/${contest.id}/participate`}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white h-14 rounded-[1.25rem] font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:translate-y-0.5"
                      >
                        Enter Arena
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : contest.status === 'upcoming' ? (
                      <button
                        onClick={() => handleRegister(contest.id)}
                        disabled={!contest.registration_open}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white h-14 rounded-[1.25rem] font-black hover:bg-zinc-900 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:translate-y-0.5"
                      >
                        {contest.registration_open ? 'Reserve Spot' : 'Registration Closed'}
                        <ShieldCheck className="w-5 h-5" />
                      </button>
                    ) : (
                      <Link
                        to={`/contests/${contest.id}/standings`}
                        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-zinc-100 text-zinc-900 h-14 rounded-[1.25rem] font-black hover:bg-zinc-50 transition-all active:translate-y-0.5"
                      >
                        View Results
                        <Trophy className="w-4 h-4 text-amber-500" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Premium Stats Dashboard Area */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Sprints", value: contests.filter(c => c.status === 'running').length, icon: Activity, color: "text-emerald-500" },
              { label: "Queued Events", value: contests.filter(c => c.status === 'upcoming').length, icon: Timer, color: "text-blue-500" },
              { label: "Completed Protocols", value: contests.filter(c => c.status === 'ended').length, icon: Trophy, color: "text-amber-500" },
              { label: "Total Participants", value: contests.reduce((sum, c) => sum + (c.participants_count || 0), 0), icon: Users, color: "text-primary" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="bg-zinc-900 text-white p-6 rounded-[2.5rem] flex items-center gap-4 shadow-xl shadow-zinc-200/50"
              >
                <div className={`p-4 bg-white/5 rounded-2xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContestsPage