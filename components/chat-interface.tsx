"use client"

import React, { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText, ExternalLink, AlertCircle } from "lucide-react"
import { AIConversation } from '@aws-amplify/ui-react-ai'
import { useAIConversation } from '../lib/client'
import UploadDialog from "./upload-dialog"
import { SendMesageParameters } from '@aws-amplify/ui-react-ai'

// Type definitions
interface Source {
  content: string;
  metadata: Record<string, unknown>;
  location: LocationType;
  score: number;
}

interface LocationType {
  s3Location?: string | { uri: string };
  uri?: string;
}

// Custom source display component
const SourceCard = ({ sources }: { sources: Source[] }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Sources:</p>
      {sources.map((source: Source, index: number) => {
        // Safe function to extract location text
        const getLocationText = (location: LocationType): string => {
          if (typeof location === 'string') {
            return location;
          }
          
          if (typeof location === 'object' && location !== null) {
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
  );
};

interface ChatInterfaceProps {
  conversationId?: string
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Add logging function
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    setLogs(prev => [...prev.slice(-19), logEntry]); // Keep last 20 logs
  };

  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat', conversationId ? { id: conversationId } : undefined);

  return (
    <SidebarInset className="bg-transparent">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <h1 className="text-lg font-semibold text-white">
              AI Document Assistant {conversationId ? `(${conversationId.slice(-4)})` : '(New Chat)'}
            </h1>
          </div>
          {/* Log Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLogs(prev => prev.length > 0 ? [] : ['Logs enabled'])}
            className="text-white hover:bg-white/20"
          >
            {logs.length > 0 ? 'Hide Logs' : 'Show Logs'}
          </Button>
        </div>

        {/* Logs Display */}
        {logs.length > 0 && (
          <div className="mx-4 mt-4 p-4 bg-gray-900/90 border border-gray-600 rounded-lg max-h-40 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-300">Request Logs</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLogs([])}
                className="text-gray-400 hover:text-gray-200 h-6 px-2"
              >
                Clear
              </Button>
            </div>
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-xs text-gray-400 font-mono">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="text-red-700 hover:bg-red-200"
            >
              ×
            </Button>
          </div>
        )}

        {/* AI Conversation Component */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <AIConversation
              messages={messages}
              isLoading={isLoading}
              handleSendMessage={handleSendMessage}
              welcomeMessage={
                <Card className="bg-white/90 backdrop-blur-sm border-white/20 p-4">
                  <p className="text-sm text-gray-700">
                    Hello! I'm your AI document assistant. I can help you find information from your uploaded documents and provide sources for my answers. What would you like to know?
                  </p>
                </Card>
              }
              messageRenderer={{
                text: ({ text }: { text: string }) => (
                  <div className="space-y-2">
                    <p className="text-sm leading-relaxed">{text}</p>
                  </div>
                ),
              }}
              avatars={{
                user: {
                  username: "You",
                },
                ai: {
                  username: "AI Assistant"
                }
              }}
              aiContext={() => ({
                error: error,
                logs: logs,
                conversationId: conversationId
              })}
            />
          </div>
        </div>

        {/* Upload Button - positioned over the input */}
        <div className="absolute bottom-4 left-4 z-10">
          <Button variant="outline" size="icon" onClick={() => setShowAddModal(true)} className="bg-white/90 backdrop-blur-sm">
            <Upload className="h-4 w-4" />
          </Button>
        </div>

        {/* Upload Dialog */}
        <UploadDialog
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      </div>
    </SidebarInset>
  );
}
