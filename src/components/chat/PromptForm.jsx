"use client"
import { useState } from "react"

export default function PromptForm({ chat, sendPrompt }) {
  const [input, setInput] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input.trim()) return

    await sendPrompt(input)
    setInput("")
  }

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
              background:
                msg.role === "user" ? "#0f172a" : "#e2e8f0",
              color: msg.role === "user" ? "white" : "black",
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Kirim
        </button>
      </form>
    </>
  )
}

const styles = {
  messages: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "12px",
    maxWidth: "70%",
  },
  form: {
    display: "flex",
    gap: "12px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
  },
}