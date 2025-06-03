"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Calendar } from "lucide-react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"

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

export default function AttendanceSummaryPage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  useEffect(() => {
    const savedData = localStorage.getItem("attendanceData")
    if (savedData) {
      const data = JSON.parse(savedData)
      setAttendanceData(data)
      setFilteredData(data)
    }
  }, [])

  useEffect(() => {
    let filtered = attendanceData

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.ecode.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status.toLowerCase() === statusFilter.toLowerCase())
    }

    setFilteredData(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, attendanceData])

  const totalPages = Math.ceil(filteredData.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const currentRecords = filteredData.slice(startIndex, endIndex)

  const exportToCSV = () => {
    const headers = [
      "SN",
      "ECode",
      "Name",
      "Shift",
      "Scheduled In",
      "Scheduled Out",
      "Actual In",
      "Actual Out",
      "Work Duration",
      "OT",
      "Total Duration",
      "Late By",
      "Early Going By",
      "Status",
      "Punch Record",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredData.map((record) =>
        [
          record.sn,
          record.ecode,
          `"${record.name}"`,
          record.shift,
          record.scheduledInTime,
          record.scheduledOutTime,
          record.actualInTime,
          record.actualOutTime,
          record.workDuration,
          record.ot,
          record.totalDuration,
          record.lateBy,
          record.earlyGoingBy,
          record.status,
          `"${record.punchRecord}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "attendance-summary.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation currentPage="Attendance Summary" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Summary</h1>
          <p className="text-gray-600">Detailed view of all staff attendance records</p>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-gray-800">Staff Attendance Records</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
                <Input
                  placeholder="Search by name or employee code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300 text-gray-800">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-800 font-medium">SN</th>
                    <th className="text-left py-3 text-gray-800 font-medium">ECode</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Name</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Shift</th>
                    <th className="text-left py-3 text-gray-800 font-medium">In Time</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Out Time</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Duration</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Late By</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-gray-600">{record.sn}</td>
                      <td className="py-3 text-gray-600 font-mono">{record.ecode}</td>
                      <td className="py-3 text-gray-800 font-medium">{record.name}</td>
                      <td className="py-3 text-gray-600">{record.shift}</td>
                      <td className="py-3 text-gray-600">{record.actualInTime}</td>
                      <td className="py-3 text-gray-600">{record.actualOutTime}</td>
                      <td className="py-3 text-gray-600">{record.workDuration}</td>
                      <td className="py-3 text-gray-600">{record.lateBy}</td>
                      <td className="py-3">
                        <Badge
                          variant={record.status === "Present" ? "default" : "destructive"}
                          className={
                            record.status === "Present"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }
                        >
                          {record.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-gray-600 text-sm">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} records
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-800 text-lg font-medium">No attendance records found</p>
                <p className="text-gray-600">Upload an XLSX file in the Muster section to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
