import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { cn } from '@utils/cn'
// ThemeToggle removed for minimalist white theme
import { config, constants } from '@/config'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()

  const navigation = [
    { name: 'Home', href: '/', show: true },
    { name: 'Problems', href: '/problems', show: true },
    { name: 'Contests', href: '/contests', show: config.features.contests },
    { name: 'Groups', href: '/groups', show: isAuthenticated && config.features.groups },
    { name: 'Certificates', href: '/certificates', show: isAuthenticated },
    { name: 'Employees', href: '/employees', show: isAuthenticated },
    { name: 'Payroll', href: '/payroll', show: isAuthenticated },
    { name: 'Bank Details', href: '/bank-details', show: isAuthenticated },
    { name: 'Leaderboard', href: '/leaderboard', show: config.features.leaderboard },
    { name: 'Settings', href: '/settings', show: isAuthenticated },
    { name: 'Admin', href: '/admin', show: isAuthenticated && user?.role === constants.userRoles.ADMIN && config.features.adminConsole },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-black text-black uppercase tracking-tighter">
                  {config.app.name}
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {navigation.map(
                  (item) =>
                    item.show && (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors',
                          isActive(item.href)
                            ? 'border-black text-black font-black'
                            : 'border-transparent text-gray-400 hover:text-black hover:border-gray-200',
                        )}
                      >
                        {item.name}
                      </Link>
                    ),
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle Removed */}

              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {user.username}
                  </Link>
                  <button
                    onClick={logout}
                    className="btn btn-outline px-4 py-2 text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition shadow-lg"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {config.app.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout