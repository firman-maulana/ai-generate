"use client"
import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import PromptForm from "./PromptForm"

export default function ChatLayout() {
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)

  // ✅ Load chats saat pertama kali render (biar tidak hilang saat refresh)
  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch("http://localhost:8000/chats")
      const data = await res.json()

      // format supaya ada messages array
      const formatted = data.map(chat => ({
        ...chat,
        messages: []
      }))

      setChats(formatted)
    }

    fetchChats()
  }, [])

  // ✅ Load messages saat chat dipilih
  useEffect(() => {
    if (!activeChatId) return

    const fetchMessages = async () => {
      const res = await fetch(
        `http://localhost:8000/messages/${activeChatId}`
      )
      const messages = await res.json()

      updateChatMessages(activeChatId, messages)
    }

    fetchMessages()
  }, [activeChatId])

  // ✅ Create chat (ambil ID dari backend)
  const createNewChat = async () => {
    const res = await fetch("http://localhost:8000/create-chat", {
      method: "POST",
    })

    const data = await res.json()

    const newChat = {
      id: data.chat_id,
      title: "New Chat",
      messages: [],
    }

    setChats(prev => [newChat, ...prev])
    setActiveChatId(data.chat_id)

    return data.chat_id
  }

  // ✅ Send prompt (FIX 422 di sini)
  const sendPrompt = async (inputValue) => {
    let chatId = activeChatId

    // kalau belum ada chat → buat dulu
    if (!chatId) {
      chatId = await createNewChat()
    }

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputValue,
          chat_id: Number(chatId), // pastikan number
        }),
      })

      if (!res.ok) {
        console.error("Generate error:", res.status)
        return
      }

      // ambil ulang messages
      const messagesRes = await fetch(
        `http://localhost:8000/messages/${chatId}`
      )
      const messages = await messagesRes.json()

      updateChatMessages(chatId, messages)

    } catch (err) {
      console.error("ERROR:", err)
    }
  }

  const updateChatMessages = (chatId, messages) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages,
              title:
                chat.messages.length === 0 && messages.length > 0
                  ? messages[0].content.slice(0, 25) + "..."
                  : chat.title,
            }
          : chat
      )
    )
  }

  const activeChat = chats.find(c => c.id === activeChatId)

  return (
    <div style={styles.container}>
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createNewChat={createNewChat}
      />

      <div style={styles.main}>
        {activeChat ? (
          <PromptForm
            chat={activeChat}
            sendPrompt={sendPrompt}
          />
        ) : (
          <div style={styles.emptyState}>
            <button onClick={createNewChat} style={styles.startButton}>
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#f8fafc",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "40px",
  },
  emptyState: {
    margin: "auto",
  },
  startButton: {
    padding: "16px 24px",
    borderRadius: "12px",
    border: "none",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
  },
}