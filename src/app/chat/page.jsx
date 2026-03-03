import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import ChatLayout from "@/components/chat/ChatLayout"

export default async function ChatPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/signin")
  }

  return <ChatLayout />
}