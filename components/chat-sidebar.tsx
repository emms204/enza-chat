"use client"

import React, { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageCircle, Calendar, LogOut, Moon, Sun, History } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuthenticator } from "@aws-amplify/ui-react"
import { client } from "@/lib/client"

interface Conversation {
  id: string
  name?: string
  createdAt: string
  updatedAt: string
  metadata?: Record<string, unknown>
}

interface ChatSidebarProps {
  currentConversationId?: string
  onConversationSelect?: (id: string) => void
  onNewConversation?: () => void
}

export function ChatSidebar({ 
  currentConversationId, 
  onConversationSelect, 
  onNewConversation 
}: ChatSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const { signOut } = useAuthenticator()

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setIsLoading(true)
      const { data: conversationsList } = await client.conversations.chat.list()
      setConversations(conversationsList || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConversation = () => {
    onNewConversation?.()
  }

  const handleConversationSelect = (id: string) => {
    onConversationSelect?.(id)
  }

  const handleLogout = () => {
    signOut()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Sidebar className="bg-gray-100/60 dark:bg-white/10 backdrop-blur-md border-r border-gray-900/10 dark:border-white/20">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              enza
              <span className="text-emerald-400 ml-1">✚</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-gray-900 dark:text-white hover:bg-gray-900/10 dark:hover:bg-white/20"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <Button 
          onClick={handleNewConversation} 
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarSeparator className="bg-gray-900/10 dark:bg-white/20" />

      <SidebarContent className="p-2">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-2 px-2">Recent Chats</h3>
          
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-900/10 dark:bg-white/10 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <Card className="bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border-gray-900/20 dark:border-white/20 p-4">
              <div className="text-center text-gray-800 dark:text-white/70">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start chatting to see your history</p>
              </div>
            </Card>
          ) : (
            <SidebarMenu>
              {conversations.map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton
                    onClick={() => handleConversationSelect(conversation.id)}
                    className={`w-full p-3 rounded-lg transition-colors ${
                      currentConversationId === conversation.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:hover:bg-white/20 text-gray-800 dark:text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {conversation.name || `Chat ${conversation.id.slice(-4)}`}
                          </p>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {formatDate(conversation.updatedAt)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-3 w-3 opacity-70" />
                          <span className="text-xs opacity-70">
                            {new Date(conversation.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-2 px-2">History</h3>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-gray-800 dark:text-white/95 hover:bg-gray-900/10 dark:hover:bg-white/20">
                <History className="h-4 w-4 mr-2" />
                View All Conversations
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarSeparator className="bg-gray-900/10 dark:bg-white/20" />

      <SidebarFooter className="p-4">
        <Card className="bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border-gray-900/20 dark:border-white/20 p-3 mb-4">
          <div className="text-center text-gray-800 dark:text-white/70">
            <p className="text-xs">
              Powered by Amplify AI Kit
            </p>
            <p className="text-xs mt-1">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </Card>
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-gray-800 dark:text-white hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
