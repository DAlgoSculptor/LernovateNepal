"use client"

import { useState, useEffect } from "react"
import { authStore, type AuthState } from "@/lib/auth-store"

export function useAuth() {
  const [state, setState] = useState<AuthState>(authStore.getState())

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setState(authStore.getState())
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    return await authStore.login(email, password)
  }

  const logout = () => {
    authStore.logout()
  }

  const hasRole = (role: string) => {
    return authStore.hasRole(role)
  }

  const hasAnyRole = (roles: string[]) => {
    return authStore.hasAnyRole(roles)
  }

  return {
    ...state,
    login,
    logout,
    hasRole,
    hasAnyRole,
  }
}
