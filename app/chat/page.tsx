"use client"

import React, { useState } from "react"
import WithAuthenticator from "@/components/with-authenticator"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatInterface } from "@/components/chat-interface"

function ChatPage() {
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>()

  const handleConversationSelect = (id: string) => {
    setCurrentConversationId(id)
  }

  const handleNewConversation = () => {
    setCurrentConversationId(undefined)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/chat-bg.png')",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <SidebarProvider defaultOpen={true}>
          <ChatSidebar 
            currentConversationId={currentConversationId}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
          />
          <ChatInterface conversationId={currentConversationId} />
        </SidebarProvider>
      </div>
    </div>
  )
}

export default function AuthenticatedChatPage() {
  return (
    <WithAuthenticator>
      <ChatPage />
    </WithAuthenticator>
  )
}
