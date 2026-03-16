"use client"
import { Search, Plus } from "lucide-react"

export default function ExploreHeader({ isDarkMode, selectedCategory, setSelectedCategory, onCreateNew }) {
  const categories = [
    { id: "all", label: "All" },
    { id: "text-to-video", label: "Text to Video" },
    { id: "image-to-video", label: "Image to Video" },
    { id: "trending", label: "Trending" },
    { id: "recent", label: "Recent" }
  ]

  const getStyles = (isDark) => ({
    header: {
      padding: "24px 40px",
      borderBottom: isDark ? "1px solid #1f1f1f" : "1px solid #e2e8f0",
      background: isDark ? "#0a0a0a" : "#ffffff",
      transition: "all 0.3s ease"
    },
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px"
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#0f172a",
      margin: 0
    },
    createButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 24px",
      borderRadius: "12px",
      border: "none",
      background: isDark ? "#3b82f6" : "#0f172a",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.2s ease"
    },
    searchRow: {
      display: "flex",
      gap: "16px",
      alignItems: "center"
    },
    searchContainer: {
      flex: 1,
      position: "relative",
      maxWidth: "500px"
    },
    searchIcon: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: isDark ? "#64748b" : "#94a3b8"
    },
    searchInput: {
      width: "100%",
      padding: "12px 16px 12px 48px",
      borderRadius: "12px",
      border: isDark ? "1px solid #1f1f1f" : "1px solid #e2e8f0",
      background: isDark ? "#1a1a1a" : "#f8fafc",
      color: isDark ? "#ffffff" : "#0f172a",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.2s ease"
    },
    categories: {
      display: "flex",
      gap: "12px"
    },
    categoryButton: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      background: "transparent",
      color: isDark ? "#94a3b8" : "#64748b",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap"
    },
    categoryButtonActive: {
      background: isDark ? "#1f1f1f" : "#e2e8f0",
      color: isDark ? "#ffffff" : "#0f172a"
    }
  })

  const styles = getStyles(isDarkMode)

  return (
    <div style={styles.header}>
      <div style={styles.topRow}>
        <h1 style={styles.title}>Explore</h1>
        <button style={styles.createButton} onClick={onCreateNew}>
          <Plus size={20} />
          Create New
        </button>
      </div>

      <div style={styles.searchRow}>
        <div style={styles.searchContainer}>
          <Search size={20} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search templates, styles, or ideas..."
            style={styles.searchInput}
          />
        </div>

        <div style={styles.categories}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === cat.id ? styles.categoryButtonActive : {})
              }}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
