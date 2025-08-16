"use client"
import { UserManagement } from "@/components/user-management"
import { CourseManagement } from "@/components/course-management"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { SettingsPanel } from "@/components/settings-panel"

interface NavigationPagesProps {
  activeSection: string
}

export function NavigationPages({ activeSection }: NavigationPagesProps) {
  if (activeSection === "users") {
    return <UserManagement />
  }

  if (activeSection === "courses") {
    return <CourseManagement />
  }

  if (activeSection === "analytics") {
    return <AnalyticsDashboard />
  }

  if (activeSection === "settings") {
    return <SettingsPanel />
  }

  return null
}
