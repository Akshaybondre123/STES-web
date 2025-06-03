"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserCheck, UserX, Clock, LogOut, TrendingUp, BarChart3 } from "lucide-react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
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
  campus?: string
}

function HomePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [searchName, setSearchName] = useState("")
  const [stats, setStats] = useState({
    totalStaff: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    earlyPunchOut: 0,
  })

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem("attendanceData")
    if (savedData) {
      const data = JSON.parse(savedData)
      setAttendanceData(data)
      calculateStats(data)
    }
  }, [])

  const calculateStats = (data: AttendanceRecord[]) => {
    const totalStaff = data.length

    // Count only "Present" status (not including "Present (No OutPunch)" or other variations)
    const presentToday = data.filter((record) => {
      const status = record.status?.toString().trim()
      return status === "Present"
    }).length

    // Simple logic: Absent = Total Staff - Present Staff
    const absentToday = totalStaff - presentToday

    // Count late arrivals (those with LateBy time)
    const lateToday = data.filter((record) => {
      const lateBy = record.lateBy?.toString().trim()
      return lateBy && lateBy !== "00:00" && lateBy !== "" && lateBy !== "0" && lateBy !== "00:00:00"
    }).length

    // Count early punch-outs
    const earlyPunchOut = data.filter((record) => {
      const earlyGoingBy = record.earlyGoingBy?.toString().trim()
      return (
        earlyGoingBy &&
        earlyGoingBy !== "00:00" &&
        earlyGoingBy !== "" &&
        earlyGoingBy !== "0" &&
        earlyGoingBy !== "00:00:00"
      )
    }).length

    setStats({
      totalStaff,
      presentToday,
      absentToday,
      lateToday,
      earlyPunchOut,
    })
  }

  const exportToPDF = () => {
    const filteredData = searchName
      ? attendanceData.filter((record) => record.name.toLowerCase().includes(searchName.toLowerCase()))
      : attendanceData

    // Create PDF content
    const pdfContent = `
STES Staff Attendance Report
Generated on: ${format(new Date(), "PPP")}
${searchName ? `Filtered by: ${searchName}` : "All Staff"}

Total Records: ${filteredData.length}

Staff Details:
${filteredData
  .map(
    (record, index) => `
${index + 1}. ${record.name} (${record.ecode})
   Status: ${record.status}
   In Time: ${record.actualInTime}
   Out Time: ${record.actualOutTime}
   Duration: ${record.workDuration}
   Campus: ${record.campus || "Not specified"}
   Late By: ${record.lateBy}
   `,
  )
  .join("")}

Summary:
- Total Staff: ${stats.totalStaff}
- Present Today: ${stats.presentToday}
- Absent Today: ${stats.absentToday}
- Late Today: ${stats.lateToday}
    `

    // Create PDF-like text file
    const blob = new Blob([pdfContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance-report-${searchName || "all"}-${format(new Date(), "yyyy-MM-dd")}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Simple CSS-based charts with temporary data
  const weeklyData = [
    { day: "Monday", value: 12, percentage: 60 },
    { day: "Tuesday", value: 19, percentage: 95 },
    { day: "Wednesday", value: 3, percentage: 15 },
    { day: "Thursday", value: 5, percentage: 25 },
    { day: "Friday", value: 2, percentage: 10 },
  ]

  const monthlyData = [
    { month: "Jan", value: 30, percentage: 30 },
    { month: "Feb", value: 45, percentage: 45 },
    { month: "Mar", value: 60, percentage: 60 },
    { month: "Apr", value: 75, percentage: 75 },
    { month: "May", value: 90, percentage: 90 },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navigation currentPage="Home" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Overall STES Attendance Summary</h1>
          <p className="text-gray-600">Real-time staff attendance monitoring and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.totalStaff}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">Present Today</CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.presentToday}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">Absent Today</CardTitle>
              <UserX className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.absentToday}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">Late Today</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{stats.lateToday}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">Early Punch-out</CardTitle>
              <LogOut className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{stats.earlyPunchOut}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-800">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalStaff > 0 ? Math.round((stats.presentToday / stats.totalStaff) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simple CSS Charts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance by Time Period</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Attendance Chart */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-500" />
                  Weekly Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="w-20 text-sm text-gray-600">{item.day}</div>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-6 relative">
                          <div
                            className="bg-cyan-400 h-6 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${item.percentage}%` }}
                          >
                            <span className="text-xs text-white font-medium">{item.value}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 text-sm text-gray-600 text-right">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-gray-500 text-sm">Weekly attendance visualization</div>
              </CardContent>
            </Card>

            {/* Monthly Attendance Chart */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Monthly Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="w-12 text-sm text-gray-600">{item.month}</div>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-6 relative">
                          <div
                            className="bg-purple-500 h-6 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${item.percentage}%` }}
                          >
                            <span className="text-xs text-white font-medium">{item.value}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 text-sm text-gray-600 text-right">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-gray-500 text-sm">Monthly attendance trend</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Attendance Distribution */}
        <div className="mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Attendance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{stats.presentToday || 69}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Present</h3>
                  <p className="text-gray-600">Staff members present today</p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{stats.absentToday || 2}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Absent</h3>
                  <p className="text-gray-600">Staff members absent today</p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{stats.lateToday || 19}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Late</h3>
                  <p className="text-gray-600">Staff members arriving late</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Controls Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Attendance Records */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">Attendance Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Select Institute:</Label>
                  <Select defaultValue="vadgaon">
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vadgaon">Vadgaon Campus</SelectItem>
                      <SelectItem value="lonavala">Lonavala Campus</SelectItem>
                      <SelectItem value="pune">Pune Campus</SelectItem>
                      <SelectItem value="nashik">Nashik Campus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Select Date:</Label>
                  <Input
                    type="date"
                    className="bg-white border-gray-300"
                    defaultValue={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Search by Staff Name:</Label>
                  <Input
                    placeholder="Enter staff name"
                    className="bg-white border-gray-300"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Export Options:</Label>
                  <div className="flex gap-2">
                    <Button onClick={exportToPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Export to PDF
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Export to Excel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Institute-wise Attendance */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">Institute-wise Attendance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Select Campus:</Label>
                  <Select defaultValue="lonavala">
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lonavala">Lonavala Campus</SelectItem>
                      <SelectItem value="vadgaon">Vadgaon Campus</SelectItem>
                      <SelectItem value="pune">Pune Campus</SelectItem>
                      <SelectItem value="nashik">Nashik Campus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Select Section:</Label>
                  <Select defaultValue="engineering">
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="architecture">Architecture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Select Institute:</Label>
                  <Select defaultValue="sit">
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sit">Sinhgad Institute of Technology</SelectItem>
                      <SelectItem value="scoe">Sinhgad College of Engineering</SelectItem>
                      <SelectItem value="sims">Sinhgad Institute of Management Studies</SelectItem>
                      <SelectItem value="scp">Sinhgad College of Pharmacy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Total Staff:</Label>
                    <Input value={stats.totalStaff} readOnly className="bg-gray-50 border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Present Today:</Label>
                    <Input value={stats.presentToday} readOnly className="bg-gray-50 border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Absent Today:</Label>
                    <Input value={stats.absentToday} readOnly className="bg-gray-50 border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Late Today:</Label>
                    <Input value={stats.lateToday} readOnly className="bg-gray-50 border-gray-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-800 font-medium mb-2">Computer Engineering</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">92%</div>
                  <p className="text-gray-600 text-sm">23/25 Present</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-800 font-medium mb-2">Mechanical Engineering</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">95%</div>
                  <p className="text-gray-600 text-sm">21/22 Present</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-800 font-medium mb-2">Civil Engineering</h3>
                  <div className="text-2xl font-bold text-yellow-600 mb-1">89%</div>
                  <p className="text-gray-600 text-sm">16/18 Present</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-800 font-medium mb-2">Electrical Engineering</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">90%</div>
                  <p className="text-gray-600 text-sm">18/20 Present</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance Records */}
        {attendanceData.length > 0 && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Recent Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-800">Name</th>
                      <th className="text-left py-2 text-gray-800">ECode</th>
                      <th className="text-left py-2 text-gray-800">Campus</th>
                      <th className="text-left py-2 text-gray-800">Status</th>
                      <th className="text-left py-2 text-gray-800">In Time</th>
                      <th className="text-left py-2 text-gray-800">Out Time</th>
                      <th className="text-left py-2 text-gray-800">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.slice(0, 10).map((record, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 text-gray-800">{record.name}</td>
                        <td className="py-2 text-gray-600">{record.ecode}</td>
                        <td className="py-2 text-gray-600">{record.campus || "Not specified"}</td>
                        <td className="py-2">
                          <Badge
                            variant={record.status?.toLowerCase().includes("present") ? "default" : "destructive"}
                            className={record.status?.toLowerCase().includes("present") ? "bg-green-600" : "bg-red-600"}
                          >
                            {record.status}
                          </Badge>
                        </td>
                        <td className="py-2 text-gray-600">{record.actualInTime}</td>
                        <td className="py-2 text-gray-600">{record.actualOutTime}</td>
                        <td className="py-2 text-gray-600">{record.workDuration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default function ProtectedHomePage() {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  )
}
