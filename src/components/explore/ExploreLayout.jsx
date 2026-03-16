"use client"
import { useState } from "react"
import Sidebar from "../chat/Sidebar"
import CreateModal from "./CreateModal"
import NewExploreContent from "./NewExploreContent"
import { useApp } from "@/contexts/AppContext"

export default function ExploreLayout() {
  const { isDarkMode, toggleTheme } = useApp()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const handleCreateNew = () => {
    setShowCreateModal(true)
  }

  const getStyles = (isDark) => ({
    container: {
      display: "flex",
      height: "100vh",
      background: isDark ? "#0a0a0a" : "#f8fafc",
      overflow: "hidden",
      transition: "background 0.3s ease"
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  })

  const styles = getStyles(isDarkMode)

  return (
    <div style={styles.container}>
      <Sidebar
        createNewChat={handleCreateNew}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      <div style={styles.main}>
        <NewExploreContent isDarkMode={isDarkMode} />
      </div>

      {showCreateModal && (
        <CreateModal
          isDarkMode={isDarkMode}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}