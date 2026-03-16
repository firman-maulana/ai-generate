"use client"
import { useRouter } from "next/navigation"
import { X, Video, Image as ImageIcon } from "lucide-react"

export default function CreateModal({ isDarkMode, onClose }) {
  const router = useRouter()

  const options = [
    {
      id: "text-to-video",
      icon: Video,
      title: "Text to Video",
      description: "Generate video from text description",
      action: () => router.push("/chat")
    },
    {
      id: "image-to-video",
      icon: ImageIcon,
      title: "Image to Video",
      description: "Animate your images into videos",
      action: () => router.push("/chat")
    }
  ]

  const getStyles = (isDark) => ({
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    },
    modal: {
      background: isDark ? "#1a1a1a" : "#ffffff",
      borderRadius: "20px",
      padding: "32px",
      maxWidth: "600px",
      width: "90%",
      position: "relative"
    },
    closeButton: {
      position: "absolute",
      top: "20px",
      right: "20px",
      background: "transparent",
      border: "none",
      color: isDark ? "#94a3b8" : "#64748b",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    title: {
      fontSize: "24px",
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#0f172a",
      marginBottom: "24px"
    },
    optionsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "16px"
    },
    optionCard: {
      padding: "24px",
      borderRadius: "16px",
      border: isDark ? "2px solid #1f1f1f" : "2px solid #e2e8f0",
      background: isDark ? "#0f0f0f" : "#f8fafc",
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "center"
    },
    optionCardHover: {
      borderColor: "#3b82f6",
      transform: "translateY(-2px)"
    },
    iconContainer: {
      width: "56px",
      height: "56px",
      borderRadius: "12px",
      background: isDark ? "#1f1f1f" : "#e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px",
      color: isDark ? "#3b82f6" : "#0f172a"
    },
    optionTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: isDark ? "#ffffff" : "#0f172a",
      marginBottom: "8px"
    },
    optionDescription: {
      fontSize: "13px",
      color: isDark ? "#64748b" : "#94a3b8"
    }
  })

  const styles = getStyles(isDarkMode)

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <h2 style={styles.title}>Create New Video</h2>

        <div style={styles.optionsGrid}>
          {options.map((option) => {
            const Icon = option.icon
            return (
              <div
                key={option.id}
                style={styles.optionCard}
                onClick={option.action}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = styles.optionCardHover.borderColor
                  e.currentTarget.style.transform = styles.optionCardHover.transform
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDarkMode ? "#1f1f1f" : "#e2e8f0"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                <div style={styles.iconContainer}>
                  <Icon size={28} />
                </div>
                <div style={styles.optionTitle}>{option.title}</div>
                <div style={styles.optionDescription}>{option.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
