"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Sidebar from "./Sidebar"
import ModernPromptForm from "./ModernPromptForm"
import { useApp } from "@/contexts/AppContext"

export default function ChatLayout() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState([])
  const { isDarkMode, toggleTheme, isGenerating, startGenerating, stopGenerating } = useApp()

  // ✅ Check for pending prompt from Explore page
  useEffect(() => {
    if (!session?.user?.email) return

    const pendingPrompt = localStorage.getItem('pendingPrompt')
    const hasImages = localStorage.getItem('pendingImagesFlag')
    
    if (pendingPrompt) {
      localStorage.removeItem('pendingPrompt')
      localStorage.removeItem('pendingImagesFlag')
      localStorage.removeItem('pendingRatio')
      localStorage.removeItem('pendingResolution')
      
      let imagesToUpload = []
      if (hasImages === 'true') {
        try {
          const pendingImagesStr = sessionStorage.getItem('pendingImages')
          if (pendingImagesStr) {
            imagesToUpload = JSON.parse(pendingImagesStr)
            sessionStorage.removeItem('pendingImages')
          }
        } catch (e) {
          console.error('Failed to parse pending images:', e)
        }
      }
      
      // Wait slightly to ensure messages are loaded first before optimistic update
      setTimeout(() => {
        sendPrompt(pendingPrompt, null, null, imagesToUpload)
      }, 500)
    }
  }, [session])

  // ✅ Load messages saat user tersedia
  useEffect(() => {
    if (!session?.user?.email) return

    const fetchMessages = async () => {
      const res = await fetch(`http://localhost:8000/messages`, {
        headers: {
          'X-User-Email': session.user.email
        }
      })
      const data = await res.json()
      // Urutkan dari yang terlama ke terbaru (ascending)
      const sortedMessages = data.sort((a, b) => {
        const dateA = new Date(a.date || new Date())
        const dateB = new Date(b.date || new Date())
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB // Sort by date ascending
        }
        return a.id - b.id // Then by id ascending
      })
      setMessages(sortedMessages)
    }

    fetchMessages()
  }, [session])

  // ✅ Send prompt
  const sendPrompt = async (inputValue, imageUrl = null, editMessageId = null, imageUrls = []) => {
    if (!session?.user?.email) {
      console.error("User email not available")
      return
    }

    startGenerating()

    try {
      // Gunakan imageUrls jika ada (multiple images), fallback ke imageUrl (single)
      let finalImageUrls = []
      
      if (imageUrls && imageUrls.length > 0) {
        finalImageUrls = imageUrls
      } else if (imageUrl) {
        finalImageUrls = [imageUrl]
      }
      
      const payload = {
        prompt: inputValue,
        motion_strength: 0.7
      }
      
      if (editMessageId) {
        payload.edit_message_id = editMessageId
      }
      
      // Tambahkan image_url (untuk backward compatibility) dan image_urls (untuk multiple)
      if (finalImageUrls.length > 0) {
        payload.image_url = finalImageUrls[0] // Foto pertama sebagai primary
        payload.image_urls = finalImageUrls // Semua foto
      }
      
      console.log("📤 Sending payload:", payload)

      if (editMessageId) {
        // Optimistic update for edit in-place
        setMessages(prev => {
          let aiUpdated = false;
          return prev.map(msg => {
            // Update user message content
            if (msg.id === editMessageId && msg.role === "user") {
              return { ...msg, content: inputValue };
            }
            // Set first subsequent AI message to generating
            if (!aiUpdated && msg.role === "ai" && msg.id > editMessageId) {
              aiUpdated = true;
              return { ...msg, meta_data: { status: "generating" }, content: "Generating video..." };
            }
            return msg;
          });
        });
      } else {
        // Tambahkan user message dulu beserta AI placeholder (optimistic update)
        const newId = Date.now()
        const userMsg = {
          id: newId, // Temporary ID
          role: "user",
          content: inputValue,
          meta_data: finalImageUrls.length > 0 ? { 
            image_url: finalImageUrls[0], // Backward compatibility
            image_urls: finalImageUrls // Multiple images
          } : null,
          date: new Date().toISOString().split('T')[0]
        }
        
        const aiMsg = {
          id: newId + 1,
          role: "ai",
          content: "Generating video...",
          meta_data: { status: "generating" },
          date: new Date().toISOString().split('T')[0]
        }
        
        setMessages(prev => [...prev, userMsg, aiMsg])
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 480000) // 8 menit timeout (lebih dari backend 4 menit)

      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": session.user.email
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        let errorMsg = "Failed to generate response";
        try {
          const error = await res.json();
          errorMsg = error.detail || errorMsg;
          console.error("Generate error structure:", error);
        } catch (parseErr) {
          console.error("Generate error parse failed:", parseErr);
        }
        alert(errorMsg);
        stopGenerating()
        return;
      }

      const data = await res.json()
      console.log("✅ Generate response:", data)
      console.log("📹 Video URL:", data.video_url)

      // PENTING: Ambil ulang messages dari server untuk memastikan AI response muncul
      const messagesRes = await fetch(
        `http://localhost:8000/messages`,
        {
          headers: {
            "X-User-Email": session.user.email
          }
        }
      )
      
      if (!messagesRes.ok) {
        console.error("Failed to fetch messages after generate")
        stopGenerating()
        return
      }
      
      const updatedMessages = await messagesRes.json()
      
      // Urutkan dari yang terlama ke terbaru (ascending)
      const sortedMessages = updatedMessages.sort((a, b) => {
        const dateA = new Date(a.date || new Date())
        const dateB = new Date(b.date || new Date())
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB // Sort by date ascending
        }
        return a.id - b.id // Then by id ascending
      })
      
      console.log("📨 Fetched messages after generate:", sortedMessages.length)
      console.log("📨 Last message:", sortedMessages[sortedMessages.length - 1])
      
      setMessages(sortedMessages)

    } catch (err) {
      console.error("ERROR:", err)
      
      if (err.name === 'AbortError') {
        alert("Request timeout. Video generation is taking too long. Please try again with a shorter duration.")
      } else {
        alert(err.message || "Failed to fetch. Make sure backend is running on port 8000.")
      }
    } finally {
      stopGenerating()
    }
  }

  const toggleThemeHandler = () => {
    toggleTheme()
  }

  const getStyles = (isDark) => ({
    container: {
      display: "flex",
      height: "100vh",
      background: isDark ? "#1e293b" : "#f8fafc",
      overflow: "hidden",
      transition: "background 0.3s ease"
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: isDark ? "#0a0a0a" : "#ffffff",
      overflow: "hidden",
      transition: "background 0.3s ease"
    },
    loading: {
      margin: "auto",
      fontSize: "18px",
      color: isDark ? "#94a3b8" : "#64748b",
    }
  })

  const styles = getStyles(isDarkMode)

  if (!session?.user?.email) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <Sidebar
        isDarkMode={isDarkMode}
        toggleTheme={toggleThemeHandler}
      />

      <div style={styles.main}>
        <ModernPromptForm
          chat={{ messages }}
          sendPrompt={sendPrompt}
          isDarkMode={isDarkMode}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  )
}