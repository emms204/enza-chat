"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, FileText, ExternalLink } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  sources?: Array<{
    title: string
    url: string
    excerpt: string
  }>
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your document assistant. I can help you find information from your uploaded documents and provide sources for my answers. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response with sources
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Based on your question about "${input}", I found relevant information in your documents. The key points are:

1. This topic is covered extensively in the policy documentation
2. There are specific guidelines that apply to this scenario
3. Recent updates have been made to the procedures

Would you like me to elaborate on any of these points?`,
        sources: [
          {
            title: "Company Policy Manual v2.3",
            url: "#",
            excerpt: "Section 4.2 covers the specific procedures and guidelines...",
          },
          {
            title: "Updated Guidelines Document",
            url: "#",
            excerpt: "Recent changes to the policy include new requirements...",
          },
          {
            title: "FAQ Document",
            url: "#",
            excerpt: "Common questions and answers related to this topic...",
          },
        ],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <SidebarInset className="bg-transparent">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <h1 className="text-lg font-semibold text-white">Document Q&A Assistant</h1>
          </div>
          <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30">
            Online
          </Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-[80%] p-4 ${
                  message.type === "user"
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-white/90 backdrop-blur-sm border-white/20"
                }`}
              >
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {message.sources && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-gray-600">Sources:</p>
                      {message.sources.map((source, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-3 w-3 text-gray-500" />
                                <span className="text-xs font-medium text-gray-700">{source.title}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{source.excerpt}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </Card>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-4 bg-white/90 backdrop-blur-sm border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">Searching documents...</span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white/10 backdrop-blur-md border-t border-white/20">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="flex-1 bg-white/90 backdrop-blur-sm border-white/30 focus:border-emerald-500 focus:ring-emerald-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </SidebarInset>
  )
}
