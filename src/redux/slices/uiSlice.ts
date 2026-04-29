import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ModalType } from '@/types'

const THEME_STORAGE_KEY = 'theme'
type ThemeMode = 'light' | 'dark'

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'dark' ? 'dark' : 'light'
}

function applyThemeToDom(theme: ThemeMode) {
  if (typeof document === 'undefined') return
  if (theme === 'dark') document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
}

function persistTheme(theme: ThemeMode) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

interface ModalState {
  isOpen: boolean
  type: ModalType
  data: unknown
}

interface UIState {
  modal: ModalState
  sidebarCollapsed: boolean
  theme: ThemeMode
  globalLoading: boolean
  toast: {
    isOpen: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
  }
}

const initialState: UIState = {
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  sidebarCollapsed: false,
  theme: getInitialTheme(),
  globalLoading: false,
  toast: {
    isOpen: false,
    type: 'info',
    message: '',
  },
}

applyThemeToDom(initialState.theme)

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ type: ModalType; data?: unknown }>) => {
      state.modal.isOpen = true
      state.modal.type = action.payload.type
      state.modal.data = action.payload.data || null
    },
    closeModal: (state) => {
      state.modal.isOpen = false
      state.modal.type = null
      state.modal.data = null
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload
      applyThemeToDom(action.payload)
      persistTheme(action.payload)
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      state.theme = newTheme
      applyThemeToDom(newTheme)
      persistTheme(newTheme)
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload
    },
    showToast: (state, action: PayloadAction<{ type: UIState['toast']['type']; message: string }>) => {
      state.toast.isOpen = true
      state.toast.type = action.payload.type
      state.toast.message = action.payload.message
    },
    hideToast: (state) => {
      state.toast.isOpen = false
    },
  },
})

export const {
  openModal,
  closeModal,
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  toggleTheme,
  setGlobalLoading,
  showToast,
  hideToast,
} = uiSlice.actions

export default uiSlice.reducer













