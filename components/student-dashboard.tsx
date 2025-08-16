"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, Clock, GraduationCap, Trophy, FileText, Bell, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { StudentSettings } from "@/components/student-settings"
import { useState } from "react"

export function StudentDashboard() {
  const { user, logout } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Mock student data
  const enrolledCourses = [
    {
      id: 1,
      name: "Introduction to Computer Science",
      instructor: "Dr. Sarah Johnson",
      progress: 75,
      nextClass: "2024-01-15T10:00:00",
      image: "/course-cs.png",
    },
    {
      id: 2,
      name: "Advanced Mathematics",
      instructor: "Prof. Michael Chen",
      progress: 60,
      nextClass: "2024-01-15T14:00:00",
      image: "/course-math.png",
    },
    {
      id: 3,
      name: "Digital Marketing Fundamentals",
      instructor: "Ms. Emily Davis",
      progress: 90,
      nextClass: "2024-01-16T09:00:00",
      image: "/course-marketing.png",
    },
  ]

  const upcomingAssignments = [
    {
      id: 1,
      title: "Data Structures Project",
      course: "Computer Science",
      dueDate: "2024-01-18",
      status: "pending",
    },
    {
      id: 2,
      title: "Calculus Problem Set",
      course: "Advanced Mathematics",
      dueDate: "2024-01-20",
      status: "pending",
    },
    {
      id: 3,
      title: "Marketing Campaign Analysis",
      course: "Digital Marketing",
      dueDate: "2024-01-22",
      status: "submitted",
    },
  ]

  const recentGrades = [
    { course: "Computer Science", assignment: "Midterm Exam", grade: "A-", points: "92/100" },
    { course: "Advanced Mathematics", assignment: "Quiz 3", grade: "B+", points: "87/100" },
    { course: "Digital Marketing", assignment: "Case Study", grade: "A", points: "95/100" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-accent" />
              <h1 className="font-heading text-2xl font-bold text-foreground">LERNOVATE</h1>
            </div>
            <Badge variant="secondary" className="text-xs">
              Student Portal
            </Badge>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Welcome,</span>
              <span className="font-medium">{user?.name}</span>
              <Badge variant="outline" className="text-xs">
                {user?.role}
              </Badge>
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/student-avatar.png"} />
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

      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold">Welcome back, {user?.name?.split(" ")[0]}!</h2>
            <p className="text-muted-foreground mt-1">Here's what's happening with your studies today</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">Active this semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {upcomingAssignments.filter((a) => a.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Due this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">A-</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Enrolled Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">My Courses</CardTitle>
              <CardDescription>Your enrolled courses and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {course.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="font-medium">{course.name}</h4>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      Next class: {new Date(course.nextClass).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Upcoming Assignments</CardTitle>
              <CardDescription>Stay on top of your deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={assignment.status === "submitted" ? "default" : "secondary"}>
                    {assignment.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Recent Grades</CardTitle>
            <CardDescription>Your latest assignment and exam results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGrades.map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{grade.assignment}</h4>
                    <p className="text-sm text-muted-foreground">{grade.course}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{grade.grade}</div>
                    <div className="text-sm text-muted-foreground">{grade.points}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Settings Dialog */}
      <StudentSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
