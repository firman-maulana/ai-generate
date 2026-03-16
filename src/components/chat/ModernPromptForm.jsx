"use client"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Image as ImageIcon, ArrowUp, Copy, Edit2, Download, Check, Trash2 } from "lucide-react"

export default function ModernPromptForm({ chat, sendPrompt, isDarkMode, isGenerating: isGeneratingProp }) {
  const { data: session } = useSession()
  const [input, setInput] = useState("")
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [isFocused, setIsFocused] = useState(false)
  
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editPromptText, setEditPromptText] = useState("")
  
  // Use prop for generating state
  const isGenerating = isGeneratingProp || false
  
  const messagesEndRef = useRef(null)
  const initialScrollDone = useRef(false)
  
  // Instantly jump to bottom when messages first load, and on each new message
  useEffect(() => {
    if (!messagesEndRef.current) return
    if (!initialScrollDone.current && chat.messages.length > 0) {
      // First load: instant jump, no animation
      messagesEndRef.current.scrollIntoView({ behavior: "instant" })
      initialScrollDone.current = true
    } else if (initialScrollDone.current) {
      // New message added: instant jump
      messagesEndRef.current.scrollIntoView({ behavior: "instant" })
    }
  }, [chat.messages])
  
  // Settings dropwdowns
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [selectedSettings, setSelectedSettings] = useState({})


  // Close dropdowns when clicking outside
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (activeDropdown && !event.target.closest('.settings-dropdown')) {
              setActiveDropdown(null)
          }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeDropdown])

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleEdit = (text, id) => {
    setEditingMessageId(id)
    setEditPromptText(text)
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditPromptText("")
  }

    const handleSendEdit = async (messageId) => {
    if (editPromptText.trim().length < 30 || isGenerating) return
    
    const promptToSend = editPromptText
    setEditingMessageId(null)
    setEditPromptText("")
    
    await sendPrompt(promptToSend, null, messageId)
  }

  // Format date helper
  const formatDateHeader = (dateString) => {
    if (!dateString) return "Today"
    
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0)
    yesterday.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)

    if (date.getTime() === today.getTime()) {
      return "Today"
    } else if (date.getTime() === yesterday.getTime()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  }

  // Group messages by date (maintain order)
  const groupedMessages = chat.messages.reduce((acc, msg) => {
    // Gunakan date dari message
    const dateStr = msg.date ? new Date(msg.date).toDateString() : new Date().toDateString()
    if (!acc[dateStr]) {
      acc[dateStr] = {
        dateHeader: formatDateHeader(msg.date ? msg.date : new Date()),
        messages: [],
        sortKey: msg.date ? new Date(msg.date).getTime() : new Date().getTime()
      }
    }
    acc[dateStr].messages.push(msg)
    return acc
  }, {})

  // Convert to array and sort by date (oldest first)
  const sortedGroupedMessages = Object.entries(groupedMessages).sort((a, b) => {
    return a[1].sortKey - b[1].sortKey
  })

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file && uploadedImages.length < 3) {
      const reader = new FileReader()
      reader.onloadend = (event) => {
        setUploadedImages(prev => [...prev, { file, preview: event.target?.result }])
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    }
  }

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
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

    if (input.trim().length < 30 || isGenerating) return

    setUploading(true)

    try {
      let imageUrl = null
      
      // we only upload the first image to match API spec currently
      if (uploadedImages.length > 0) {
        imageUrl = await uploadImage(uploadedImages[0].file)
      }
      
      // Clear input and images immediately after submit
      const promptText = input
      setInput("")
      setUploadedImages([])
      
      await sendPrompt(promptText, imageUrl)

    } catch (error) {
      console.error("Submit error:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const downloadVideo = async (videoUrl, filename = "generated-video.mp4") => {
    try {
      // Fetch video sebagai blob
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error('Failed to fetch video');
      
      const blob = await response.blob();
      
      // Buat URL dari blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download video. The video may not be available or accessible.');
    }
  }

  const getStyles = (isDark) => ({
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      position: "relative",
      background: isDark ? "#0a0a0a" : "#ffffff"
    },
    messagesArea: {
      flex: 1,
      overflowY: "auto",
      padding: "40px 20px",
      paddingBottom: "160px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "12px"
    },
    messageContainer: {
      width: "100%",
      maxWidth: "1050px",
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    },
    messageWrapper: {
      display: "flex",
      flexDirection: "column"
    },
    userMessageWrapper: {},
    aiMessageWrapper: {},
    message: {
      padding: "12px",
      borderRadius: "13px",
      fontSize: "15px",
      lineHeight: "1.5"
    },
    userMessage: {
      background: isDark ? "#624bfa" : "#0f172a",
      color: "#ffffff"
    },
    aiMessage: {
      background: isDark ? "#1a1a1a" : "#f8fafc",
      color: isDark ? "#ffffff" : "#0f172a",
      border: isDark ? "1px solid #1f1f1f" : "1px solid #e2e8f0"
    },
    uploadedImage: {
      marginBottom: "16px",
      width: "200px",
      height: "200px",
      borderRadius: "12px",
      objectFit: "cover"
    },
    videoContainer: {
      marginTop: "16px",
      overflow: "hidden"
    },
    video: {
      width: "100%",
      maxHeight: "450px",
      background: "#000"
    },
    videoActions: {
      marginTop: "12px",
      display: "flex",
      gap: "12px"
    },
    downloadButton: {
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      background: "#10b981",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }
  })

      const bgMain = isDarkMode ? "#0a0a0a" : "#f8fafc";
    const bgBox = isDarkMode ? "#1a1a1c" : "#ffffff";
    const borderBox = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)";
    const textPrimary = isDarkMode ? "#ffffff" : "#0f172a";
    const textSecondary = isDarkMode ? "#9ca3af" : "#64748b";
    const textPlaceholder = isDarkMode ? "#6b7280" : "#94a3b8";
    const borderDashed = isDarkMode ? "#374151" : "#cbd5e1";
    const borderDashedHover = isDarkMode ? "#6b7280" : "#94a3b8";
    const bgHover = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    const bgButton = isDarkMode ? "#2a2a2d" : "#f1f5f9";
    const iconColor = isDarkMode ? "#9ca3af" : "#64748b";
    const iconColorHover = isDarkMode ? "#6b7280" : "#475569";
    const bgFloating = isDarkMode ? "rgba(26,26,28,0.9)" : "rgba(255,255,255,0.9)";
    const bgScrollButton = isDarkMode ? "rgba(26,26,28,0.9)" : "rgba(255,255,255,0.9)";

  const styles = getStyles(isDarkMode)

  return (
    <div style={styles.container}>
      {/* Messages Area */}
      <div style={styles.messagesArea}>
        <div style={styles.messageContainer}>
          {sortedGroupedMessages.map(([dateStr, group]) => (
            <div key={dateStr} className="flex flex-col gap-3">
              <div className="flex justify-center my-2">
                <span className="px-3 py-1 rounded-md text-xs font-medium" style={{ 
                  background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  color: isDarkMode ? "#94a3b8" : "#64748b" 
                }}>
                  {group.dateHeader}
                </span>
              </div>
            
            {group.messages.map((msg, index) => {
              // Skip loading messages
              if (msg.meta_data?.status === "generating") {
                return null
              }
              
              return (
                <div
                  key={index}
                  className={`group relative flex flex-col ${
                    msg.role === "user" ? "self-end items-end" : "self-start items-start"
                  }`}
                  style={{
                    maxWidth: "min(800px, 92%)"
                  }}
                >
                  {/* Image Outside Bubble */}
                  {msg.role === "user" && msg.meta_data?.image_url && (
                    <img 
                      src={msg.meta_data.image_url} 
                      alt="Uploaded" 
                      style={{ ...styles.uploadedImage, alignSelf: "flex-end", marginBottom: "8px" }}
                    />
                  )}
                  
                  {/* Message Bubble */}
                  <div
                    style={{
                      ...styles.message,
                      ...(msg.role === "user" ? styles.userMessage : styles.aiMessage),
                      position: "relative",
                      wordBreak: "break-word",
                      ...(editingMessageId === (msg.id || index)
                        ? { width: "100%", minWidth: "min(600px, 80vw)" }
                        : { width: "fit-content" })
                    }}
                  >
                    {editingMessageId === (msg.id || index) ? (
                      <div className="flex flex-col gap-2" style={{ width: '100%' }}>
                        <textarea
                          value={editPromptText}
                          onChange={(e) => setEditPromptText(e.target.value)}
                          className="w-full bg-transparent resize-none outline-none text-[15px] font-medium p-2 rounded-lg"
                          style={{ 
                            color: "#ffffff",
                            border: "1px solid rgba(255,255,255,0.2)",
                            background: "rgba(0,0,0,0.2)",
                            minHeight: "80px"
                          }}
                          onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                          }}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-1">
                          <button 
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                            style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff" }}
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSendEdit(msg.id || index)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1"
                            style={{ 
                              background: editPromptText.trim().length >= 30 ? "#10b981" : "rgba(255,255,255,0.1)", 
                              color: editPromptText.trim().length >= 30 ? "#ffffff" : "rgba(255,255,255,0.5)",
                              cursor: editPromptText.trim().length >= 30 ? "pointer" : "not-allowed"
                            }}
                            disabled={editPromptText.trim().length < 30 || isGenerating}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>{msg.content}</div>
                    )}
                    
                    {msg.role === "ai" && msg.meta_data?.video_url && (
                      <div style={styles.videoContainer}>
                        <video 
                          src={msg.meta_data.video_url} 
                          controls 
                          style={styles.video}
                          preload="metadata"
                        />
                        
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => downloadVideo(msg.meta_data.video_url, `video-${msg.id || index}.mp4`)}
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm"
                            style={{ background: isDarkMode ? "#1f1f1f" : "#f1f5f9", color: isDarkMode ? "#e2e8f0" : "#0f172a" }}
                            title="Download Video"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                    
                  </div>

                  {/* Action Buttons — pojok kanan bawah, di luar bubble */}
                  {msg.role === "user" && (
                    <div 
                      className="flex gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ justifyContent: "flex-end" }}
                    >
                      <button 
                        onClick={() => handleCopy(msg.content, msg.id || index)}
                        className="w-10 h-8 flex items-center justify-center rounded-md transition-colors shadow-sm"
                        style={{ background: isDarkMode ? "#1f1f1f" : "#f1f5f9", color: isDarkMode ? "#94a3b8" : "#64748b" }}
                        title="Salin"
                      >
                        {copiedId === (msg.id || index) ? <Check size={11} /> : <Copy size={11} />}
                      </button>
                      {/* Only show Edit if message has real DB id (not temp id like Date.now()) */}
                      {typeof msg.id === 'number' && msg.id < 1e12 && (
                        <button 
                          onClick={() => handleEdit(msg.content, msg.id)}
                          className="w-10 h-8 flex items-center justify-center rounded-md transition-colors shadow-sm"
                          style={{ background: isDarkMode ? "#1f1f1f" : "#f1f5f9", color: isDarkMode ? "#94a3b8" : "#64748b" }}
                          title="Edit"
                        >
                          <Edit2 size={11} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isGenerating && (
          <div className="flex justify-center items-center gap-3 py-6">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ 
                background: 'linear-gradient(135deg, #624bfa 0%, #bd7ffa 100%)',
                animationDelay: '0ms'
              }}></div>
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ 
                background: 'linear-gradient(135deg, #624bfa 0%, #bd7ffa 100%)',
                animationDelay: '150ms'
              }}></div>
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ 
                background: 'linear-gradient(135deg, #624bfa 0%, #bd7ffa 100%)',
                animationDelay: '300ms'
              }}></div>
            </div>
            <span className="text-sm font-medium" style={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}>
              Generating video...
            </span>
          </div>
        )}
        {/* Sentinel for auto-scroll */}
        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area (Explore style) */}
      <div 
        className="absolute bottom-0 left-0 w-full flex justify-center pb-3 pt-4 px-4 transition-all duration-300 z-[100] bg-gradient-to-t from-white/80 dark:from-[#0a0a0a]/80 to-transparent"
        style={{ pointerEvents: "none" }}
      >
        <div 
          className="relative transition-all duration-300" 
          style={{ width: isFocused || input.trim().length > 0 || uploadedImages.length > 0 ? "800px" : "650px", pointerEvents: "auto" }}
        >
          
          <div className="flex flex-col gap-3 p-3 rounded-2xl shadow-2xl transition-all border"
            style={{ 
              background: isDarkMode ? "rgba(26,26,28,0.9)" : "rgba(255,255,255,0.9)",
              borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)",
              backdropFilter: "blur(12px)"
            }}>
              
            <form 
              onSubmit={handleSubmit}
              className="flex items-center gap-3"
            >
              <div className="flex gap-1 items-center rounded-xl p-1 shrink-0" style={{ background: isDarkMode ? "#2a2a2d" : "#f1f5f9" }}>
                {uploadedImages.length < 3 && (
                  <label 
                    className="w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer border border-dashed transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    title="Upload Image"
                    style={{ 
                      background: isDarkMode ? "#2a2a2d" : "#f1f5f9", 
                      borderColor: isDarkMode ? "#374151" : "#cbd5e1",
                      color: isDarkMode ? "#9ca3af" : "#64748b" 
                    }}
                  >
                    <ImageIcon size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
                
                {uploadedImages.map((imgObj, index) => (
                  <div 
                    key={index}
                    className="relative shrink-0 group cursor-pointer"
                    onClick={() => removeImage(index)}
                  >
                    <img 
                      src={imgObj.preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-10 h-10 rounded-lg object-cover transition-all"
                      style={{ border: `2px solid ${borderBox}` }}
                    />
                    <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Trash2 size={16} style={{ color: '#ef4444' }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-1 bg-transparent text-[15px] font-medium outline-none px-2"
                placeholder={uploadedImages.length > 0 ? "Describe how to animate this..." : "Describe the video you're imagining"}
                style={{ color: isDarkMode ? "#ffffff" : "#0f172a", caretColor: isDarkMode ? "#ffffff" : "#0f172a" }}
                disabled={uploading}
              />
              
              <button 
                type="submit" 
                className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors shadow-sm"
                style={{ 
                  background: (input.trim().length >= 30 && !isGenerating)
                    ? 'linear-gradient(135deg, #624bfa 0%, #bd7ffa 100%)'
                    : (isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"), 
                  color: (input.trim().length >= 30 && !isGenerating) ? '#ffffff' : (isDarkMode ? "#9ca3af" : "#64748b"),
                  opacity: (uploading || isGenerating) ? 0.6 : 1,
                  cursor: (input.trim().length >= 30 && !uploading && !isGenerating) ? "pointer" : "not-allowed"
                }}
                disabled={uploading || isGenerating || input.trim().length < 30}
              >
                <ArrowUp size={18} />
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
