import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authAPI } from '@services/api'
import { useAuthStore } from '@store/authStore'
import { config } from '@/config'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ShieldCheck, Code2, Trophy, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

interface LoginFormData {
  username: string
  password: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(data)

      if (response?.data?.user && response?.data?.token) {
        const refreshToken = response?.data?.refreshToken
        login(response.data.user, response.data.token, refreshToken)
        toast.success('Welcome back!')
        const role = response.data.user.role
        if (role === 'super_admin') {
          navigate('/super-admin', { replace: true })
        } else if (role === 'admin') {
          navigate('/admin', { replace: true })
        } else if (role === 'manager') {
          navigate('/manager/students', { replace: true })
        } else {
          navigate('/leaderboard', { replace: true })
        }
      } else {
        throw new Error('Invalid login response')
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-primary/10">
      {/* Left Panel - Premium Marketing/Branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-[45%] bg-zinc-50 flex-col justify-between p-16 relative overflow-hidden border-r border-zinc-100"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-[5%] right-[-5%] w-[50%] h-[50%] bg-primary/[0.02] rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="bg-primary p-2 rounded-2xl shadow-lg shadow-primary/20">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-zinc-900">{config.app.name}</span>
          </motion.div>

          <div className="space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-black leading-[1.1] text-zinc-900 tracking-tight"
            >
              Master Your <br />
              <span className="text-zinc-400">Craft Today.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-zinc-500 max-w-md leading-relaxed"
            >
              Join a global community of developers, compete in elite challenges,
              and build the future of tech.
            </motion.p>
          </div>

          <div className="mt-20 space-y-6">
            {[
              { icon: ShieldCheck, title: "Industry Standard", desc: "Recognized by top tech companies worldwide." },
              { icon: Sparkles, title: "AI-Powered Insights", desc: "Personalized feedback on your code and progress." },
              { icon: Trophy, title: "Global Competitions", desc: "Win awards and recognition in major events." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-5 group cursor-default"
              >
                <div className="flex-shrink-0 bg-white p-3 rounded-xl shadow-sm border border-zinc-100 group-hover:border-primary/20 group-hover:shadow-md transition-all">
                  <feature.icon className="w-6 h-6 text-zinc-400 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-sm text-zinc-500">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 flex items-center gap-2 text-sm font-medium text-zinc-400"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Currently {Math.floor(Math.random() * 1000) + 500}+ active coders online</span>
        </motion.div>
      </motion.div>

      {/* Right Panel - Clean Minimalist Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 bg-white relative">
        <div className="absolute top-8 right-8 lg:hidden">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">{config.app.name}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight mb-3">Sign In</h2>
            <p className="text-zinc-500 font-medium">Please enter your credentials to access your dashboard.</p>
          </div>

          <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 relative overflow-hidden">
            {/* Subtle Gradient Hint */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary to-primary/10" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-bold text-zinc-700 ml-1">
                  Username
                </label>
                <div className="relative group">
                  <input
                    {...register('username', { required: 'Username is required' })}
                    type="text"
                    id="username"
                    className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    placeholder="e.g. jdoe_dev"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
                <AnimatePresence>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-rose-500 text-xs font-bold mt-1 ml-1"
                    >
                      {errors.username.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label htmlFor="password" className="text-sm font-bold text-zinc-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-zinc-400 hover:text-primary transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 pr-14 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-rose-500 text-xs font-bold mt-1 ml-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3 ml-1">
                <div className="relative flex items-center cursor-pointer">
                  <input
                    id="remember"
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border-2 border-zinc-200 rounded-md checked:bg-primary checked:border-primary transition-all cursor-pointer"
                  />
                  <div className="absolute w-5 h-5 flex items-center justify-center text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <label htmlFor="remember" className="text-sm font-bold text-zinc-500 cursor-pointer select-none">
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to Account
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-12 text-center">
            <p className="text-zinc-500 font-bold">
              New here?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-black transition-all underline underline-offset-8 decoration-2 decoration-primary/20 hover:decoration-primary"
              >
                Create a free account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage