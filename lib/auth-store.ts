interface User {
  id: string
  email: string
  name: string
  role: "admin" | "faculty" | "student"
  institutionId?: string
  avatar?: string
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

class AuthStore {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }

  private listeners: Set<() => void> = new Set()

  // Default users for demo
  private defaultUsers: User[] = [
    {
      id: "1",
      email: "admin@lernovate.com",
      name: "System Administrator",
      role: "admin",
      avatar: "/admin-avatar.png",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      email: "faculty@lernovate.com",
      name: "Dr. Sarah Johnson",
      role: "faculty",
      institutionId: "1",
      avatar: "/faculty-avatar.png",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      email: "student@lernovate.com",
      name: "John Smith",
      role: "student",
      institutionId: "1",
      avatar: "/student-avatar.png",
      createdAt: new Date().toISOString(),
    },
  ]

  constructor() {
    // Only run in browser
    if (typeof window !== "undefined") {
      this.initializeUsers()
      this.loadAuthState()
    }
  }

  private initializeUsers() {
    if (typeof window === "undefined") return

    const existingUsers = localStorage.getItem("lernovate_users")
    if (!existingUsers) {
      localStorage.setItem("lernovate_users", JSON.stringify(this.defaultUsers))
    }
  }

  private loadAuthState() {
    if (typeof window === "undefined") return

    const savedUser = localStorage.getItem("lernovate_current_user")
    if (savedUser) {
      this.state.user = JSON.parse(savedUser)
      this.state.isAuthenticated = true
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener())
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getState() {
    return { ...this.state }
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (typeof window === "undefined") {
      return { success: false, error: "localStorage not available on server" }
    }

    this.state.isLoading = true
    this.notify()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem("lernovate_users") || "[]")
    const user = users.find((u: User) => u.email === email)

    if (!user) {
      this.state.isLoading = false
      this.notify()
      return { success: false, error: "User not found" }
    }

    // Simple password validation (in real app, this would be hashed)
    const validPasswords: Record<string, string> = {
      "admin@lernovate.com": "admin123",
      "faculty@lernovate.com": "faculty123",
      "student@lernovate.com": "student123",
    }

    if (validPasswords[email] !== password) {
      this.state.isLoading = false
      this.notify()
      return { success: false, error: "Invalid password" }
    }

    this.state.user = user
    this.state.isAuthenticated = true
    this.state.isLoading = false

    localStorage.setItem("lernovate_current_user", JSON.stringify(user))
    this.notify()

    return { success: true }
  }

  logout() {
    if (typeof window === "undefined") return

    this.state.user = null
    this.state.isAuthenticated = false
    localStorage.removeItem("lernovate_current_user")
    this.notify()
  }

  hasRole(role: string): boolean {
    return this.state.user?.role === role
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.state.user?.role || "")
  }
}

export const authStore = new AuthStore()
export type { User, AuthState }
