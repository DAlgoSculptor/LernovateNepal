interface Course {
  id: string
  name: string
  description: string
  instructor: string
  instructorId: string
  category: string
  duration: string
  level: "beginner" | "intermediate" | "advanced"
  status: "active" | "inactive" | "draft"
  enrollmentCount: number
  maxEnrollment: number
  startDate: string
  endDate: string
  price: number
  thumbnail?: string
  institutionId?: string
  createdAt: string
  updatedAt: string
}

class CourseStore {
  private defaultCourses: Course[] = [
    {
      id: "1",
      name: "Introduction to Computer Science",
      description:
        "A comprehensive introduction to computer science fundamentals including programming, algorithms, and data structures.",
      instructor: "Dr. Sarah Johnson",
      instructorId: "2",
      category: "Computer Science",
      duration: "16 weeks",
      level: "beginner",
      status: "active",
      enrollmentCount: 45,
      maxEnrollment: 60,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 16 * 7 * 24 * 60 * 60 * 1000).toISOString(),
      price: 15000,
      thumbnail: "/course-cs.png",
      institutionId: "1",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Advanced Mathematics",
      description:
        "Advanced mathematical concepts including calculus, linear algebra, and discrete mathematics for engineering students.",
      instructor: "Prof. Michael Chen",
      instructorId: "4",
      category: "Mathematics",
      duration: "12 weeks",
      level: "advanced",
      status: "active",
      enrollmentCount: 28,
      maxEnrollment: 40,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 19 * 7 * 24 * 60 * 60 * 1000).toISOString(),
      price: 18000,
      thumbnail: "/course-math.png",
      institutionId: "2",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      name: "Digital Marketing Fundamentals",
      description: "Learn the basics of digital marketing including SEO, social media marketing, and content strategy.",
      instructor: "Emma Wilson",
      instructorId: "5",
      category: "Business",
      duration: "8 weeks",
      level: "beginner",
      status: "active",
      enrollmentCount: 67,
      maxEnrollment: 80,
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000).toISOString(),
      price: 12000,
      thumbnail: "/course-marketing.png",
      institutionId: "1",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      name: "Web Development Bootcamp",
      description: "Full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, and databases.",
      instructor: "David Brown",
      instructorId: "6",
      category: "Technology",
      duration: "20 weeks",
      level: "intermediate",
      status: "draft",
      enrollmentCount: 0,
      maxEnrollment: 50,
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 50 * 7 * 24 * 60 * 60 * 1000).toISOString(),
      price: 25000,
      thumbnail: "/course-webdev.png",
      institutionId: "1",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeCourses()
    }
  }

  private initializeCourses() {
    if (typeof window !== "undefined" && window.localStorage) {
      const existingCourses = localStorage.getItem("lernovate_courses")
      if (!existingCourses) {
        localStorage.setItem("lernovate_courses", JSON.stringify(this.defaultCourses))
      }
    }
  }

  async getCourses(): Promise<{ success: boolean; data?: Course[]; error?: string }> {
    try {
      if (typeof window === "undefined") {
        return { success: true, data: this.defaultCourses }
      }
      const courses = JSON.parse(localStorage.getItem("lernovate_courses") || JSON.stringify(this.defaultCourses))
      return { success: true, data: courses }
    } catch (error) {
      return { success: false, error: "Failed to load courses" }
    }
  }

  async createCourse(
    courseData: Omit<Course, "id" | "createdAt" | "updatedAt" | "enrollmentCount">,
  ): Promise<{ success: boolean; data?: Course; error?: string }> {
    try {
      if (typeof window === "undefined") {
        return { success: false, error: "Cannot create course on server-side" }
      }

      const courses = JSON.parse(localStorage.getItem("lernovate_courses") || JSON.stringify(this.defaultCourses))

      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
        enrollmentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      courses.unshift(newCourse)
      localStorage.setItem("lernovate_courses", JSON.stringify(courses))

      return { success: true, data: newCourse }
    } catch (error) {
      return { success: false, error: "Failed to create course" }
    }
  }

  async updateCourse(
    id: string,
    courseData: Partial<Course>,
  ): Promise<{ success: boolean; data?: Course; error?: string }> {
    try {
      if (typeof window === "undefined") {
        return { success: false, error: "Cannot update course on server-side" }
      }

      const courses = JSON.parse(localStorage.getItem("lernovate_courses") || JSON.stringify(this.defaultCourses))
      const courseIndex = courses.findIndex((course: Course) => course.id === id)

      if (courseIndex === -1) {
        return { success: false, error: "Course not found" }
      }

      courses[courseIndex] = {
        ...courses[courseIndex],
        ...courseData,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem("lernovate_courses", JSON.stringify(courses))

      return { success: true, data: courses[courseIndex] }
    } catch (error) {
      return { success: false, error: "Failed to update course" }
    }
  }

  async deleteCourse(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window === "undefined") {
        return { success: false, error: "Cannot delete course on server-side" }
      }

      const courses = JSON.parse(localStorage.getItem("lernovate_courses") || JSON.stringify(this.defaultCourses))
      const filteredCourses = courses.filter((course: Course) => course.id !== id)

      if (courses.length === filteredCourses.length) {
        return { success: false, error: "Course not found" }
      }

      localStorage.setItem("lernovate_courses", JSON.stringify(filteredCourses))
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete course" }
    }
  }

  async getCoursesByInstructor(instructorId: string): Promise<{ success: boolean; data?: Course[]; error?: string }> {
    try {
      const courses =
        typeof window === "undefined"
          ? this.defaultCourses
          : JSON.parse(localStorage.getItem("lernovate_courses") || JSON.stringify(this.defaultCourses))

      const filteredCourses = courses.filter((course: Course) => course.instructorId === instructorId)
      return { success: true, data: filteredCourses }
    } catch (error) {
      return { success: false, error: "Failed to load courses" }
    }
  }

  async getCoursesByCategory(category: string): Promise<{ success: boolean; data?: Course[]; error?: string }> {
    try {
      const courses =
        typeof window === "undefined"
          ? this.defaultCourses
          : JSON.parse(localStorage.getItem("lernovate_courses") || JSON.stringify(this.defaultCourses))

      const filteredCourses = courses.filter((course: Course) => course.category === category)
      return { success: true, data: filteredCourses }
    } catch (error) {
      return { success: false, error: "Failed to load courses" }
    }
  }
}

export const courseStore = new CourseStore()
export type { Course }
