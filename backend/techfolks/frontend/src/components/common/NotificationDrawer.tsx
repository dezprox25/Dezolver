import { useState, useEffect } from 'react'
import { useNotificationStore } from '@store/notificationStore'
import NotificationItem from './NotificationItem'
import { cn } from '@utils/cn'

interface NotificationDrawerProps {
    isOpen: boolean
    onClose: () => void
}

const NotificationDrawer = ({ isOpen, onClose }: NotificationDrawerProps) => {
    const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore()
    const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all')

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'unread') return !n.read
        if (activeTab === 'read') return n.read
        return true
    })

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    // Prevent scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={cn(
                "fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-[110] shadow-2xl transition-transform duration-500 ease-in-out transform",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight text-black">Notifications</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-2">Active Telemetry / System Feed</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                {(['all', 'unread', 'read'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "text-[10px] font-black uppercase tracking-[0.2em] transition-all relative pb-2",
                                            activeTab === tab
                                                ? "text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                                                : "text-gray-300 hover:text-gray-500"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={markAllAsRead}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
                            >
                                Clear Unread
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredNotifications.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {filteredNotifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={markAsRead}
                                        onDelete={deleteNotification}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-6">
                                    <span className="text-2xl grayscale">📡</span>
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-black mb-2">Feed Clear</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No notifications to display in this registry.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-8 border-t border-gray-100">
                            <button
                                onClick={clearAll}
                                className="w-full py-4 border-2 border-dashed border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:border-black hover:text-black transition-all rounded-2xl"
                            >
                                Purge All Records
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default NotificationDrawer
