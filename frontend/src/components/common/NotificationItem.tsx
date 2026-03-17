import { Notification } from '@/types'
import { cn } from '@utils/cn'

interface NotificationItemProps {
    notification: Notification
    onMarkAsRead: (id: string) => void
    onDelete: (id: string) => void
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()

        if (diff < 60000) return 'Just now'
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
        return date.toLocaleDateString()
    }

    const getTypeIcon = (type?: string) => {
        switch (type) {
            case 'success': return '✅'
            case 'warning': return '⚠️'
            case 'error': return '❌'
            default: return 'ℹ️'
        }
    }

    return (
        <div
            onClick={() => !notification.read && onMarkAsRead(notification.id)}
            className={cn(
                "p-4 border-b border-gray-100 transition-all cursor-pointer relative group",
                notification.read ? "bg-white opacity-60" : "bg-gray-50/50 hover:bg-gray-50",
                !notification.read && "after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-black"
            )}
        >
            <div className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-1">{getTypeIcon(notification.type)}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={cn(
                            "text-xs font-black uppercase tracking-widest truncate pr-6",
                            notification.read ? "text-gray-400" : "text-black"
                        )}>
                            {notification.title}
                        </h4>
                        <span className="text-[9px] font-bold text-gray-300 uppercase shrink-0">
                            {formatTime(notification.createdAt)}
                        </span>
                    </div>
                    <p className={cn(
                        "text-[10px] leading-relaxed",
                        notification.read ? "text-gray-400 line-clamp-1" : "text-gray-600 line-clamp-2"
                    )}>
                        {notification.message}
                    </p>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete(notification.id)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {!notification.read && (
                <span className="absolute right-2 top-4 w-2 h-2 bg-black rounded-full" />
            )}
        </div>
    )
}

export default NotificationItem
