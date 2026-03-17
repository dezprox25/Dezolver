import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { dashboardAPI } from '@services/api'

interface DashboardStats {
  problemsSolved: number
  contestsParticipated: number
  currentRating: number
  maxRating: number
  totalSubmissions: number
  acceptedSubmissions: number
  recentContests: any[]
  recentSubmissions: any[]
  upcomingContests: any[]
}

const DashboardPage = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Always load dashboard data, even without user
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const data = await dashboardAPI.getStats() as DashboardStats
      setStats(data)
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Accepted': return 'text-black bg-gray-50 border-gray-100'
      case 'Wrong Answer': return 'text-black bg-gray-50 border-gray-100'
      case 'Time Limit Exceeded': return 'text-black bg-gray-50 border-gray-100'
      case 'Compilation Error': return 'text-black bg-gray-50 border-gray-100'
      default: return 'text-gray-500 bg-gray-50 border-gray-100'
    }
  }

  const getRatingColor = (_rating: number) => {
    return 'text-black font-bold'
  }

  const getRatingTitle = (rating: number) => {
    if (rating >= 2100) return 'Master'
    if (rating >= 1900) return 'Candidate Master'
    if (rating >= 1600) return 'Expert'
    if (rating >= 1400) return 'Specialist'
    if (rating >= 1200) return 'Pupil'
    return 'Newbie'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">Failed to load dashboard</h3>
        <p className="text-muted-foreground">Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-black rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">Welcome back, {user?.username}!</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Ready to solve some problems today?</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-black text-black mb-2">
            {stats.problemsSolved}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Problems Solved</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-black text-black mb-2">
            {stats.contestsParticipated}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contests Participated</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
          <div className={`text-3xl font-black mb-2 ${getRatingColor(stats.currentRating)}`}>
            {stats.currentRating}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {getRatingTitle(stats.currentRating)}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-black text-black mb-2">
            {Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)}%
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Success Rate ({stats.acceptedSubmissions}/{stats.totalSubmissions})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-widest text-black">Recent Submissions</h2>
              <Link
                to="/submissions"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentSubmissions.map((submission, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-black uppercase tracking-tight">
                      {submission.problem}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                      {submission.time} • {submission.language}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded border ${getVerdictColor(submission.verdict)}`}>
                    {submission.verdict}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Contests */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-widest text-black">Upcoming Contests</h2>
              <Link
                to="/contests"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.upcomingContests.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                No upcoming contests
              </div>
            ) : (
              stats.upcomingContests.map((contest, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="text-sm font-bold text-black uppercase tracking-tight mb-0.5">
                    <Link
                      to={`/contests/${contest.id}`}
                      className="hover:underline"
                    >
                      {contest.title}
                    </Link>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {new Date(contest.start_time).toLocaleString()}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mt-1">
                    {contest.contest_type.replace('_', '-')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rating Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-widest text-black mb-6">Rating Progress</h2>
        <div className="h-64 bg-gray-50 rounded-lg border border-gray-100 border-dashed flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2 grayscale">📈</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-black">Rating dynamics visualization</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">
              Current Perf: {stats.currentRating} | Peak: {stats.maxRating}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-widest text-black mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/problems"
            className="flex items-center p-6 bg-gray-50 border border-gray-100 rounded-xl hover:bg-black group transition-all duration-300"
          >
            <div className="text-2xl mr-4 grayscale group-hover:grayscale-0 transition-all">🧩</div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-black group-hover:text-white transition-colors">Solve Problems</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-500 transition-colors">Practice coding problems</div>
            </div>
          </Link>

          <Link
            to="/contests"
            className="flex items-center p-6 bg-gray-50 border border-gray-100 rounded-xl hover:bg-black group transition-all duration-300"
          >
            <div className="text-2xl mr-4 grayscale group-hover:grayscale-0 transition-all">🏆</div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-black group-hover:text-white transition-colors">Join Contests</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-500 transition-colors">Compete with others</div>
            </div>
          </Link>

          <Link
            to="/leaderboard"
            className="flex items-center p-6 bg-gray-50 border border-gray-100 rounded-xl hover:bg-black group transition-all duration-300"
          >
            <div className="text-2xl mr-4 grayscale group-hover:grayscale-0 transition-all">📊</div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-black group-hover:text-white transition-colors">View Rankings</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-500 transition-colors">Check your rank</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage