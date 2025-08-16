"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Bell, Palette, Save, Upload, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface StudentSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentSettings({ open, onOpenChange }: StudentSettingsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    avatar: user?.avatar || "",
    studentId: user?.id || "",
    program: "Computer Science",
    year: "2nd Year",
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    courseUpdates: true,
    assignmentReminders: true,
    gradeNotifications: true,
    announcementAlerts: true,
  })

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: theme || "light",
    language: "en",
    timezone: "Asia/Kathmandu",
    dateFormat: "MM/DD/YYYY",
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success!",
        description: "Notification preferences updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAppearance = async () => {
    setIsLoading(true)
    try {
      if (appearance.theme !== theme) {
        setTheme(appearance.theme)
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success!",
        description: "Appearance settings updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appearance.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-heading text-2xl">Settings</DialogTitle>
              <DialogDescription>Manage your account preferences and settings</DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
                <CardDescription>Update your personal information and academic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.avatar || "/student-avatar.png"} />
                    <AvatarFallback>
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input
                      id="profile-name"
                      value={profileData.name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email Address</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input
                      id="student-id"
                      value={profileData.studentId}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, studentId: e.target.value }))}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">Phone Number</Label>
                    <Input
                      id="profile-phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="9800000000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <Select
                      value={profileData.program}
                      onValueChange={(value) => setProfileData((prev) => ({ ...prev, program: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Business Administration">Business Administration</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Academic Year</Label>
                    <Select
                      value={profileData.year}
                      onValueChange={(value) => setProfileData((prev) => ({ ...prev, year: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Notification Preferences</CardTitle>
                </div>
                <CardDescription>
                  Choose how you want to receive notifications about your courses and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Course Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about course changes and announcements
                    </p>
                  </div>
                  <Switch
                    checked={notifications.courseUpdates}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, courseUpdates: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Assignment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Reminders about upcoming assignment deadlines</p>
                  </div>
                  <Switch
                    checked={notifications.assignmentReminders}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, assignmentReminders: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Grade Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notifications when new grades are posted</p>
                  </div>
                  <Switch
                    checked={notifications.gradeNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, gradeNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Announcement Alerts</Label>
                    <p className="text-sm text-muted-foreground">Important announcements from instructors</p>
                  </div>
                  <Switch
                    checked={notifications.announcementAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, announcementAlerts: checked }))
                    }
                  />
                </div>

                <Button onClick={handleSaveNotifications} disabled={isLoading} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Notification Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <CardTitle>Appearance & Language</CardTitle>
                </div>
                <CardDescription>Customize how the application looks and behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={appearance.theme}
                    onValueChange={(value) => {
                      setAppearance((prev) => ({ ...prev, theme: value }))
                      setTheme(value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={appearance.language}
                    onValueChange={(value) => setAppearance((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ne">नेपाली</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={appearance.timezone}
                    onValueChange={(value) => setAppearance((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kathmandu">Asia/Kathmandu (NPT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={appearance.dateFormat}
                    onValueChange={(value) => setAppearance((prev) => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveAppearance} disabled={isLoading} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Appearance Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
