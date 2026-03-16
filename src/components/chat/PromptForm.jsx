"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"

export default function PromptForm({ chat, sendPrompt, isDarkMode }) {
  const { data: session } = useSession()
  const [input, setInput] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [duration, setDuration] = useState(5) // Default 5 detik

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const response = await fetch("http://localhost:8000/upload-image", {
        method: "POST",
        headers: {
          "X-User-Email": session.user.email
        },
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Upload failed")
      }
      
      const data = await response.json()
      
      if (data.success) {
        return data.url
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Image upload error:", error)
      throw new Error(`Failed to upload image: ${error.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input.trim() && !selectedImage) return

    setUploading(true)

    try {
      let imageUrl = null
      
      // Upload image jika ada
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage)
      }

      // Kirim prompt dengan image URL dan duration
      await sendPrompt(input || "Generate video from this image", imageUrl, duration)
      
      // Reset form
      setInput("")
      setSelectedImage(null)
      setImagePreview(null)
    } catch (error) {
      console.error("Submit error:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const downloadVideo = (videoUrl, filename = "generated-video.mp4") => {
    const link = document.createElement("a")
    link.href = videoUrl
    link.download = filename
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStyles = (isDark) => ({
    messages: {
      flex: 1,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      marginBottom: "20px",
      padding: "10px",
      background: isDark ? "#1e293b" : "#f8fafc",
      minHeight: 0,
      transition: "background 0.3s ease"
    },
    message: {
      padding: "16px",
      borderRadius: "12px",
      maxWidth: "75%",
      boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease"
    },
    messageContent: {
      marginBottom: "8px",
      lineHeight: "1.5",
    },
    uploadedImage: {
      marginBottom: "12px",
      maxWidth: "100%",
      maxHeight: "300px",
      borderRadius: "8px",
      objectFit: "cover",
    },
    videoContainer: {
      marginTop: "12px",
      width: "100%",
    },
    generatedVideo: {
      width: "100%",
      maxHeight: "400px",
      borderRadius: "8px",
      backgroundColor: "#000",
    },
    videoActions: {
      marginTop: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
    },
    downloadButton: {
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      background: "#10b981",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "background 0.2s",
    },
    videoInfo: {
      display: "flex",
      gap: "12px",
      fontSize: "12px",
      color: isDark ? "#94a3b8" : "#64748b",
    },
    metaInfo: {
      marginTop: "8px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    statusInfo: {
      fontSize: "12px",
      opacity: 0.8,
      fontStyle: "italic",
    },
    modelInfo: {
      fontSize: "11px",
      opacity: 0.7,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      background: isDark ? "#0f172a" : "white",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease"
    },
    imagePreviewContainer: {
      position: "relative",
      display: "inline-block",
      maxWidth: "200px",
    },
    imagePreview: {
      width: "100%",
      maxHeight: "150px",
      borderRadius: "8px",
      objectFit: "cover",
      border: isDark ? "2px solid #3b82f6" : "2px solid #0f172a",
    },
    removeImageBtn: {
      position: "absolute",
      top: "5px",
      right: "5px",
      background: "rgba(0,0,0,0.7)",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      cursor: "pointer",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputContainer: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
    },
    uploadButton: {
      padding: "12px 16px",
      borderRadius: "8px",
      border: isDark ? "2px solid #3b82f6" : "2px solid #0f172a",
      background: isDark ? "#1e293b" : "white",
      color: isDark ? "white" : "#0f172a",
      cursor: "pointer",
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s",
    },
    durationSelect: {
      padding: "12px",
      borderRadius: "8px",
      border: isDark ? "2px solid #3b82f6" : "2px solid #0f172a",
      background: isDark ? "#1e293b" : "white",
      color: isDark ? "white" : "#0f172a",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      minWidth: "90px",
    },
    fileInput: {
      display: "none",
    },
    input: {
      flex: 1,
      padding: "12px",
      borderRadius: "8px",
      border: isDark ? "1px solid #475569" : "1px solid #ccc",
      background: isDark ? "#1e293b" : "white",
      color: isDark ? "white" : "black",
      fontSize: "14px",
    },
    button: {
      padding: "12px 20px",
      borderRadius: "8px",
      border: "none",
      background: isDark ? "#3b82f6" : "#0f172a",
      color: "white",
      cursor: "pointer",
      whiteSpace: "nowrap",
      fontSize: "14px",
      fontWeight: "500",
      transition: "background 0.2s"
    },
    hint: {
      fontSize: "12px",
      color: isDark ? "#94a3b8" : "#64748b",
      textAlign: "center",
    },
  })

  const styles = getStyles(isDarkMode)

  return (
    <>
      {/* Messages */}
      <div style={styles.messages}>
        {chat.messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" 
                ? (isDarkMode ? "#3b82f6" : "#0f172a")
                : (isDarkMode ? "#334155" : "#e2e8f0"),
              color: msg.role === "user" ? "white" : (isDarkMode ? "white" : "black"),
            }}
          >
            {/* User's image if uploaded */}
            {msg.role === "user" && msg.meta_data?.image_url && (
              <img 
                src={msg.meta_data.image_url} 
                alt="Uploaded" 
                style={styles.uploadedImage}
              />
            )}
            
            <div style={styles.messageContent}>{msg.content}</div>
            
            {/* AI's video result */}
            {msg.role === "ai" && msg.meta_data?.video_url && (
              <div style={styles.videoContainer}>
                <video 
                  src={msg.meta_data.video_url} 
                  controls 
                  style={styles.generatedVideo}
                  preload="metadata"
                />
                
                <div style={styles.videoActions}>
                  <button
                    onClick={() => downloadVideo(msg.meta_data.video_url, `video-${msg.id || index}.mp4`)}
                    style={styles.downloadButton}
                  >
                    ⬇️ Download Video
                  </button>
                  
                  <div style={styles.videoInfo}>
                    {msg.meta_data.duration && (
                      <span>⏱️ {msg.meta_data.duration}s</span>
                    )}
                    {msg.meta_data.resolution && (
                      <span>📺 {msg.meta_data.resolution}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Status & Model Info */}
            {msg.role === "ai" && (
              <div style={styles.metaInfo}>
                {msg.meta_data?.status && (
                  <div style={styles.statusInfo}>
                    Status: {msg.meta_data.status}
                  </div>
                )}
                
                {msg.meta_data?.model && (
                  <div style={styles.modelInfo}>
                    🤖 {msg.meta_data.model}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Image Preview */}
        {imagePreview && (
          <div style={styles.imagePreviewContainer}>
            <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
            <button 
              type="button" 
              onClick={removeImage} 
              style={styles.removeImageBtn}
            >
              ✕
            </button>
          </div>
        )}
        
        <div style={styles.inputContainer}>
          {/* Upload Image Button */}
          <label style={styles.uploadButton} title="Upload Image">
            📷
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={styles.fileInput}
            />
          </label>
          
          {/* Duration Selector */}
          <select 
            value={duration} 
            onChange={(e) => setDuration(Number(e.target.value))}
            style={styles.durationSelect}
            title="Video Duration"
          >
            <option value={3}>⏱️ 3s</option>
            <option value={5}>⏱️ 5s</option>
            <option value={10}>⏱️ 10s</option>
            <option value={15}>⏱️ 15s</option>
            <option value={30}>⏱️ 30s</option>
          </select>
          
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedImage 
                ? "Describe the video you want (optional)..." 
                : "Describe the video you want to generate..."
            }
            style={styles.input}
            disabled={uploading}
          />
          
          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: uploading ? 0.6 : 1,
              cursor: uploading ? "not-allowed" : "pointer"
            }}
            disabled={uploading}
          >
            {uploading ? "⏳ Uploading..." : "🎬 Generate Video"}
          </button>
        </div>
        
        <div style={styles.hint}>
          💡 Upload an image or describe your video idea • Choose duration: {duration}s
        </div>
      </form>
    </>
  )
}
