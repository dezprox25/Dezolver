import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { applyTheme } from '@utils/theme'

export type Theme = 'light'

interface SettingsState {
  theme: Theme
  fontSize: 'small' | 'medium' | 'large'
  codeEditorTheme: 'vs-light' | 'vs-dark' | 'github-light' | 'github-dark'
  autoSave: boolean
  notifications: boolean
  soundEffects: boolean
  compactMode: boolean
  setTheme: (theme: Theme) => void
  setFontSize: (fontSize: 'small' | 'medium' | 'large') => void
  setCodeEditorTheme: (theme: 'vs-light' | 'vs-dark' | 'github-light' | 'github-dark') => void
  setAutoSave: (enabled: boolean) => void
  setNotifications: (enabled: boolean) => void
  setSoundEffects: (enabled: boolean) => void
  setCompactMode: (enabled: boolean) => void
  resetToDefaults: () => void
}

const defaultSettings = {
  theme: 'light' as Theme,
  fontSize: 'medium' as const,
  codeEditorTheme: 'vs-light' as const,
  autoSave: true,
  notifications: true,
  soundEffects: false,
  compactMode: false,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTheme: () => {
        set({ theme: 'light' })
        applyTheme('light')
      },
      setFontSize: (fontSize) => set({ fontSize }),
      setCodeEditorTheme: (codeEditorTheme) => set({ codeEditorTheme }),
      setAutoSave: (autoSave) => set({ autoSave }),
      setNotifications: (notifications) => set({ notifications }),
      setSoundEffects: (soundEffects) => set({ soundEffects }),
      setCompactMode: (compactMode) => set({ compactMode }),
      resetToDefaults: () => {
        set(defaultSettings)
        applyTheme('light')
      },
    }),
    {
      name: 'app-settings',
    }
  )
)

if (typeof window !== 'undefined') {
  applyTheme('light')
}

export const useTheme = () => {
  return {
    theme: 'light' as const,
    actualTheme: 'light' as const,
    isDark: false,
    isLight: true,
  }
}