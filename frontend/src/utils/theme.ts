/**
 * Theme utilities for {config.app.name} application
 */

// Theme Utilities for White-Only Theme
export type Theme = 'light'

/**
 * Apply theme to document root (Locked to light)
 */
export const applyTheme = (_theme?: Theme) => {
  const root = window.document.documentElement
  root.classList.remove('dark')
  root.classList.add('light')
}

/**
 * Get current system theme preference (Deprecated, returns light)
 */
export const getSystemTheme = (): 'light' => {
  return 'light'
}

/**
 * Get the actual theme being displayed (Locked to light)
 */
export const getActualTheme = (_theme?: Theme): 'light' => {
  return 'light'
}

/**
 * Initialize theme on app startup (Enforces light)
 */
export const initializeTheme = () => {
  applyTheme('light')
}

/**
 * Listen for system theme changes (Disabled)
 */
export const setupSystemThemeListener = (_callback: (theme: 'light') => void) => {
  return () => { }
}