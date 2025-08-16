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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Upload,
  Database,
  Mail,
  Server,
  FileText,
  Download,
  RefreshCw,
  Settings2,
  Lock,
  Activity,
  AlertTriangle,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export function SettingsPanel() {
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
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    systemAlerts: true,
    courseUpdates: true,
    enrollmentAlerts: false,
  })

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    theme: theme || "light",
    language: "en",
    timezone: "Asia/Kathmandu",
    dateFormat: "MM/DD/YYYY",
    maintenanceMode: false,
    registrationEnabled: true,
    autoBackup: true,
    sessionTimeout: "30",
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",
    ipWhitelist: "",
    auditLogging: true,
  })

  const [emailTemplates, setEmailTemplates] = useState({
    welcomeEmail: {
      subject: "Welcome to LERNOVATE",
      body: "Welcome to our learning platform! We're excited to have you join our community.",
    },
    courseEnrollment: {
      subject: "Course Enrollment Confirmation",
      body: "You have successfully enrolled in the course. Start learning today!",
    },
    passwordReset: {
      subject: "Password Reset Request",
      body: "Click the link below to reset your password. This link expires in 24 hours.",
    },
  })

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: "30",
    backupLocation: "cloud",
    lastBackup: "2024-01-15T10:30:00Z",
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

  const handleSaveSystem = async () => {
    setIsLoading(true)
    try {
      if (systemSettings.theme !== theme) {
        setTheme(systemSettings.theme)
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success!",
        description: "System settings updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update system settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSecurity = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success!",
        description: "Security settings updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveEmailTemplates = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success!",
        description: "Email templates updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email templates.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackupNow = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setBackupSettings((prev) => ({ ...prev, lastBackup: new Date().toISOString() }))
      toast({
        title: "Success!",
        description: "System backup completed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Backup failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearCache = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Success!",
        description: "System cache cleared successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-heading text-3xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and system preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>Profile Settings</CardTitle>
              </div>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
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
                  Change Avatar
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

              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone Number</Label>
                <Input
                  id="profile-phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="9800000000"
                />
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
              <CardDescription>Configure how you receive notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailNotifications: checked }))}
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
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Get weekly activity summaries</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weeklyReports: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Important system notifications</p>
                </div>
                <Switch
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, systemAlerts: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Course Updates</Label>
                  <p className="text-sm text-muted-foreground">Notifications about course changes</p>
                </div>
                <Switch
                  checked={notifications.courseUpdates}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, courseUpdates: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enrollment Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alerts for new enrollments</p>
                </div>
                <Switch
                  checked={notifications.enrollmentAlerts}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, enrollmentAlerts: checked }))}
                />
              </div>

              <Button onClick={handleSaveNotifications} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Notifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <CardTitle>System Preferences</CardTitle>
                </div>
                <CardDescription>Customize your system experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={systemSettings.theme}
                    onValueChange={(value) => {
                      setSystemSettings((prev) => ({ ...prev, theme: value }))
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
                    value={systemSettings.language}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, language: value }))}
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
                    value={systemSettings.timezone}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, timezone: value }))}
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
                    value={systemSettings.dateFormat}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, dateFormat: value }))}
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

                <Button onClick={handleSaveSystem} disabled={isLoading} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings2 className="h-5 w-5" />
                  <CardTitle>System Control</CardTitle>
                </div>
                <CardDescription>Manage system-wide settings and features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings((prev) => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                  </div>
                  <Switch
                    checked={systemSettings.registrationEnabled}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({ ...prev, registrationEnabled: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup system data</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => setSystemSettings((prev) => ({ ...prev, autoBackup: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select
                    value={systemSettings.sessionTimeout}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, sessionTimeout: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveSystem} disabled={isLoading} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save System Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Security Settings</CardTitle>
                </div>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings((prev) => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Track all system activities</p>
                  </div>
                  <Switch
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => setSecuritySettings((prev) => ({ ...prev, auditLogging: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Select
                    value={securitySettings.passwordExpiry}
                    onValueChange={(value) => setSecuritySettings((prev) => ({ ...prev, passwordExpiry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Select
                    value={securitySettings.loginAttempts}
                    onValueChange={(value) => setSecuritySettings((prev) => ({ ...prev, loginAttempts: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveSecurity} disabled={isLoading} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <CardTitle>Advanced Security</CardTitle>
                </div>
                <CardDescription>Advanced security configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                  <Textarea
                    id="ipWhitelist"
                    placeholder="Enter IP addresses (one per line)"
                    value={securitySettings.ipWhitelist}
                    onChange={(e) => setSecuritySettings((prev) => ({ ...prev, ipWhitelist: e.target.value }))}
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    Only allow access from these IP addresses (leave empty to allow all)
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Security Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL Certificate</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Firewall</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">DDoS Protection</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSecurity} disabled={isLoading} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Advanced Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <CardTitle>Email Templates</CardTitle>
              </div>
              <CardDescription>Customize email templates sent to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Welcome Email</h4>
                  <div className="space-y-2">
                    <Label htmlFor="welcome-subject">Subject</Label>
                    <Input
                      id="welcome-subject"
                      value={emailTemplates.welcomeEmail.subject}
                      onChange={(e) =>
                        setEmailTemplates((prev) => ({
                          ...prev,
                          welcomeEmail: { ...prev.welcomeEmail, subject: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2 mt-2">
                    <Label htmlFor="welcome-body">Body</Label>
                    <Textarea
                      id="welcome-body"
                      value={emailTemplates.welcomeEmail.body}
                      onChange={(e) =>
                        setEmailTemplates((prev) => ({
                          ...prev,
                          welcomeEmail: { ...prev.welcomeEmail, body: e.target.value },
                        }))
                      }
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Course Enrollment</h4>
                  <div className="space-y-2">
                    <Label htmlFor="enrollment-subject">Subject</Label>
                    <Input
                      id="enrollment-subject"
                      value={emailTemplates.courseEnrollment.subject}
                      onChange={(e) =>
                        setEmailTemplates((prev) => ({
                          ...prev,
                          courseEnrollment: { ...prev.courseEnrollment, subject: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2 mt-2">
                    <Label htmlFor="enrollment-body">Body</Label>
                    <Textarea
                      id="enrollment-body"
                      value={emailTemplates.courseEnrollment.body}
                      onChange={(e) =>
                        setEmailTemplates((prev) => ({
                          ...prev,
                          courseEnrollment: { ...prev.courseEnrollment, body: e.target.value },
                        }))
                      }
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Password Reset</h4>
                  <div className="space-y-2">
                    <Label htmlFor="reset-subject">Subject</Label>
                    <Input
                      id="reset-subject"
                      value={emailTemplates.passwordReset.subject}
                      onChange={(e) =>
                        setEmailTemplates((prev) => ({
                          ...prev,
                          passwordReset: { ...prev.passwordReset, subject: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2 mt-2">
                    <Label htmlFor="reset-body">Body</Label>
                    <Textarea
                      id="reset-body"
                      value={emailTemplates.passwordReset.body}
                      onChange={(e) =>
                        setEmailTemplates((prev) => ({
                          ...prev,
                          passwordReset: { ...prev.passwordReset, body: e.target.value },
                        }))
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveEmailTemplates} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Email Templates
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <CardTitle>Backup & Recovery</CardTitle>
                </div>
                <CardDescription>Manage system backups and data recovery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">Enable scheduled backups</p>
                  </div>
                  <Switch
                    checked={backupSettings.autoBackup}
                    onCheckedChange={(checked) => setBackupSettings((prev) => ({ ...prev, autoBackup: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={backupSettings.backupFrequency}
                    onValueChange={(value) => setBackupSettings((prev) => ({ ...prev, backupFrequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                  <Select
                    value={backupSettings.retentionPeriod}
                    onValueChange={(value) => setBackupSettings((prev) => ({ ...prev, retentionPeriod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Last Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(backupSettings.lastBackup).toLocaleString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleBackupNow} disabled={isLoading} className="flex-1">
                    <Database className="mr-2 h-4 w-4" />
                    Backup Now
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <CardTitle>System Maintenance</CardTitle>
                </div>
                <CardDescription>System optimization and maintenance tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Clear Cache</h4>
                      <p className="text-sm text-muted-foreground">Clear system cache to improve performance</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleClearCache} disabled={isLoading}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">System Logs</h4>
                      <p className="text-sm text-muted-foreground">View and download system logs</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View Logs
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Database Optimization</h4>
                      <p className="text-sm text-muted-foreground">Optimize database performance</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Activity className="mr-2 h-4 w-4" />
                      Optimize
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-destructive">Danger Zone</h4>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Reset System Settings
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset System Settings</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reset all system settings to their default values. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90">
                            Reset Settings
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
