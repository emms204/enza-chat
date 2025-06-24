"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, History, LogOut, Moon, Sun, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuthenticator } from "@aws-amplify/ui-react"

interface Chat {
  id: string
  title: string
  timestamp: string
}

export function ChatSidebar() {
  const [chats, setChats] = useState<Chat[]>([
  ])
  const [activeChat, setActiveChat] = useState("1")
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { signOut } = useAuthenticator()

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: "Just now",
    }
    setChats([newChat, ...chats])
    setActiveChat(newChat.id)
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChats(chats.filter((chat) => chat.id !== chatId))
    if (activeChat === chatId && chats.length > 1) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId)
      setActiveChat(remainingChats[0]?.id || "")
    }
  }

  const handleLogout = () => {
    signOut()
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

        <Button onClick={handleNewChat} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarSeparator className="bg-gray-900/10 dark:bg-white/20" />

      <SidebarContent className="p-2">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-2 px-2">Recent Chats</h3>
          <SidebarMenu>
            {chats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  isActive={activeChat === chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className="w-full justify-start text-gray-800 dark:text-white/95 hover:bg-gray-900/10 dark:hover:bg-white/20 data-[active=true]:bg-emerald-600/70 data-[active=true]:text-white group"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{chat.title}</div>
                    <div className="text-xs text-gray-600 dark:text-white/75">{chat.timestamp}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 text-gray-500 dark:text-white/50 hover:text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
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
