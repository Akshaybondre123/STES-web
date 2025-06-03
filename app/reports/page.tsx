"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { CalendarIcon, Download, FileText, TrendingUp, Users } from "lucide-react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { format } from "date-fns"

interface AttendanceRecord {
  sn: number
  ecode: string
  name: string
  shift: string
  scheduledInTime: string
  scheduledOutTime: string
  actualInTime: string
  actualOutTime: string
  workDuration: string
  ot: string
  totalDuration: string
  lateBy: string
  earlyGoingBy: string
  status: string
  punchRecord: string
}

export default function ReportsPage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [reportType, setReportType] = useState("daily")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem("attendanceData")
    if (savedData) {
      setAttendanceData(JSON.parse(savedData))
    }
  }, [])

  // Generate sample data for different time periods
  const generateDailyData = () => {
    const present = attendanceData.filter((r) => r.status === "Present").length
    const absent = attendanceData.filter((r) => r.status === "Absent").length
    const late = attendanceData.filter((r) => r.lateBy !== "00:00" && r.lateBy !== "").length

    return [
      {
        category: "Present",
        count: present,
        percentage: attendanceData.length ? ((present / attendanceData.length) * 100).toFixed(1) : 0,
      },
      {
        category: "Absent",
        count: absent,
        percentage: attendanceData.length ? ((absent / attendanceData.length) * 100).toFixed(1) : 0,
      },
      {
        category: "Late",
        count: late,
        percentage: attendanceData.length ? ((late / attendanceData.length) * 100).toFixed(1) : 0,
      },
    ]
  }

  const generateWeeklyData = () => [
    { day: "Monday", present: 85, absent: 15, late: 5 },
    { day: "Tuesday", present: 88, absent: 12, late: 3 },
    { day: "Wednesday", present: 82, absent: 18, late: 8 },
    { day: "Thursday", present: 90, absent: 10, late: 2 },
    { day: "Friday", present: 87, absent: 13, late: 6 },
    { day: "Saturday", present: 75, absent: 25, late: 4 },
  ]

  const generateMonthlyData = () => [
    { month: "Jan", present: 85, absent: 15, avgWorkHours: 8.2 },
    { month: "Feb", present: 88, absent: 12, avgWorkHours: 8.4 },
    { month: "Mar", present: 82, absent: 18, avgWorkHours: 8.1 },
    { month: "Apr", present: 90, absent: 10, avgWorkHours: 8.6 },
    { month: "May", present: 87, absent: 13, avgWorkHours: 8.3 },
    { month: "Jun", present: 89, absent: 11, avgWorkHours: 8.5 },
  ]

  const generateDepartmentData = () => [
    { department: "Computer Engg", present: 22, absent: 3, total: 25 },
    { department: "Mechanical Engg", present: 20, absent: 2, total: 22 },
    { department: "Civil Engg", present: 16, absent: 2, total: 18 },
    { department: "Electrical Engg", present: 18, absent: 2, total: 20 },
    { department: "Electronics", present: 13, absent: 2, total: 15 },
  ]

  const dailyData = generateDailyData()
  const weeklyData = generateWeeklyData()
  const monthlyData = generateMonthlyData()
  const departmentData = generateDepartmentData()

  const pieColors = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"]

  const exportReport = () => {
    let data: any[] = []
    let filename = ""

    switch (reportType) {
      case "daily":
        data = dailyData
        filename = `daily-report-${format(selectedDate, "yyyy-MM-dd")}.csv`
        break
      case "weekly":
        data = weeklyData
        filename = `weekly-report-${format(selectedDate, "yyyy-MM-dd")}.csv`
        break
      case "monthly":
        data = monthlyData
        filename = `monthly-report-${format(selectedDate, "yyyy-MM")}.csv`
        break
      case "department":
        data = departmentData
        filename = `department-report-${format(selectedDate, "yyyy-MM-dd")}.csv`
        break
    }

    const headers = Object.keys(data[0] || {})
    const csvContent = [headers.join(","), ...data.map((row) => headers.map((header) => row[header]).join(","))].join(
      "\n",
    )

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const renderChart = () => {
    switch (reportType) {
      case "daily":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={dailyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category}: ${percentage}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
              >
                {dailyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      case "weekly":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="#e5e7eb" />
              <YAxis stroke="#e5e7eb" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Legend />
              <Bar dataKey="present" fill="#3b82f6" name="Present" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" />
              <Bar dataKey="late" fill="#f59e0b" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        )

      case "monthly":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#e5e7eb" />
              <YAxis stroke="#e5e7eb" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#3b82f6" strokeWidth={3} name="Present" />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={3} name="Absent" />
              <Line type="monotone" dataKey="avgWorkHours" stroke="#10b981" strokeWidth={3} name="Avg Work Hours" />
            </LineChart>
          </ResponsiveContainer>
        )

      case "department":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={departmentData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#e5e7eb" />
              <YAxis dataKey="department" type="category" stroke="#e5e7eb" width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Legend />
              <Bar dataKey="present" fill="#3b82f6" name="Present" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation currentPage="Reports" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Reports</h1>
          <p className="text-gray-600">Generate and analyze attendance reports with visual insights</p>
        </div>

        {/* Report Controls */}
        <Card className="bg-white shadow-sm border rounded-md">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-gray-700 text-sm font-medium mb-2 block">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-white border text-gray-800 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Report</SelectItem>
                    <SelectItem value="weekly">Weekly Report</SelectItem>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                    <SelectItem value="department">Department Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-gray-700 text-sm font-medium mb-2 block">Date</label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-white border text-gray-800 hover:bg-gray-100 justify-start text-left font-normal shadow-sm"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date || new Date())
                        setDatePickerOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button onClick={exportReport} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Visualization */}
        <Card className="bg-white shadow-sm border rounded-md">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>{renderChart()}</CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border rounded-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">Total Records</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{attendanceData.length}</div>
              <p className="text-xs text-gray-500">Staff members tracked</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border rounded-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">Present Today</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {attendanceData.filter((r) => r.status === "Present").length}
              </div>
              <p className="text-xs text-gray-500">
                {attendanceData.length
                  ? `${((attendanceData.filter((r) => r.status === "Present").length / attendanceData.length) * 100).toFixed(1)}% attendance`
                  : "0% attendance"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border rounded-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">Late Arrivals</CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {attendanceData.filter((r) => r.lateBy !== "00:00" && r.lateBy !== "").length}
              </div>
              <p className="text-xs text-gray-500">Staff arriving late</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border rounded-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">Absent Today</CardTitle>
              <Users className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {attendanceData.filter((r) => r.status === "Absent").length}
              </div>
              <p className="text-xs text-gray-500">Staff members absent</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
