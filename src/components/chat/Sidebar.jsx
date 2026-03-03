export default function Sidebar({
  chats,
  activeChatId,
  setActiveChatId,
  createNewChat
}) {
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
        <p style={{ fontSize: "12px", opacity: 0.6 }}>
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
  footer: {}
}