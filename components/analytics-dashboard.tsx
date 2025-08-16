"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Building2,
  DollarSign,
  Calendar,
  Award,
  Target,
  Activity,
} from "lucide-react"

// Mock analytics data
const monthlyUserGrowth = [
  { month: "Jan", users: 120, newUsers: 25 },
  { month: "Feb", users: 145, newUsers: 35 },
  { month: "Mar", users: 180, newUsers: 45 },
  { month: "Apr", users: 225, newUsers: 55 },
  { month: "May", users: 280, newUsers: 65 },
  { month: "Jun", users: 345, newUsers: 75 },
]

const courseEnrollmentData = [
  { month: "Jan", enrollments: 85 },
  { month: "Feb", enrollments: 120 },
  { month: "Mar", enrollments: 165 },
  { month: "Apr", enrollments: 210 },
  { month: "May", enrollments: 285 },
  { month: "Jun", enrollments: 340 },
]

const revenueData = [
  { month: "Jan", revenue: 1250000, target: 1200000 },
  { month: "Feb", revenue: 1680000, target: 1500000 },
  { month: "Mar", revenue: 2145000, target: 1800000 },
  { month: "Apr", revenue: 2890000, target: 2200000 },
  { month: "May", revenue: 3420000, target: 2800000 },
  { month: "Jun", revenue: 4150000, target: 3500000 },
]

const userRoleDistribution = [
  { name: "Students", value: 1247, color: "#8884d8" },
  { name: "Faculty", value: 89, color: "#82ca9d" },
  { name: "Administrators", value: 12, color: "#ffc658" },
]

const courseCategories = [
  { category: "Computer Science", courses: 15, enrollments: 450 },
  { category: "Mathematics", courses: 12, enrollments: 380 },
  { category: "Business", courses: 8, enrollments: 290 },
  { category: "Technology", courses: 10, enrollments: 320 },
  { category: "Science", courses: 6, enrollments: 180 },
]

const institutionPerformance = [
  { name: "Kathmandu Public School", students: 450, courses: 25, revenue: 1850000, growth: 12.5 },
  { name: "Lalitpur Academy", students: 320, courses: 18, revenue: 1240000, growth: 8.3 },
  { name: "Bhaktapur College", students: 280, courses: 15, revenue: 980000, growth: 15.2 },
  { name: "Pokhara Institute", students: 197, courses: 12, revenue: 720000, growth: -2.1 },
]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("6months")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (value: number) => {
    return `NPR ${(value / 1000000).toFixed(1)}M`
  }

  const formatNumber = (value: number) => {
    return value.toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground mt-1">System-wide analytics and insights</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground mt-1">System-wide analytics and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NPR 4.15M</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +18.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,348</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.3% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +19.2% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.4%</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="mr-1 h-3 w-3" />
              -2.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-heading">User Growth</CardTitle>
            <CardDescription>Monthly user registration and growth trends</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <ChartContainer
                config={{
                  users: {
                    label: "Total Users",
                    color: "hsl(var(--chart-1))",
                  },
                  newUsers: {
                    label: "New Users",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[280px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyUserGrowth} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="var(--color-users)"
                      fill="var(--color-users)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="newUsers"
                      stackId="2"
                      stroke="var(--color-newUsers)"
                      fill="var(--color-newUsers)"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-heading">Revenue vs Target</CardTitle>
            <CardDescription>Monthly revenue performance against targets</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                  target: {
                    label: "Target",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[280px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatCurrency} />
                    <ChartTooltip
                      content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
                    />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" />
                    <Bar dataKey="target" fill="var(--color-target)" opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-heading">User Distribution</CardTitle>
            <CardDescription>Users by role across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                students: {
                  label: "Students",
                  color: "#8884d8",
                },
                faculty: {
                  label: "Faculty",
                  color: "#82ca9d",
                },
                administrators: {
                  label: "Administrators",
                  color: "#ffc658",
                },
              }}
              className="h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userRoleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {userRoleDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}</span>
                  <Badge variant="secondary">{formatNumber(item.value)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-heading">Course Enrollments</CardTitle>
            <CardDescription>Monthly enrollment trends</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <ChartContainer
                config={{
                  enrollments: {
                    label: "Enrollments",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={courseEnrollmentData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="var(--color-enrollments)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-enrollments)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Course Categories</CardTitle>
            <CardDescription>Performance by subject area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.category}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{category.courses} courses</Badge>
                      <span className="text-sm text-muted-foreground">{category.enrollments}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full"
                      style={{ width: `${(category.enrollments / 450) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Institution Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Institution Performance</CardTitle>
          <CardDescription>Key metrics for each educational institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {institutionPerformance.map((institution, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-full">
                    <Building2 className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium">{institution.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{formatNumber(institution.students)} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{institution.courses} courses</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(institution.revenue)}</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium flex items-center ${
                        institution.growth >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {institution.growth >= 0 ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {Math.abs(institution.growth)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Growth</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Session Duration</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24m 32s</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +5.2% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.4%</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="mr-1 h-3 w-3" />
              -2.1% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Active Institutions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <div className="flex items-center text-xs text-muted-foreground">No change from last month</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
