"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Building2,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Loader2,
  LogOut,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Institution } from "@/lib/institution-store"
import { InstitutionViewDialog } from "@/components/institution-view-dialog"
import { InstitutionEditDialog } from "@/components/institution-edit-dialog"
import { NavigationPages } from "@/components/navigation-pages"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { StudentDashboard } from "@/components/student-dashboard"

interface CreateInstitutionData {
  name: string
  email: string
  phone: string
  website: string
  address: string
  logoUrl: string
}

function LernovateAdminContent() {
  const { user, logout } = useAuth()
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [formData, setFormData] = useState<CreateInstitutionData>({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    logoUrl: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<CreateInstitutionData>>({})
  const [viewInstitution, setViewInstitution] = useState<Institution | null>(null)
  const [editInstitution, setEditInstitution] = useState<Institution | null>(null)
  const [deleteInstitution, setDeleteInstitution] = useState<Institution | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeSection, setActiveSection] = useState("institutions")
  const { toast } = useToast()

  const itemsPerPage = 10

  useEffect(() => {
    loadInstitutions()
  }, [])

  const loadInstitutions = async () => {
    try {
      console.log("[v0] Loading institutions from API...")
      const response = await fetch("/api/institutions")

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        console.error("[v0] API response not ok:", response.status, response.statusText)
        // Fallback to default institutions if API fails
        const defaultInstitutions = [
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
        setInstitutions(defaultInstitutions)
        toast({
          title: "Notice",
          description: "Using default institutions data. API connection failed.",
          variant: "default",
        })
        return
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] Response is not JSON:", contentType)
        throw new Error("Server returned non-JSON response")
      }

      const result = await response.json()
      console.log("[v0] API result:", result)

      if (result.success) {
        setInstitutions(result.data || [])
        console.log("[v0] Successfully loaded", result.data?.length || 0, "institutions")
      } else {
        console.error("[v0] API returned error:", result.message)
        toast({
          title: "Error",
          description: result.message || "Failed to load institutions.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error loading institutions:", error)

      const fallbackInstitutions = [
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

      setInstitutions(fallbackInstitutions)
      toast({
        title: "Notice",
        description: "Using offline data. Please check your connection and refresh the page.",
        variant: "default",
      })
    } finally {
      setIsInitialLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<CreateInstitutionData> = {}

    if (!formData.name.trim()) {
      errors.name = "Institution name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required"
    }

    if (formData.phone && !/^\d+$/.test(formData.phone)) {
      errors.phone = "Phone number should contain only digits"
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      errors.website = "Please enter a valid URL (e.g., https://example.com)"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateInstitution = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/institutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setInstitutions((prev) => [result.data, ...prev])
        setFormData({
          name: "",
          email: "",
          phone: "",
          website: "",
          address: "",
          logoUrl: "",
        })
        setFormErrors({})
        setIsCreateDialogOpen(false)
        toast({
          title: "Success!",
          description: "Institution created successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create institution.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating institution:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteInstitution = async () => {
    if (!deleteInstitution) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/institutions/${deleteInstitution.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setInstitutions((prev) => prev.filter((inst) => inst.id !== deleteInstitution.id))
        setDeleteInstitution(null)
        toast({
          title: "Success!",
          description: "Institution deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete institution.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting institution:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleInstitutionUpdated = (updatedInstitution: Institution) => {
    setInstitutions((prev) => prev.map((inst) => (inst.id === updatedInstitution.id ? updatedInstitution : inst)))
  }

  const filteredInstitutions = institutions.filter(
    (institution) =>
      institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage)
  const paginatedInstitutions = filteredInstitutions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (user?.role === "student") {
    return <StudentDashboard />
  }

  if (!["admin", "faculty"].includes(user?.role || "")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You don't have permission to access the admin panel.</p>
          <Button onClick={logout} className="mt-4">
            Logout
          </Button>
        </div>
      </div>
    )
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading LERNOVATE Admin Panel...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              <h1 className="font-heading text-lg sm:text-2xl font-bold text-foreground">LERNOVATE</h1>
            </div>
            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
              Admin Panel
            </Badge>
          </div>
          <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Welcome,</span>
              <span className="font-medium">{user?.name}</span>
              <Badge variant="outline" className="text-xs">
                {user?.role}
              </Badge>
            </div>
            {(user?.role === "admin" || user?.role === "faculty") && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setActiveSection("settings")}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex overflow-x-hidden">
        <aside className="hidden lg:block w-64 border-r bg-sidebar min-h-[calc(100vh-4rem)] flex-shrink-0">
          <nav className="p-4 space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeSection === "institutions" ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
              onClick={() => setActiveSection("institutions")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Institutions
            </Button>
            {(user?.role === "admin" || user?.role === "faculty") && (
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeSection === "courses" ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                onClick={() => setActiveSection("courses")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Courses
              </Button>
            )}
            {user?.role === "admin" && (
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeSection === "users" ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                onClick={() => setActiveSection("users")}
              >
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            )}
            {(user?.role === "admin" || user?.role === "faculty") && (
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeSection === "analytics" ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                onClick={() => setActiveSection("analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            )}
            {(user?.role === "admin" || user?.role === "faculty") && (
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeSection === "settings" ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                onClick={() => setActiveSection("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            )}
          </nav>
        </aside>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
          <nav className="flex justify-around p-2">
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 ${activeSection === "institutions" ? "text-accent" : ""}`}
              onClick={() => setActiveSection("institutions")}
            >
              <Building2 className="h-4 w-4" />
              <span className="text-xs">Institutions</span>
            </Button>
            {(user?.role === "admin" || user?.role === "faculty") && (
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 ${activeSection === "courses" ? "text-accent" : ""}`}
                onClick={() => setActiveSection("courses")}
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-xs">Courses</span>
              </Button>
            )}
            {user?.role === "admin" && (
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 ${activeSection === "users" ? "text-accent" : ""}`}
                onClick={() => setActiveSection("users")}
              >
                <Users className="h-4 w-4" />
                <span className="text-xs">Users</span>
              </Button>
            )}
            {(user?.role === "admin" || user?.role === "faculty") && (
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 ${activeSection === "analytics" ? "text-accent" : ""}`}
                onClick={() => setActiveSection("analytics")}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs">Analytics</span>
              </Button>
            )}
            {(user?.role === "admin" || user?.role === "faculty") && (
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 ${activeSection === "settings" ? "text-accent" : ""}`}
                onClick={() => setActiveSection("settings")}
              >
                <Settings className="h-4 w-4" />
                <span className="text-xs">Settings</span>
              </Button>
            )}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 min-w-0 overflow-x-hidden pb-20 lg:pb-6">
          {activeSection === "institutions" ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold">Institution Management</h2>
                  <p className="text-muted-foreground mt-1">Manage educational institutions in your system</p>
                </div>
                {user?.role === "admin" && (
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-accent hover:bg-accent/90 w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Institution
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] mx-4 sm:mx-0">
                      <DialogHeader>
                        <DialogTitle className="font-heading">Create New Institution</DialogTitle>
                        <DialogDescription>
                          Add a new educational institution to the LERNOVATE platform.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Institution Name *</Label>
                          <Input
                            id="name"
                            placeholder="e.g., Kathmandu Public School"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            className={formErrors.name ? "border-destructive" : ""}
                          />
                          {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="admin@institution.edu.np"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            className={formErrors.email ? "border-destructive" : ""}
                          />
                          {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="9800000000"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            className={formErrors.phone ? "border-destructive" : ""}
                          />
                          {formErrors.phone && <p className="text-sm text-destructive">{formErrors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            placeholder="https://institution.edu.np"
                            value={formData.website}
                            onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                            className={formErrors.website ? "border-destructive" : ""}
                          />
                          {formErrors.website && <p className="text-sm text-destructive">{formErrors.website}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address *</Label>
                          <Input
                            id="address"
                            placeholder="e.g., Bagbazar, Kathmandu"
                            value={formData.address}
                            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                            className={formErrors.address ? "border-destructive" : ""}
                          />
                          {formErrors.address && <p className="text-sm text-destructive">{formErrors.address}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="logo">Logo URL</Label>
                          <Input
                            id="logo"
                            placeholder="https://example.com/logo.png"
                            value={formData.logoUrl}
                            onChange={(e) => setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateInstitution} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Institution"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Institutions</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{institutions.length}</div>
                    <p className="text-xs text-muted-foreground">Active institutions</p>
                  </CardContent>
                </Card>
                {user?.role === "admin" ? (
                  <>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-muted-foreground">Across all institutions</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">89</div>
                        <p className="text-xs text-muted-foreground">Currently running</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+12</div>
                        <p className="text-xs text-muted-foreground">New registrations</p>
                      </CardContent>
                    </Card>
                  </>
                ) : user?.role === "faculty" ? (
                  <>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">6</div>
                        <p className="text-xs text-muted-foreground">Currently teaching</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-muted-foreground">Enrolled students</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Pending review</p>
                      </CardContent>
                    </Card>
                  </>
                ) : null}
              </div>

              {/* Institutions Table */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="font-heading">Institutions</CardTitle>
                      <CardDescription>Manage all registered educational institutions</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search institutions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 w-full sm:w-[300px]"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {paginatedInstitutions.length === 0 ? (
                    <div className="text-center py-12">
                      <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No institutions found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? "Try adjusting your search terms."
                          : "Get started by creating your first institution."}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[200px]">Institution</TableHead>
                              <TableHead className="min-w-[180px] hidden sm:table-cell">Contact</TableHead>
                              <TableHead className="min-w-[150px] hidden md:table-cell">Location</TableHead>
                              <TableHead className="min-w-[100px] hidden lg:table-cell">Created</TableHead>
                              <TableHead className="min-w-[120px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedInstitutions.map((institution) => (
                              <TableRow key={institution.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                      <AvatarImage src={institution.logoUrl || "/placeholder.svg"} />
                                      <AvatarFallback>
                                        {institution.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .slice(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-sm sm:text-base">{institution.name}</div>
                                      {institution.website && (
                                        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                          <Globe className="mr-1 h-3 w-3" />
                                          <a
                                            href={institution.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-accent truncate max-w-[120px] sm:max-w-none"
                                          >
                                            {institution.website.replace(/^https?:\/\//, "")}
                                          </a>
                                        </div>
                                      )}
                                      <div className="sm:hidden space-y-1 mt-1">
                                        <div className="flex items-center text-xs text-muted-foreground">
                                          <Mail className="mr-1 h-3 w-3" />
                                          <span className="truncate max-w-[150px]">{institution.email}</span>
                                        </div>
                                        {institution.phone && (
                                          <div className="flex items-center text-xs text-muted-foreground">
                                            <Phone className="mr-1 h-3 w-3" />
                                            {institution.phone}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <div className="space-y-1">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Mail className="mr-1 h-3 w-3" />
                                      <span className="truncate max-w-[150px]">{institution.email}</span>
                                    </div>
                                    {institution.phone && (
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Phone className="mr-1 h-3 w-3" />
                                        {institution.phone}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    <span className="truncate max-w-[120px]">{institution.address}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                                  {formatDate(institution.createdAt)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-1 sm:space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => setViewInstitution(institution)}>
                                      <Eye className="h-3 w-3 sm:mr-1" />
                                      <span className="hidden sm:inline">View</span>
                                    </Button>
                                    {user?.role === "admin" && (
                                      <Button variant="ghost" size="sm" onClick={() => setEditInstitution(institution)}>
                                        <Edit className="h-3 w-3 sm:mr-1" />
                                        <span className="hidden sm:inline">Edit</span>
                                      </Button>
                                    )}
                                    {user?.role === "admin" && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteInstitution(institution)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-3 w-3 sm:mr-1" />
                                        <span className="hidden sm:inline">Delete</span>
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                          <p className="text-sm text-muted-foreground text-center sm:text-left">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, filteredInstitutions.length)} of{" "}
                            {filteredInstitutions.length} institutions
                          </p>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </Button>
                            <span className="text-sm">
                              Page {currentPage} of {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <NavigationPages activeSection={activeSection} />
          )}
        </main>
      </div>

      <InstitutionViewDialog
        institution={viewInstitution}
        open={!!viewInstitution}
        onOpenChange={(open) => !open && setViewInstitution(null)}
      />

      {user?.role === "admin" && (
        <InstitutionEditDialog
          institution={editInstitution}
          open={!!editInstitution}
          onOpenChange={(open) => !open && setEditInstitution(null)}
          onInstitutionUpdated={handleInstitutionUpdated}
        />
      )}

      {user?.role === "admin" && (
        <AlertDialog open={!!deleteInstitution} onOpenChange={(open) => !open && setDeleteInstitution(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Institution</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{deleteInstitution?.name}</strong>? This action cannot be undone
                and will permanently remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteInstitution}
                disabled={isDeleting}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Institution"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

export default function LernovateAdmin() {
  return (
    <AuthGuard>
      <LernovateAdminContent />
    </AuthGuard>
  )
}
