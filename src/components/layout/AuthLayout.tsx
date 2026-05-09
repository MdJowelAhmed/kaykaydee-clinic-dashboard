import { Outlet, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className=" flex bg-[#f2f3f6] h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 p-6 h-full">
        <img
          src="/assets/auth.png"
          alt="auth-bg"
          className="w-full h-full object-contain rounded-3xl"
        />
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12  ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}












