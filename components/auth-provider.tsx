"use client"

import { Amplify } from "aws-amplify"
import { Authenticator } from "@aws-amplify/ui-react"
import outputs from "@/amplify_outputs.json"
import "@aws-amplify/ui-react/styles.css"

Amplify.configure(outputs, { ssr: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>
} 