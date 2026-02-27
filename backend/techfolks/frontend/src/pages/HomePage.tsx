import { Link } from 'react-router-dom'
import { config } from '@/config'

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)]">
      {/* Hero Section */}
      <div className="text-center py-32">
        <h1 className="text-7xl font-black text-black mb-8 uppercase tracking-tighter">
          {config.app.name}
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-bold uppercase tracking-widest leading-relaxed">
          Sharpen your coding skills, compete with peers, and prepare for technical interviews
          on our competitive programming platform.
        </p>
        <div className="flex gap-6 justify-center">
          <Link to="/problems" className="px-8 py-4 bg-black text-white text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-800 transition-all transform hover:-translate-y-1">
            Start Solving
          </Link>
          <Link to="/contests" className="px-8 py-4 border-2 border-black text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all transform hover:-translate-y-1">
            Join Contest
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32">
        <div className="bg-white border border-gray-100 p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 text-center">
          <div className="text-4xl mb-6 grayscale">🧩</div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4">1000+ Problems</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            Practice with a vast collection of coding problems across various difficulty levels
          </p>
        </div>
        <div className="bg-white border border-gray-100 p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 text-center">
          <div className="text-4xl mb-6 grayscale">🏆</div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4">Weekly Contests</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            Participate in regular contests and compete with programmers worldwide
          </p>
        </div>
        <div className="bg-white border border-gray-100 p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 text-center">
          <div className="text-4xl mb-6 grayscale">⚡</div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4">Real-time Execution</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            Write, test, and submit your solutions with instant feedback
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-40 bg-gray-50 border border-gray-100 rounded-3xl p-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl font-black text-black mb-2">10K+</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-black text-black mb-2">1M+</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Submissions</div>
          </div>
          <div>
            <div className="text-4xl font-black text-black mb-2">500+</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Contests Held</div>
          </div>
          <div>
            <div className="text-4xl font-black text-black mb-2">15+</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Languages</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage