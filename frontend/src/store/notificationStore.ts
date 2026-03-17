import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Notification } from '@/types'

interface NotificationState {
    notifications: Notification[]
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    deleteNotification: (id: string) => void
    clearAll: () => void
    unreadCount: () => number
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [
                {
                    id: '1',
                    title: 'System Update',
                    message: 'The platform will undergo maintenance at 2 AM UTC.',
                    createdAt: new Date().toISOString(),
                    read: false,
                    type: 'info'
                },
                {
                    id: '2',
                    title: 'New Contest',
                    message: 'Weekly Alpha Sprint #43 is now open for registration.',
                    createdAt: new Date(Date.now() - 3600000).toISOString(),
                    read: false,
                    type: 'success'
                },
                {
                    id: '3',
                    title: 'Submission Accepted',
                    message: 'Your submission for "Two Sum" was accepted.',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    read: true,
                    type: 'success'
                }
            ],
            addNotification: (notification) => {
                const newNotification: Notification = {
                    ...notification,
                    id: Math.random().toString(36).substring(7),
                    createdAt: new Date().toISOString(),
                    read: false,
                }
                set((state) => ({
                    notifications: [newNotification, ...state.notifications]
                }))
            },
            markAsRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    )
                }))
            },
            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true }))
                }))
            },
            deleteNotification: (id) => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id)
                }))
            },
            clearAll: () => {
                set({ notifications: [] })
            },
            unreadCount: () => {
                return get().notifications.filter((n) => !n.read).length
            }
        }),
        {
            name: 'notification-storage',
        }
    )
)
