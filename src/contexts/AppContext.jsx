"use client"
import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  // Theme state - persist to localStorage
  const [isDarkMode, setIsDarkMode] = useState(false) // Default light mode
  
  // Generating state - persist to localStorage
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const savedGenerating = localStorage.getItem('isGenerating')
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    }
    
    if (savedGenerating === 'true') {
      setIsGenerating(true)
    }
  }, [])
  
  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])
  
  // Save generating state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('isGenerating', isGenerating.toString())
  }, [isGenerating])
  
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }
  
  const startGenerating = () => {
    setIsGenerating(true)
  }
  
  const stopGenerating = () => {
    setIsGenerating(false)
  }
  
  return (
    <AppContext.Provider value={{
      isDarkMode,
      toggleTheme,
      isGenerating,
      startGenerating,
      stopGenerating
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
