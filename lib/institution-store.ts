interface Institution {
  id: string
  name: string
  email: string
  phone?: string
  website?: string
  address: string
  logoUrl?: string
  createdAt: string
}

class InstitutionStore {
  private institutions: Institution[] = []
  private storageKey = "lernovate-institutions"

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        this.institutions = JSON.parse(stored)
      } else {
        // Initialize with mock data
        this.institutions = [
          {
            id: "1",
            name: "Kathmandu Public School",
            email: "admin@kps.edu.np",
            phone: "9800000000",
            website: "https://kps.edu.np",
            address: "Bagbazar, Kathmandu",
            logoUrl: "/generic-school-logo.png",
            createdAt: "2025-01-15T10:00:00.000Z",
          },
          {
            id: "2",
            name: "Pokhara Valley College",
            email: "info@pvc.edu.np",
            phone: "9856789012",
            website: "https://pvc.edu.np",
            address: "Lakeside, Pokhara",
            logoUrl: "/generic-college-logo.png",
            createdAt: "2025-01-10T14:30:00.000Z",
          },
          {
            id: "3",
            name: "Chitwan International Academy",
            email: "contact@cia.edu.np",
            phone: "9845123456",
            website: "https://cia.edu.np",
            address: "Bharatpur, Chitwan",
            logoUrl: "/generic-academy-logo.png",
            createdAt: "2025-01-08T09:15:00.000Z",
          },
        ]
        this.saveToStorage()
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(this.institutions))
    }
  }

  getAll(): Institution[] {
    return [...this.institutions]
  }

  getById(id: string): Institution | undefined {
    return this.institutions.find((inst) => inst.id === id)
  }

  create(data: Omit<Institution, "id" | "createdAt">): Institution {
    const newInstitution: Institution = {
      ...data,
      id: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    this.institutions.unshift(newInstitution)
    this.saveToStorage()
    return newInstitution
  }

  update(id: string, data: Partial<Omit<Institution, "id" | "createdAt">>): Institution | null {
    const index = this.institutions.findIndex((inst) => inst.id === id)
    if (index === -1) return null

    this.institutions[index] = { ...this.institutions[index], ...data }
    this.saveToStorage()
    return this.institutions[index]
  }

  delete(id: string): boolean {
    const index = this.institutions.findIndex((inst) => inst.id === id)
    if (index === -1) return false

    this.institutions.splice(index, 1)
    this.saveToStorage()
    return true
  }

  emailExists(email: string, excludeId?: string): boolean {
    return this.institutions.some((inst) => inst.email.toLowerCase() === email.toLowerCase() && inst.id !== excludeId)
  }
}

export const institutionStore = new InstitutionStore()
export type { Institution }
