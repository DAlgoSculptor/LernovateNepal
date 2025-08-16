"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  BookOpen,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Loader2,
  Filter,
  Eye,
  Clock,
  TrendingUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Course } from "@/lib/course-store"

interface CreateCourseData {
  name: string
  description: string
  instructor: string
  instructorId: string
  category: string
  duration: string
  level: "beginner" | "intermediate" | "advanced"
  status: "active" | "inactive" | "draft"
  maxEnrollment: number
  startDate: string
  endDate: string
  price: number
  thumbnail?: string
  institutionId?: string
}

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [formData, setFormData] = useState<CreateCourseData>({
    name: "",
    description: "",
    instructor: "",
    instructorId: "",
    category: "",
    duration: "",
    level: "beginner",
    status: "draft",
    maxEnrollment: 50,
    startDate: "",
    endDate: "",
    price: 0,
    thumbnail: "",
    institutionId: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<CreateCourseData>>({})
  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null)
  const [viewCourse, setViewCourse] = useState<Course | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const itemsPerPage = 10

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const response = await fetch("/api/courses")
      const result = await response.json()

      if (response.ok) {
        setCourses(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load courses.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading courses:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading courses.",
        variant: "destructive",
      })
    } finally {
      setIsInitialLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<CreateCourseData> = {}

    if (!formData.name.trim()) {
      errors.name = "Course name is required"
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }

    if (!formData.instructor.trim()) {
      errors.instructor = "Instructor name is required"
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required"
    }

    if (!formData.duration.trim()) {
      errors.duration = "Duration is required"
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required"
    }

    if (!formData.endDate) {
      errors.endDate = "End date is required"
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = "End date must be after start date"
    }

    if (formData.maxEnrollment <= 0) {
      errors.maxEnrollment = "Max enrollment must be greater than 0"
    }

    if (formData.price < 0) {
      errors.price = "Price cannot be negative"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateCourse = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setCourses((prev) => [result.data, ...prev])
        setFormData({
          name: "",
          description: "",
          instructor: "",
          instructorId: "",
          category: "",
          duration: "",
          level: "beginner",
          status: "draft",
          maxEnrollment: 50,
          startDate: "",
          endDate: "",
          price: 0,
          thumbnail: "",
          institutionId: "",
        })
        setFormErrors({})
        setIsCreateDialogOpen(false)
        toast({
          title: "Success!",
          description: "Course created successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create course.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating course:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCourse = async (updatedData: Partial<Course>) => {
    if (!editCourse) return

    try {
      const response = await fetch(`/api/courses/${editCourse.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      const result = await response.json()

      if (response.ok) {
        setCourses((prev) => prev.map((course) => (course.id === editCourse.id ? result.data : course)))
        setEditCourse(null)
        toast({
          title: "Success!",
          description: "Course updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update course.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating course:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCourse = async () => {
    if (!deleteCourse) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/courses/${deleteCourse.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (response.ok) {
        setCourses((prev) => prev.filter((course) => course.id !== deleteCourse.id))
        setDeleteCourse(null)
        toast({
          title: "Success!",
          description: "Course deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete course.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    const matchesLevel = levelFilter === "all" || course.level === levelFilter

    return matchesSearch && matchesCategory && matchesStatus && matchesLevel
  })

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "beginner":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Beginner
          </Badge>
        )
      case "intermediate":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Intermediate
          </Badge>
        )
      case "advanced":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            Advanced
          </Badge>
        )
      default:
        return <Badge variant="secondary">{level}</Badge>
    }
  }

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading courses...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold">Course Management</h2>
          <p className="text-muted-foreground mt-1">Manage courses and curriculum across institutions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">Create New Course</DialogTitle>
              <DialogDescription>Add a new course to the LERNOVATE platform.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Course Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Introduction to Computer Science"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className={formErrors.name ? "border-destructive" : ""}
                  />
                  {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Computer Science"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className={formErrors.category ? "border-destructive" : ""}
                  />
                  {formErrors.category && <p className="text-sm text-destructive">{formErrors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Course description and objectives..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className={formErrors.description ? "border-destructive" : ""}
                  rows={3}
                />
                {formErrors.description && <p className="text-sm text-destructive">{formErrors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor Name *</Label>
                  <Input
                    id="instructor"
                    placeholder="e.g., Dr. John Smith"
                    value={formData.instructor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, instructor: e.target.value }))}
                    className={formErrors.instructor ? "border-destructive" : ""}
                  />
                  {formErrors.instructor && <p className="text-sm text-destructive">{formErrors.instructor}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 12 weeks"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    className={formErrors.duration ? "border-destructive" : ""}
                  />
                  {formErrors.duration && <p className="text-sm text-destructive">{formErrors.duration}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
                      setFormData((prev) => ({ ...prev, level: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive" | "draft") =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxEnrollment">Max Enrollment</Label>
                  <Input
                    id="maxEnrollment"
                    type="number"
                    placeholder="50"
                    value={formData.maxEnrollment}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, maxEnrollment: Number.parseInt(e.target.value) || 0 }))
                    }
                    className={formErrors.maxEnrollment ? "border-destructive" : ""}
                  />
                  {formErrors.maxEnrollment && <p className="text-sm text-destructive">{formErrors.maxEnrollment}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                    className={formErrors.startDate ? "border-destructive" : ""}
                  />
                  {formErrors.startDate && <p className="text-sm text-destructive">{formErrors.startDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                    className={formErrors.endDate ? "border-destructive" : ""}
                  />
                  {formErrors.endDate && <p className="text-sm text-destructive">{formErrors.endDate}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (NPR)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="15000"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseInt(e.target.value) || 0 }))}
                  className={formErrors.price ? "border-destructive" : ""}
                />
                {formErrors.price && <p className="text-sm text-destructive">{formErrors.price}</p>}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCourse} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">All courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.filter((c) => c.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.reduce((sum, c) => sum + c.enrollmentCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Students enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              NPR {courses.reduce((sum, c) => sum + c.enrollmentCount * c.price, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-heading">Courses</CardTitle>
              <CardDescription>Manage all courses in the system</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all" || levelFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Get started by creating your first course."}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={course.thumbnail || "/placeholder.svg"} />
                            <AvatarFallback>
                              <BookOpen className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{course.name}</div>
                            <div className="text-sm text-muted-foreground">{course.category}</div>
                            <div className="flex items-center space-x-1 mt-1">{getLevelBadge(course.level)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{course.instructor}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {course.enrollmentCount}/{course.maxEnrollment}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${(course.enrollmentCount / course.maxEnrollment) * 100}%` }}
                          ></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(course.startDate)} - {formatDate(course.endDate)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(course.status)}</TableCell>
                      <TableCell>
                        <div className="font-medium">NPR {course.price.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setViewCourse(course)}>
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditCourse(course)}>
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteCourse(course)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredCourses.length)} of {filteredCourses.length} courses
                  </p>
                  <div className="flex items-center space-x-2">
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

      {/* View Course Dialog */}
      {viewCourse && (
        <Dialog open={!!viewCourse} onOpenChange={(open) => !open && setViewCourse(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-heading">{viewCourse.name}</DialogTitle>
              <DialogDescription>{viewCourse.category}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{viewCourse.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Instructor</h4>
                  <p className="text-sm">{viewCourse.instructor}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Duration</h4>
                  <p className="text-sm">{viewCourse.duration}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Level</h4>
                  {getLevelBadge(viewCourse.level)}
                </div>
                <div>
                  <h4 className="font-medium mb-1">Status</h4>
                  {getStatusBadge(viewCourse.status)}
                </div>
                <div>
                  <h4 className="font-medium mb-1">Enrollment</h4>
                  <p className="text-sm">
                    {viewCourse.enrollmentCount}/{viewCourse.maxEnrollment} students
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Price</h4>
                  <p className="text-sm">NPR {viewCourse.price.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Start Date</h4>
                  <p className="text-sm">{formatDate(viewCourse.startDate)}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">End Date</h4>
                  <p className="text-sm">{formatDate(viewCourse.endDate)}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Course Dialog */}
      {editCourse && (
        <Dialog open={!!editCourse} onOpenChange={(open) => !open && setEditCourse(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">Edit Course</DialogTitle>
              <DialogDescription>Update course information and settings.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Course Name</Label>
                <Input
                  id="edit-name"
                  value={editCourse.name}
                  onChange={(e) => setEditCourse((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editCourse.description}
                  onChange={(e) => setEditCourse((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-instructor">Instructor</Label>
                  <Input
                    id="edit-instructor"
                    value={editCourse.instructor}
                    onChange={(e) => setEditCourse((prev) => (prev ? { ...prev, instructor: e.target.value } : null))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={editCourse.category}
                    onChange={(e) => setEditCourse((prev) => (prev ? { ...prev, category: e.target.value } : null))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-level">Level</Label>
                  <Select
                    value={editCourse.level}
                    onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
                      setEditCourse((prev) => (prev ? { ...prev, level: value } : null))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editCourse.status}
                    onValueChange={(value: "active" | "inactive" | "draft") =>
                      setEditCourse((prev) => (prev ? { ...prev, status: value } : null))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (NPR)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editCourse.price}
                    onChange={(e) =>
                      setEditCourse((prev) => (prev ? { ...prev, price: Number.parseInt(e.target.value) || 0 } : null))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditCourse(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdateCourse(editCourse)}>Update Course</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Course Dialog */}
      <AlertDialog open={!!deleteCourse} onOpenChange={(open) => !open && setDeleteCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteCourse?.name}</strong>? This action cannot be undone and
              will permanently remove all associated data including enrollments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Course"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
