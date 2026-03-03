"use client"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Sidebar({
  chats,
  activeChatId,
  setActiveChatId,
  createNewChat
}) {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return (
    <div style={styles.sidebar}>
      <div style={styles.menu}>
        <button style={styles.newChatBtn} onClick={createNewChat}>
          + New Chat
        </button>

        <div style={styles.chatList}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              style={{
                ...styles.chatItem,
                background:
                  chat.id === activeChatId
                    ? "rgba(255,255,255,0.1)"
                    : "transparent"
              }}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.footer}>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <svg 
            style={styles.logoutIcon} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          Logout
        </button>
        <p style={{ fontSize: "12px", opacity: 0.6, marginTop: "10px" }}>
          Nex AI v1.0
        </p>
      </div>
    </div>
  )
}

const styles = {
  sidebar: {
    width: "260px",
    background: "#0f172a",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  newChatBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "white",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: "600"
  },
  chatList: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  chatItem: {
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px"
  },
  footer: {
    display: "flex",
    flexDirection: "column"
  },
  logoutBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease"
  },
  logoutIcon: {
    width: "20px",
    height: "20px"
  }
}