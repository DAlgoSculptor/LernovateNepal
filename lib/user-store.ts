interface User {
  id: string
  name: string
  email: string
  role: "admin" | "faculty" | "student"
  institutionId?: string
  phone?: string
  avatar?: string
  status: "active" | "inactive" | "suspended"
  createdAt: string
  lastLogin?: string
}

class UserStore {
  private defaultUsers: User[] = [
    {
      id: "1",
      name: "System Administrator",
      email: "admin@lernovate.com",
      role: "admin",
      phone: "9800000001",
      avatar: "/admin-avatar.png",
      status: "active",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Dr. Sarah Johnson",
      email: "faculty@lernovate.com",
      role: "faculty",
      institutionId: "1",
      phone: "9800000002",
      avatar: "/faculty-avatar.png",
      status: "active",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      lastLogin: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      name: "John Smith",
      email: "student@lernovate.com",
      role: "student",
      institutionId: "1",
      phone: "9800000003",
      avatar: "/student-avatar.png",
      status: "active",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      lastLogin: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "4",
      name: "Prof. Michael Chen",
      email: "michael.chen@lernovate.com",
      role: "faculty",
      institutionId: "2",
      phone: "9800000004",
      avatar: "/faculty-avatar.png",
      status: "active",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      lastLogin: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "5",
      name: "Emma Wilson",
      email: "emma.wilson@lernovate.com",
      role: "student",
      institutionId: "1",
      phone: "9800000005",
      avatar: "/student-avatar.png",
      status: "active",
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      lastLogin: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: "6",
      name: "David Brown",
      email: "david.brown@lernovate.com",
      role: "student",
      institutionId: "2",
      phone: "9800000006",
      avatar: "/student-avatar.png",
      status: "suspended",
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      lastLogin: new Date(Date.now() - 172800000).toISOString(),
    },
  ]

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeUsers()
    }
  }

  private initializeUsers() {
    if (typeof window !== "undefined" && window.localStorage) {
      const existingUsers = localStorage.getItem("lernovate_all_users")
      if (!existingUsers) {
        localStorage.setItem("lernovate_all_users", JSON.stringify(this.defaultUsers))
      }
    }
  }

  async getUsers(): Promise<{ success: boolean; data?: User[]; error?: string }> {
    try {
      if (typeof window === "undefined") {
        return { success: true, data: this.defaultUsers }
      }
      const users = JSON.parse(localStorage.getItem("lernovate_all_users") || JSON.stringify(this.defaultUsers))
      return { success: true, data: users }
    } catch (error) {
      return { success: false, error: "Failed to load users" }
    }
  }

  async createUser(
    userData: Omit<User, "id" | "createdAt">,
  ): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      if (typeof window === "undefined") {
        return { success: false, error: "Cannot create user on server-side" }
      }

      const users = JSON.parse(localStorage.getItem("lernovate_all_users") || JSON.stringify(this.defaultUsers))

      // Check if email already exists
      if (users.some((user: User) => user.email === userData.email)) {
        return { success: false, error: "Email already exists" }
      }

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }

      users.unshift(newUser)
      localStorage.setItem("lernovate_all_users", JSON.stringify(users))

      return { success: true, data: newUser }
    } catch (error) {
      return { success: false, error: "Failed to create user" }
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      if (typeof window === "undefined") {
        return { success: false, error: "Cannot update user on server-side" }
      }

      const users = JSON.parse(localStorage.getItem("lernovate_all_users") || JSON.stringify(this.defaultUsers))
      const userIndex = users.findIndex((user: User) => user.id === id)

      if (userIndex === -1) {
        return { success: false, error: "User not found" }
      }

      // Check if email already exists (excluding current user)
      if (
        userData.email &&
        users.some((user: User, index: number) => user.email === userData.email && index !== userIndex)
      ) {
        return { success: false, error: "Email already exists" }
      }

      users[userIndex] = { ...users[userIndex], ...userData }
      localStorage.setItem("lernovate_all_users", JSON.stringify(users))

      return { success: true, data: users[userIndex] }
    } catch (error) {
      return { success: false, error: "Failed to update user" }
    }
  }

  async deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window === "undefined") {
        return { success: false, error: "Cannot delete user on server-side" }
      }

      const users = JSON.parse(localStorage.getItem("lernovate_all_users") || JSON.stringify(this.defaultUsers))
      const filteredUsers = users.filter((user: User) => user.id !== id)

      if (users.length === filteredUsers.length) {
        return { success: false, error: "User not found" }
      }

      localStorage.setItem("lernovate_all_users", JSON.stringify(filteredUsers))
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete user" }
    }
  }

  async getUsersByRole(role: string): Promise<{ success: boolean; data?: User[]; error?: string }> {
    try {
      const users =
        typeof window === "undefined"
          ? this.defaultUsers
          : JSON.parse(localStorage.getItem("lernovate_all_users") || JSON.stringify(this.defaultUsers))

      const filteredUsers = users.filter((user: User) => user.role === role)
      return { success: true, data: filteredUsers }
    } catch (error) {
      return { success: false, error: "Failed to load users" }
    }
  }

  async getUsersByInstitution(institutionId: string): Promise<{ success: boolean; data?: User[]; error?: string }> {
    try {
      const users =
        typeof window === "undefined"
          ? this.defaultUsers
          : JSON.parse(localStorage.getItem("lernovate_all_users") || JSON.stringify(this.defaultUsers))

      const filteredUsers = users.filter((user: User) => user.institutionId === institutionId)
      return { success: true, data: filteredUsers }
    } catch (error) {
      return { success: false, error: "Failed to load users" }
    }
  }
}

export const userStore = new UserStore()
export type { User }
