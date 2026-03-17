import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { cn } from '@utils/cn'

interface DepartmentStats {
    totalStaffs: number
    totalStudents: number
    totalLabs: number
    totalContests: number
    totalGroups: number
}

interface LeaderboardEntry {
    rank: number
    name: string
    score: number
    performance: string
}

interface Contest {
    id: string
    title: string
    date: string
    time: string
    type: string
}

const MyDepartmentPage = () => {
    const { user } = useAuthStore()
    const [loading, setLoading] = useState(true)

    // Mock data for initial UI build
    const stats: DepartmentStats = {
        totalStaffs: 45,
        totalStudents: 1250,
        totalLabs: 12,
        totalContests: 8,
        totalGroups: 24
    }

    const leaderboard: LeaderboardEntry[] = [
        { rank: 1, name: "Alice Johnson", score: 2850, performance: "+12%" },
        { rank: 2, name: "Bob Smith", score: 2720, performance: "+8%" },
        { rank: 3, name: "Charlie Brown", score: 2680, performance: "+15%" },
        { rank: 4, name: "Diana Prince", score: 2590, performance: "-2%" },
        { rank: 5, name: "Edward Norton", score: 2450, performance: "+5%" },
    ]

    const upcomingContests: Contest[] = [
        { id: "1", title: "Monthly Logic Challenge", date: "2024-03-15", time: "10:00 AM", type: "Multiple Choice" },
        { id: "2", title: "Algorithm Sprint", date: "2024-03-22", time: "02:00 PM", type: "Coding" },
        { id: "3", title: "Data Structures Bowl", date: "2024-04-05", time: "11:00 AM", type: "Coding" },
    ]

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])

    const StatCard = ({ title, value, icon }: { title: string, value: number, icon: string }) => (
        <div className="bg-white rounded-[2.5rem] shadow-[0px_20px_60px_rgba(0,0,0,0.04)] border border-gray-50 p-8 transition-all duration-500 hover:shadow-[0px_30px_80px_rgba(0,0,0,0.08)] group">
            <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-gray-50 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    <span className="text-2xl grayscale">{icon}</span>
                </div>
            </div>
            <div>
                <h3 className="text-4xl font-black text-black mb-2 tracking-tight">{value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Syncing Department Registry...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 py-10">
            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-12 text-black shadow-[0px_20px_60px_rgba(0,0,0,0.04)] border border-gray-50 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase leading-none">My Department</h1>
                        <p className="text-gray-400 text-sm font-medium max-w-xl">
                            System Protocol / Administrative Overview for {user?.username || 'Admin'}. Centralized telemetry and performance metrics.
                        </p>
                    </div>
                    <button
                        onClick={() => alert('Preparing report for download...')}
                        className="flex items-center justify-center gap-4 bg-black text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-gray-800 shadow-xl active:scale-95"
                    >
                        <span>📥</span>
                        <span>Download overall report</span>
                    </button>
                </div>
                {/* Subtle pattern instead of shapes */}
                <div className="absolute top-0 right-0 w-full h-full opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                <StatCard title="Total Staffs" value={stats.totalStaffs} icon="👨‍🏫" />
                <StatCard title="Total Students" value={stats.totalStudents} icon="🎓" />
                <StatCard title="Number of Labs" value={stats.totalLabs} icon="🧪" />
                <StatCard title="Total Contests" value={stats.totalContests} icon="🏆" />
                <StatCard title="Total Groups" value={stats.totalGroups} icon="👥" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Leaderboard Card */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-[0px_20px_60px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden">
                    <div className="px-10 py-10 border-b border-gray-50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-black text-black uppercase tracking-tight">Leaderboard</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Active Academic Protocol 0.1</p>
                        </div>
                        <Link to="/leaderboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">View Registry</Link>
                    </div>
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-50">
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] font-black text-black uppercase tracking-[0.3em]">Rank</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-black uppercase tracking-[0.3em]">Subject Name</th>
                                        <th className="px-10 py-6 text-center text-[10px] font-black text-black uppercase tracking-[0.3em]">Score</th>
                                        <th className="px-10 py-6 text-center text-[10px] font-black text-black uppercase tracking-[0.3em]">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {leaderboard.map((entry) => (
                                        <tr key={entry.rank} className="hover:bg-gray-50/50 transition-all duration-300">
                                            <td className="px-10 py-8">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs",
                                                    entry.rank === 1 ? "bg-black text-white" :
                                                        entry.rank === 2 ? "bg-gray-200 text-black" :
                                                            entry.rank === 3 ? "bg-gray-100 text-black" :
                                                                "bg-transparent text-gray-300"
                                                )}>
                                                    #{entry.rank}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 font-black text-black uppercase tracking-tight">{entry.name}</td>
                                            <td className="px-10 py-8 text-center font-mono font-black text-black">{entry.score}</td>
                                            <td className="px-10 py-8 text-center">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                    entry.performance.startsWith('+') ? "bg-gray-100 text-black" : "bg-gray-50 text-gray-300"
                                                )}>
                                                    {entry.performance}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Growth Stats Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0px_20px_60px_rgba(0,0,0,0.04)] border border-gray-50 p-10">
                        <div className="mb-10 flex justify-between items-center">
                            <h2 className="text-xl font-black text-black uppercase tracking-tight">Growth Stats</h2>
                            <span className="text-[10px] font-black bg-black text-white px-4 py-1.5 rounded-full tracking-widest uppercase animate-pulse">LIVE</span>
                        </div>
                        <div className="h-48 relative flex items-end justify-between gap-4 px-2">
                            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        className="w-full bg-gray-100 rounded-lg transition-all duration-700 group-hover:bg-black group-hover:scale-y-110"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-[10px] font-black py-2 px-3 rounded-lg shadow-xl z-20">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 flex justify-between text-[9px] font-black text-gray-300 uppercase tracking-widest">
                            <span>M</span>
                            <span>T</span>
                            <span>W</span>
                            <span>T</span>
                            <span>F</span>
                            <span>S</span>
                            <span>S</span>
                        </div>
                    </div>

                    {/* Calendar Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0px_20px_60px_rgba(0,0,0,0.04)] border border-gray-50 p-10">
                        <h2 className="text-xl font-black text-black uppercase tracking-tight mb-10">Events Registry</h2>
                        <div className="space-y-8">
                            {upcomingContests.map((contest) => (
                                <div key={contest.id} className="flex gap-6 items-center group cursor-pointer">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-black transition-all duration-500">
                                        <span className="text-[11px] font-black text-black group-hover:text-white transition-colors">{contest.date.split('-')[2]}</span>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-300 transition-colors">{new Date(contest.date).toLocaleString('default', { month: 'short' })}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-black text-sm uppercase tracking-tight leading-tight mb-2 group-hover:translate-x-1 transition-transform">{contest.title}</h4>
                                        <div className="flex items-center gap-4 text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                            <span className="flex items-center">
                                                <span className="mr-2">🕒</span> {contest.time}
                                            </span>
                                            <span className="px-3 py-1 bg-gray-50 rounded-full text-black border border-gray-100 group-hover:border-black/5 transition-colors">{contest.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full mt-6 py-5 border-2 border-dashed border-gray-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:border-black hover:text-black hover:shadow-lg transition-all duration-500 transform active:scale-95">
                                Add Reminder +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyDepartmentPage
