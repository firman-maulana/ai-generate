"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Video, Image as ImageIcon, Wand2 } from "lucide-react"

export default function ExploreContent({ isDarkMode }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("video")

  const templates = [
    {
      id: 1,
      title: "Text to Video",
      description: "Generate videos from text descriptions",
      thumbnail: "/images/AI-Software.jpg",
      category: "video",
      icon: <Video size={20} />
    },
    {
      id: 2,
      title: "Image to Video",
      description: "Animate your images into videos",
      thumbnail: "/images/AI-Application.jpg",
      category: "video",
      icon: <ImageIcon size={20} />
    },
    {
      id: 3,
      title: "AI Enhancement",
      description: "Enhance video quality with AI",
      thumbnail: "/images/AI-Agency.jpg",
      category: "video",
      icon: <Wand2 size={20} />
    },
    {
      id: 4,
      title: "Style Transfer",
      description: "Apply artistic styles to videos",
      thumbnail: "/images/Creative-Portfolio.jpg",
      category: "video",
      icon: <Sparkles size={20} />
    },
    {
      id: 5,
      title: "Motion Graphics",
      description: "Create dynamic motion graphics",
      thumbnail: "/images/Digital-Marketing-Agency.jpg",
      category: "video",
      icon: <Video size={20} />
    },
    {
      id: 6,
      title: "Video Effects",
      description: "Add stunning effects to videos",
      thumbnail: "/images/AI-Chatbot.jpg",
      category: "video",
      icon: <Wand2 size={20} />
    }
  ]

  const handleTemplateClick = () => {
    router.push("/chat")
  }

  const getStyles = (isDark) => ({
    container: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    },
    header: {
      padding: "32px 48px",
      borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
      background: isDark ? "#0f172a" : "#ffffff",
      transition: "all 0.3s ease"
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#0f172a",
      marginBottom: "8px"
    },
    subtitle: {
      fontSize: "16px",
      color: isDark ? "#94a3b8" : "#64748b",
      marginBottom: "24px"
    },
    tabs: {
      display: "flex",
      gap: "16px"
    },
    tab: {
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      background: "transparent",
      color: isDark ? "#94a3b8" : "#64748b",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease"
    },
    tabActive: {
      background: isDark ? "#3b82f6" : "#0f172a",
      color: "#ffffff"
    },
    content: {
      flex: 1,
      overflowY: "auto",
      padding: "48px"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "24px"
    },
    card: {
      borderRadius: "16px",
      overflow: "hidden",
      background: isDark ? "#0f172a" : "#ffffff",
      border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: isDark ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
    },
    cardImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover"
    },
    cardContent: {
      padding: "20px"
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px"
    },
    cardIcon: {
      color: isDark ? "#3b82f6" : "#0f172a"
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: isDark ? "#ffffff" : "#0f172a"
    },
    cardDescription: {
      fontSize: "14px",
      color: isDark ? "#94a3b8" : "#64748b",
      lineHeight: "1.5"
    }
  })

  const styles = getStyles(isDarkMode)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Explore AI Video Tools</h1>
        <p style={styles.subtitle}>Discover powerful AI tools to create amazing videos</p>
        
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "video" ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab("video")}
          >
            Video Generation
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "image" ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab("image")}
          >
            Image Tools
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "effects" ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab("effects")}
          >
            Effects & Filters
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.grid}>
          {templates.map((template) => (
            <div
              key={template.id}
              style={styles.card}
              onClick={handleTemplateClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? "0 8px 16px rgba(0,0,0,0.4)" 
                  : "0 8px 16px rgba(0,0,0,0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? "0 4px 6px rgba(0,0,0,0.3)" 
                  : "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
              <img
                src={template.thumbnail}
                alt={template.title}
                style={styles.cardImage}
              />
              <div style={styles.cardContent}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardIcon}>{template.icon}</span>
                  <h3 style={styles.cardTitle}>{template.title}</h3>
                </div>
                <p style={styles.cardDescription}>{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
