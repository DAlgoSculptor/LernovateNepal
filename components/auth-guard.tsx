"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/login-form"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
