import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { useNotificationStore } from '@store/notificationStore'
import { config } from '@/config'
import { getUserDisplayName, getUserRoleDisplay, canAccessAdminConsole } from '@utils/permissions'
import SearchDropdown from './SearchDropdown'
import NotificationDrawer from './NotificationDrawer'

interface TopNavbarProps {
  onMenuClick: () => void
}

const TopNavbar = ({ onMenuClick }: TopNavbarProps) => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const unread = unreadCount()

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 lg:px-12 relative z-50">
      {/* Left side */}
      <div className="flex items-center space-x-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Breadcrumb or Page Title */}
        <div className="hidden lg:block">
          <h1 className="text-sm font-black text-black uppercase tracking-[0.2em] leading-none">
            {config.app.name}
          </h1>
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] mt-1.5">
            Registry Protocol / v1.0
          </p>
        </div>
      </div>

      {/* Middle side - Search */}
      <SearchDropdown />

      {/* Right side */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-3 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 active:scale-90"
        >
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unread > 0 && (
            <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[8px] font-black text-white ring-2 ring-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* User Menu */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-4 p-2 pl-4 rounded-full border border-gray-100 hover:shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-all bg-white"
            >
              <div className="hidden md:block text-right">
                <div className="text-[10px] font-black text-black uppercase tracking-widest leading-none">
                  {getUserDisplayName(user)}
                </div>
                <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">
                  {getUserRoleDisplay(user)}
                </div>
              </div>
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg border-2 border-white">
                {getUserDisplayName(user).charAt(0).toUpperCase()}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-[0px_20px_60px_rgba(0,0,0,0.08)] border border-gray-50 py-4 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="px-8 py-6 border-b border-gray-50 mb-2">
                  <div className="text-xs font-black text-black uppercase tracking-tight">
                    {getUserDisplayName(user)}
                  </div>
                  <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">
                    {user.email}
                  </div>
                </div>

                <div className="px-4 space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black hover:bg-gray-50 rounded-2xl transition-all"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span>👤</span> View Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black hover:bg-gray-50 rounded-2xl transition-all"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span>⚙️</span> Settings
                  </Link>

                  {canAccessAdminConsole(user) && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black hover:bg-gray-50 rounded-2xl transition-all"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span>🛠️</span> Admin Console
                    </Link>
                  )}

                  {user?.role === 'super_admin' && (
                    <Link
                      to="/super-admin"
                      className="flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black hover:bg-gray-50 rounded-2xl transition-all"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span>👑</span> Super Admin Console
                    </Link>
                  )}
                </div>

                <div className="px-8 my-4">
                  <div className="h-px bg-gray-50 w-full" />
                </div>

                <div className="px-4">
                  <button
                    onClick={() => {
                      logout()
                      setShowUserMenu(false)
                    }}
                    className="flex items-center gap-4 w-full px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] bg-black text-white rounded-full hover:bg-gray-800 transition-all shadow-xl active:scale-95"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Click outside handler */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-[90]"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </header>
  )
}

export default TopNavbar