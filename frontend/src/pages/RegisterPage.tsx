// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useForm } from 'react-hook-form'
// import { useAuthStore } from '@store/authStore'
// import { authAPI } from '@services/api'
// import { config } from '@/config'
// import toast from 'react-hot-toast'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Eye, EyeOff, ShieldCheck, Code2, Trophy, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

// interface RegisterFormData {
//   username: string
//   email: string
//   fullName: string
//   phoneNumber?: string
//   password: string
//   confirmPassword: string
// }

// const RegisterPage = () => {
//   const navigate = useNavigate()
//   const { register: registerUser } = useAuthStore()
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<RegisterFormData>()

//   const password = watch('password')

//   const onSubmit = async (data: RegisterFormData) => {
//     try {
//       setLoading(true)

//       const response = await authAPI.register({
//         username: data.username,
//         email: data.email,
//         password: data.password,
//         fullName: data.fullName,
//         phoneNumber: data.phoneNumber || undefined
//       })

//       if ((response as any)?.data?.user && (response as any)?.data?.token) {
//         const refreshToken = (response as any)?.data?.refreshToken
//         registerUser((response as any).data.user, (response as any).data.token, refreshToken)
//         toast.success('Welcome to the elite tribe!')
//         navigate('/profile')
//       } else {
//         throw new Error('Invalid registration response')
//       }

//     } catch (error: any) {
//       const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.'
//       toast.error(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex bg-white font-sans selection:bg-primary/10">
//       {/* Left Panel - Premium Marketing/Branding (Consistent with LoginPage) */}
//       <motion.div
//         initial={{ opacity: 0, x: -30 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="hidden lg:flex w-[45%] bg-zinc-50 flex-col justify-between p-16 relative overflow-hidden border-r border-zinc-100"
//       >
//         {/* Background Decorative Elements */}
//         <div className="absolute inset-0 z-0">
//           <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/[0.03] rounded-full blur-[120px]" />
//           <div className="absolute bottom-[5%] right-[-5%] w-[50%] h-[50%] bg-primary/[0.02] rounded-full blur-[100px]" />
//           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
//         </div>

//         <div className="relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="flex items-center gap-3 mb-16"
//           >
//             <div className="bg-primary p-2 rounded-2xl shadow-lg shadow-primary/20">
//               <Code2 className="w-8 h-8 text-white" />
//             </div>
//             <span className="text-3xl font-black tracking-tighter text-zinc-900">{config.app.name}</span>
//           </motion.div>

//           <div className="space-y-8">
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="text-6xl font-black leading-[1.1] text-zinc-900 tracking-tight"
//             >
//               Join the <br />
//               <span className="text-zinc-400">Elite Tribe.</span>
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="text-xl text-zinc-500 max-w-md leading-relaxed"
//             >
//               Start your journey to becoming a world-class developer with {config.app.name}.
//             </motion.p>
//           </div>

//           <div className="mt-20 space-y-6">
//             {[
//               { icon: ShieldCheck, title: "Global Recognition", desc: "Get certified and stand out to top tech recruiters." },
//               { icon: Sparkles, title: "Real-world Problems", desc: "Solve challenges curated by industry experts." },
//               { icon: Trophy, title: "Win Rewards", desc: "Participate in global contests and win prizes." }
//             ].map((feature, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.6 + i * 0.1 }}
//                 className="flex items-center gap-5 group cursor-default"
//               >
//                 <div className="flex-shrink-0 bg-white p-3 rounded-xl shadow-sm border border-zinc-100 group-hover:border-primary/20 group-hover:shadow-md transition-all">
//                   <feature.icon className="w-6 h-6 text-zinc-400 group-hover:text-primary transition-colors" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-zinc-900 group-hover:text-primary transition-colors">{feature.title}</h3>
//                   <p className="text-sm text-zinc-500">{feature.desc}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1 }}
//           className="relative z-10 flex items-center gap-2 text-sm font-medium text-zinc-400"
//         >
//           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//           <span>Join thousands of elite developers today</span>
//         </motion.div>
//       </motion.div>

//       {/* Right Panel - Register Form */}
//       <div className="w-full lg:w-[55%] flex items-center justify-center p-8 bg-white py-12 relative overflow-y-auto">
//         <div className="absolute top-8 right-8 lg:hidden">
//           <div className="flex items-center gap-2 text-primary">
//             <Code2 className="w-6 h-6" />
//             <span className="text-xl font-bold tracking-tight">{config.app.name}</span>
//           </div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="w-full max-w-xl"
//         >
//           <div className="mb-10 text-center md:text-left">
//             <h2 className="text-4xl font-black text-zinc-900 tracking-tight mb-3">Create Account</h2>
//             <p className="text-zinc-500 font-medium">Fast track your development career today.</p>
//           </div>

//           <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8 md:p-12 relative overflow-hidden">
//             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary to-primary/10" />

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label htmlFor="username" className="text-sm font-bold text-zinc-700 ml-1">
//                     Username
//                   </label>
//                   <div className="relative group">
//                     <input
//                       {...register('username', {
//                         required: 'Username is required',
//                         minLength: { value: 3, message: 'Min 3 chars' },
//                         maxLength: { value: 30, message: 'Max 30 chars' },
//                         pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Alphanumeric only' }
//                       })}
//                       placeholder="john_doe"
//                       className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
//                     />
//                   </div>
//                   <AnimatePresence>
//                     {errors.username && (
//                       <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-xs font-bold mt-1 ml-1">
//                         {errors.username.message}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 <div className="space-y-2">
//                   <label htmlFor="fullName" className="text-sm font-bold text-zinc-700 ml-1">
//                     Full Name
//                   </label>
//                   <div className="relative group">
//                     <input
//                       {...register('fullName', { required: 'Full name is required' })}
//                       placeholder="John Doe"
//                       className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
//                     />
//                   </div>
//                   <AnimatePresence>
//                     {errors.fullName && (
//                       <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-xs font-bold mt-1 ml-1">
//                         {errors.fullName.message}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label htmlFor="email" className="text-sm font-bold text-zinc-700 ml-1">
//                     Email
//                   </label>
//                   <div className="relative group">
//                     <input
//                       {...register('email', {
//                         required: 'Email is required',
//                         pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
//                       })}
//                       placeholder="john@example.com"
//                       className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
//                     />
//                   </div>
//                   <AnimatePresence>
//                     {errors.email && (
//                       <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-xs font-bold mt-1 ml-1">
//                         {errors.email.message}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 <div className="space-y-2">
//                   <label htmlFor="phoneNumber" className="text-sm font-bold text-zinc-700 ml-1 text-zinc-400">
//                     Phone <span className="font-medium text-zinc-300">(Optional)</span>
//                   </label>
//                   <div className="relative group">
//                     <input
//                       {...register('phoneNumber', {
//                         pattern: { value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, message: 'Invalid phone' }
//                       })}
//                       placeholder="+1 234 567 890"
//                       className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
//                     />
//                   </div>
//                   <AnimatePresence>
//                     {errors.phoneNumber && (
//                       <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-xs font-bold mt-1 ml-1">
//                         {errors.phoneNumber.message}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label htmlFor="password" className="text-sm font-bold text-zinc-700 ml-1">
//                     Password
//                   </label>
//                   <div className="relative group">
//                     <input
//                       {...register('password', {
//                         required: 'Password is required',
//                         minLength: { value: 8, message: 'Min 8 chars' },
//                         pattern: { value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Upper, lower & num needed' }
//                       })}
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="••••••••"
//                       className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 pr-14 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors p-1"
//                     >
//                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                   <AnimatePresence>
//                     {errors.password && (
//                       <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-xs font-bold mt-1 ml-1">
//                         {errors.password.message}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 <div className="space-y-2">
//                   <label htmlFor="confirmPassword" className="text-sm font-bold text-zinc-700 ml-1">
//                     Confirm Password
//                   </label>
//                   <div className="relative group">
//                     <input
//                       {...register('confirmPassword', {
//                         required: 'Please confirm password',
//                         validate: value => value === password || 'Passwords do not match'
//                       })}
//                       type={showConfirmPassword ? 'text' : 'password'}
//                       placeholder="••••••••"
//                       className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 pr-14 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors p-1"
//                     >
//                       {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                   <AnimatePresence>
//                     {errors.confirmPassword && (
//                       <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-xs font-bold mt-1 ml-1">
//                         {errors.confirmPassword.message}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>

//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none group"
//                 >
//                   {loading ? (
//                     <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
//                   ) : (
//                     <>
//                       Create Elite Account
//                       <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>

//             <div className="mt-10 pt-8 border-t border-zinc-100 text-center">
//               <p className="text-zinc-500 font-bold">
//                 Already part of the tribe?{' '}
//                 <Link to="/login" className="text-primary hover:text-black transition-all underline underline-offset-8 decoration-2 decoration-primary/20 hover:decoration-primary">
//                   Sign in here
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default RegisterPage
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@store/authStore'
import { authAPI } from '@services/api'
import { config } from '@/config'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ShieldCheck, Code2, Trophy, ArrowRight, Sparkles } from 'lucide-react'

/**
 * Student Registration Form Data Interface
 * 
 * This interface defines the structure of the registration form.
 * All fields are required except officialEmail.
 * 
 * Backend developers should expect this exact structure in the registration payload.
 */
interface StudentRegisterFormData {
  email: string                 // Student's personal email (required, validated)
  studentName: string            // Full name of the student (required)
  collegeName: string            // Name of the college/university (required)
  registerNumber: string         // College registration/roll number (required)
  mobileNumber: string           // Contact number (required, validated)
  officialEmail?: string         // College official email (optional)
  password: string               // Account password (required, min 8 chars with validation)
  confirmPassword: string        // Password confirmation (frontend validation only)
}

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StudentRegisterFormData>()

  const password = watch('password')

  /**
   * Form Submission Handler
   * 
   * This function processes the form data and sends it to the backend.
   * The confirmPassword field is excluded from the API call as it's only for frontend validation.
   * 
   * Expected API endpoint: authAPI.register()
   * 
   * Payload structure sent to backend:
   * {
   *   email: string,
   *   studentName: string,
   *   collegeName: string,
   *   registerNumber: string,
   *   mobileNumber: string,
   *   officialEmail?: string,  // Optional field
   *   password: string
   * }
   */
  const onSubmit = async (data: StudentRegisterFormData) => {
    try {
      setLoading(true)

      // Prepare payload for backend (excluding confirmPassword)
      const registrationPayload = {
        email: data.email,
        studentName: data.studentName,
        collegeName: data.collegeName,
        registerNumber: data.registerNumber,
        mobileNumber: data.mobileNumber,
        officialEmail: data.officialEmail || undefined, // Send undefined if not provided
        password: data.password
      }

      // Call the registration API
      const response = await authAPI.register(registrationPayload)

      // Handle successful registration
      if ((response as any)?.data?.user && (response as any)?.data?.token) {
        const refreshToken = (response as any)?.data?.refreshToken
        registerUser((response as any).data.user, (response as any).data.token, refreshToken)
        toast.success('Registration successful! Welcome aboard!')
        navigate('/profile')
      } else {
        throw new Error('Invalid registration response from server')
      }

    } catch (error: any) {
      // Handle registration errors
      const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.'
      toast.error(errorMessage)
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-primary/10">
      {/* Left Panel - Marketing/Branding Section */}
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
              Join the <br />
              <span className="text-zinc-400">Elite Tribe.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-zinc-500 max-w-md leading-relaxed"
            >
              Start your journey to becoming a world-class developer with {config.app.name}.
            </motion.p>
          </div>

          <div className="mt-20 space-y-6">
            {[
              { icon: ShieldCheck, title: "Global Recognition", desc: "Get certified and stand out to top tech recruiters." },
              { icon: Sparkles, title: "Real-world Problems", desc: "Solve challenges curated by industry experts." },
              { icon: Trophy, title: "Win Rewards", desc: "Participate in global contests and win prizes." }
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
          <span>Join thousands of students today</span>
        </motion.div>
      </motion.div>

      {/* Right Panel - Student Registration Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 bg-white py-12 relative overflow-y-auto">
        {/* Mobile Logo */}
        <div className="absolute top-8 right-8 lg:hidden">
          <div className="flex items-center gap-2 text-primary">
            <Code2 className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">{config.app.name}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-xl"
        >
          {/* Form Header */}
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight mb-3">Student Registration</h2>
            <p className="text-lg text-zinc-500 font-medium">
              Create your account to get started
            </p>
          </div>

          <div className="bg-white">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Field 1: Email (Required) */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-zinc-700 ml-1">
                  Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { 
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                        message: 'Please enter a valid email address' 
                      }
                    })}
                    type="email"
                    id="email"
                    placeholder="student@example.com"
                    className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="text-rose-500 text-xs font-bold mt-1 ml-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Field 2: Student Name (Required) */}
              <div className="space-y-2">
                <label htmlFor="studentName" className="text-sm font-bold text-zinc-700 ml-1">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    {...register('studentName', { 
                      required: 'Student name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    type="text"
                    id="studentName"
                    placeholder="John Doe"
                    className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  />
                </div>
                <AnimatePresence>
                  {errors.studentName && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="text-rose-500 text-xs font-bold mt-1 ml-1"
                    >
                      {errors.studentName.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Field 3: College Name (Required) */}
              <div className="space-y-2">
                <label htmlFor="collegeName" className="text-sm font-bold text-zinc-700 ml-1">
                  College Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    {...register('collegeName', { 
                      required: 'College name is required',
                      minLength: {
                        value: 2,
                        message: 'College name must be at least 2 characters'
                      }
                    })}
                    type="text"
                    id="collegeName"
                    placeholder="ABC University"
                    className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  />
                </div>
                <AnimatePresence>
                  {errors.collegeName && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="text-rose-500 text-xs font-bold mt-1 ml-1"
                    >
                      {errors.collegeName.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Fields 4 & 5: Register Number and Mobile Number (Grid Layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 4: Register Number (Required) */}
                <div className="space-y-2">
                  <label htmlFor="registerNumber" className="text-sm font-bold text-zinc-700 ml-1">
                    Register Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      {...register('registerNumber', { 
                        required: 'Register number is required',
                        minLength: {
                          value: 3,
                          message: 'Register number must be at least 3 characters'
                        }
                      })}
                      type="text"
                      id="registerNumber"
                      placeholder="REG12345"
                      className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                  </div>
                  <AnimatePresence>
                    {errors.registerNumber && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }} 
                        className="text-rose-500 text-xs font-bold mt-1 ml-1"
                      >
                        {errors.registerNumber.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Field 5: Mobile Number (Required) */}
                <div className="space-y-2">
                  <label htmlFor="mobileNumber" className="text-sm font-bold text-zinc-700 ml-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      {...register('mobileNumber', {
                        required: 'Mobile number is required',
                        pattern: { 
                          value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                          message: 'Please enter a valid mobile number' 
                        }
                      })}
                      type="tel"
                      id="mobileNumber"
                      placeholder="+91 98765 43210"
                      className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                  </div>
                  <AnimatePresence>
                    {errors.mobileNumber && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }} 
                        className="text-rose-500 text-xs font-bold mt-1 ml-1"
                      >
                        {errors.mobileNumber.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Field 6: Official Email (Optional) */}
              <div className="space-y-2">
                <label htmlFor="officialEmail" className="text-sm font-bold text-zinc-400 ml-1">
                  Official Email <span className="font-medium text-zinc-300">(Optional)</span>
                </label>
                <div className="relative group">
                  <input
                    {...register('officialEmail', {
                      pattern: { 
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address' 
                      }
                    })}
                    type="email"
                    id="officialEmail"
                    placeholder="student@university.edu"
                    className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  />
                </div>
                <AnimatePresence>
                  {errors.officialEmail && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="text-rose-500 text-xs font-bold mt-1 ml-1"
                    >
                      {errors.officialEmail.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Fields 7 & 8: Password and Confirm Password (Grid Layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 7: Password (Required) */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-bold text-zinc-700 ml-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { 
                          value: 8, 
                          message: 'Password must be at least 8 characters' 
                        },
                        pattern: { 
                          value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Password must contain uppercase, lowercase, and number' 
                        }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="••••••••"
                      className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 pr-14 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors p-1"
                      aria-label="Toggle password visibility"
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

                {/* Field 8: Confirm Password (Required) */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-bold text-zinc-700 ml-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder="••••••••"
                      className="w-full h-14 bg-zinc-50 border-transparent rounded-2xl px-5 pr-14 text-zinc-900 font-medium placeholder:text-zinc-400 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors p-1"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.confirmPassword && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }} 
                        className="text-rose-500 text-xs font-bold mt-1 ml-1"
                      >
                        {errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-10 pt-8 border-t border-zinc-100 text-center">
              <p className="text-zinc-500 font-bold">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-black transition-all underline underline-offset-8 decoration-2 decoration-primary/20 hover:decoration-primary"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage