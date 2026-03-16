"use client"
import { Play } from "lucide-react"

export default function ExploreGrid({ isDarkMode, selectedCategory }) {
  // Sample data - replace with real data from API
  const templates = [
    {
      id: 1,
      title: "Cinematic Landscape",
      thumbnail: "/images/AI-Agency.jpg",
      category: "text-to-video",
      duration: "5s",
      views: "12.3K"
    },
    {
      id: 2,
      title: "Product Showcase",
      thumbnail: "/images/AI-Application.jpg",
      category: "image-to-video",
      duration: "10s",
      views: "8.7K"
    },
    {
      id: 3,
      title: "Abstract Motion",
      thumbnail: "/images/AI-Chatbot.jpg",
      category: "text-to-video",
      duration: "15s",
      views: "15.2K"
    },
    {
      id: 4,
      title: "Nature Scene",
      thumbnail: "/images/AI-Gadget.jpg",
      category: "text-to-video",
      duration: "8s",
      views: "9.1K"
    },
    {
      id: 5,
      title: "Tech Animation",
      thumbnail: "/images/AI-SaaS-Software.jpg",
      category: "image-to-video",
      duration: "12s",
      views: "11.5K"
    },
    {
      id: 6,
      title: "Urban Vibes",
      thumbnail: "/images/AI-Software.jpg",
      category: "text-to-video",
      duration: "7s",
      views: "13.8K"
    }
  ]

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  const getStyles = (isDark) => ({
    container: {
      flex: 1,
      overflowY: "auto",
      padding: "40px",
      background: isDark ? "#0a0a0a" : "#f8fafc"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "24px"
    },
    card: {
      borderRadius: "16px",
      overflow: "hidden",
      background: isDark ? "#1a1a1a" : "#ffffff",
      border: isDark ? "1px solid #1f1f1f" : "1px solid #e2e8f0",
      cursor: "pointer",
      transition: "all 0.3s ease"
    },
    cardHover: {
      transform: "translateY(-4px)",
      boxShadow: isDark 
        ? "0 8px 24px rgba(0,0,0,0.4)" 
        : "0 8px 24px rgba(0,0,0,0.1)"
    },
    thumbnailContainer: {
      position: "relative",
      paddingTop: "56.25%",
      background: isDark ? "#0f0f0f" : "#f1f5f9",
      overflow: "hidden"
    },
    thumbnail: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    playOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.3)",
      opacity: 0,
      transition: "opacity 0.3s ease"
    },
    playButton: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.9)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#0f172a"
    },
    cardContent: {
      padding: "16px"
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: isDark ? "#ffffff" : "#0f172a",
      marginBottom: "8px"
    },
    cardMeta: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "13px",
      color: isDark ? "#64748b" : "#94a3b8"
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: isDark ? "#64748b" : "#94a3b8"
    }
  })

  const styles = getStyles(isDarkMode)

  return (
    <div style={styles.container}>
      {filteredTemplates.length > 0 ? (
        <div style={styles.grid}>
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow
                const overlay = e.currentTarget.querySelector('[data-overlay]')
                if (overlay) overlay.style.opacity = "1"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
                const overlay = e.currentTarget.querySelector('[data-overlay]')
                if (overlay) overlay.style.opacity = "0"
              }}
            >
              <div style={styles.thumbnailContainer}>
                <img
                  src={template.thumbnail}
                  alt={template.title}
                  style={styles.thumbnail}
                />
                <div style={styles.playOverlay} data-overlay>
                  <div style={styles.playButton}>
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.cardTitle}>{template.title}</div>
                <div style={styles.cardMeta}>
                  <span>{template.duration}</span>
                  <span>{template.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>No templates found for this category</p>
        </div>
      )}
    </div>
  )
}
