"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, FileText, ExternalLink, Upload } from "lucide-react"
import UploadDialog from "./upload-dialog"
import queryKnowledgeBase from "@/services/chat_service"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  sources?: Array<{
    content: string;
    metadata: any;
    location: any;
    score: number;
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
  const [showAddModal, setShowAddModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleUpload = () => {
    setShowAddModal(true)
  }

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

    try {
      const response = await queryKnowledgeBase(input)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      
      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please check the console for more details.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
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
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-[80%] p-4 ${
                  message.type === "user"
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-white/90 text-gray-900 dark:bg-gray-800 dark:text-gray-100 backdrop-blur-sm border-white/20 dark:border-gray-700"
                }`}
              >
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {message.sources && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Sources:</p>
                      {message.sources.map((source, index) => {
                        // Debug: Log the source structure to understand the object format
                        console.log('Source object:', source);
                        console.log('Source location:', source.location);
                        
                        // Safe function to extract location text
                        const getLocationText = (location: any): string => {
                          if (typeof location === 'string') {
                            return location;
                          }
                          
                          if (typeof location === 'object' && location !== null) {
                            // Handle different possible object structures
                            if (location.s3Location) {
                              if (typeof location.s3Location === 'string') {
                                return location.s3Location;
                              }
                              if (typeof location.s3Location === 'object' && location.s3Location.uri) {
                                return location.s3Location.uri;
                              }
                            }
                            
                            if (location.uri) {
                              return location.uri;
                            }
                            
                            // If we can't extract a specific field, convert the whole object to string
                            return JSON.stringify(location);
                          }
                          
                          return 'Unknown Source';
                        };
                        
                        return (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                            <div className="space-y-3">
                              {/* Content Text */}
                              <div>
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Content:</p>
                                <p className="text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-2 rounded border">
                                  {source.content || 'No content available'}
                                </p>
                              </div>
                              
                              {/* Metadata */}
                              {source.metadata && Object.keys(source.metadata).length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Metadata:</p>
                                  <div className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded border">
                                    {Object.entries(source.metadata).map(([key, value]) => (
                                      <div key={key} className="flex justify-between py-1">
                                        <span className="font-medium">{key}:</span>
                                        <span className="ml-2">{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Source info at bottom */}
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {getLocationText(source.location)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Score: {source.score?.toFixed(3)}
                                  </span>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
            <Button variant="outline" size="icon" type="button" onClick={handleUpload}>
              <Upload className="h-4 w-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="flex-1 bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm border-white/30 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
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
        <UploadDialog showAddModal={showAddModal} setShowAddModal={setShowAddModal} />
      </div>
    </SidebarInset>
  )
}
