import { ReactNode } from 'react'
import { cn } from '@utils/cn'

interface DashboardCardProps {
  title: string
  subtitle?: string
  value?: string | number
  icon?: ReactNode
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  children?: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  gradient?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'gray'
}

const DashboardCard = ({
  title,
  subtitle,
  value,
  icon,
  trend,
  children,
  className,
  onClick,
  href,
  gradient = 'blue'
}: DashboardCardProps) => {
  const gradients = {
    blue: 'from-gray-800 to-black',
    green: 'from-gray-700 to-gray-900',
    purple: 'from-gray-600 to-gray-800',
    orange: 'from-gray-500 to-gray-700',
    red: 'from-black to-gray-900',
    indigo: 'from-gray-400 to-gray-600',
    gray: 'from-gray-800 to-black'
  }

  const CardWrapper = ({ children }: { children: ReactNode }) => {
    if (href) {
      return (
        <a
          href={href}
          className={cn(
            'block group transition-all duration-200 hover:scale-105',
            className
          )}
        >
          {children}
        </a>
      )
    }

    if (onClick) {
      return (
        <button
          onClick={onClick}
          className={cn(
            'w-full text-left group transition-all duration-200 hover:scale-105',
            className
          )}
        >
          {children}
        </button>
      )
    }

    return (
      <div className={cn('group', className)}>
        {children}
      </div>
    )
  }

  return (
    <CardWrapper>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group-hover:shadow-xl transition-all duration-200">
        {/* Header with gradient */}
        <div className={cn(
          'bg-gradient-to-r p-4 text-white relative overflow-hidden',
          gradients[gradient]
        )}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <pattern id={`pattern-${gradient}`} patternUnits="userSpaceOnUse" width="20" height="20">
                  <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#pattern-${gradient})`} />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-white/90 text-sm">{title}</h3>
              {subtitle && (
                <p className="text-xs text-white/70 mt-1">{subtitle}</p>
              )}
            </div>
            {icon && (
              <div className="ml-4 text-2xl text-white/90">
                {icon}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {value !== undefined && (
            <div className="mb-3">
              <div className="text-2xl font-bold text-gray-900">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
              {trend && (
                <div className="flex items-center mt-1">
                  <span className={cn(
                    'text-sm font-medium flex items-center',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}>
                    {trend.isPositive ? '↗️' : '↘️'}
                    <span className="ml-1">{trend.value}% {trend.label}</span>
                  </span>
                </div>
              )}
            </div>
          )}

          {children && (
            <div className="text-sm text-gray-600">
              {children}
            </div>
          )}

          {/* Hover effect indicator */}
          {(onClick || href) && (
            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="text-xs text-gray-500 flex items-center">
                Click to view details
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </CardWrapper>

  )
}

export default DashboardCard