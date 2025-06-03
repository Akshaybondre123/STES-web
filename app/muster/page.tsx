"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as XLSX from "xlsx"

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
  campus: string
}

function MusterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [selectedCampus, setSelectedCampus] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (
        droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        droppedFile.name.endsWith(".xlsx")
      ) {
        setFile(droppedFile)
        setUploadStatus("idle")
      } else {
        setErrorMessage("Please upload only XLSX files")
        setUploadStatus("error")
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (
        selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.name.endsWith(".xlsx")
      ) {
        setFile(selectedFile)
        setUploadStatus("idle")
      } else {
        setErrorMessage("Please upload only XLSX files")
        setUploadStatus("error")
      }
    }
  }

  const processExcelFile = async (file: File): Promise<AttendanceRecord[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          // Skip header row and process data
          const records: AttendanceRecord[] = []
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[]
            if (row.length >= 15) {
              records.push({
                sn: row[0] || 0,
                ecode: row[1] || "",
                name: row[2] || "",
                shift: row[3] || "",
                scheduledInTime: row[4] || "",
                scheduledOutTime: row[5] || "",
                actualInTime: row[6] || "",
                actualOutTime: row[7] || "",
                workDuration: row[8] || "",
                ot: row[9] || "",
                totalDuration: row[10] || "",
                lateBy: row[11] || "",
                earlyGoingBy: row[12] || "",
                status: row[13] || "",
                punchRecord: row[14] || "",
                campus: selectedCampus,
              })
            }
          }
          resolve(records)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsArrayBuffer(file)
    })
  }

  const handleUpload = async () => {
    if (!file || !selectedCampus) {
      setErrorMessage("Please select a campus and upload a file")
      setUploadStatus("error")
      return
    }

    setUploading(true)
    setUploadStatus("idle")

    try {
      const attendanceData = await processExcelFile(file)

      // Get existing data and merge with new data
      const existingData = localStorage.getItem("attendanceData")
      const allData = existingData ? JSON.parse(existingData) : []

      // Filter out existing data for the same campus to avoid duplicates
      const filteredData = allData.filter((record: AttendanceRecord) => record.campus !== selectedCampus)
      const mergedData = [...filteredData, ...attendanceData]

      // Save to localStorage
      localStorage.setItem("attendanceData", JSON.stringify(mergedData))

      setUploadStatus("success")

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("Error processing file:", error)
      setErrorMessage("Error processing the Excel file. Please check the format.")
      setUploadStatus("error")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation currentPage="Muster" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Staff Muster Upload</h1>
          <p className="text-gray-600">Upload XLSX attendance files to update the dashboard</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Upload Attendance File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campus Selection */}
              <div className="space-y-2">
                <Label htmlFor="campus" className="text-gray-800">
                  Select Campus
                </Label>
                <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-700">
                    <SelectValue placeholder="Choose campus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vadgaon">Vadgaon Campus</SelectItem>
                    <SelectItem value="lonavala">Lonavala Campus</SelectItem>
                    <SelectItem value="pune">Pune Campus</SelectItem>
                    <SelectItem value="nashik">Nashik Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-purple-400 bg-purple-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-gray-800 font-medium">Drag and drop your XLSX file here, or click to browse</p>
                  <p className="text-gray-600 text-sm">Supported format: .xlsx files only</p>
                </div>

                <div className="mt-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Browse Files
                  </Button>
                </div>
              </div>

              {/* File Info */}
              {file && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-gray-800 font-medium">{file.name}</p>
                      <p className="text-gray-600 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {uploadStatus === "success" && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    File uploaded successfully for {selectedCampus} campus! Redirecting to dashboard...
                  </AlertDescription>
                </Alert>
              )}

              {uploadStatus === "error" && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!file || !selectedCampus || uploading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Processing..." : "Upload and Process File"}
              </Button>

              {/* File Format Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-gray-800 font-medium mb-2">Expected File Format:</h3>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>
                    Columns: SN, ECode, Name, Shift, S.In Time, S.Out Time, A.InTime, A.Out Time, Work Dur, OT, Tot.Dur,
                    LatBy, EarlyGoingBy, Status, Punch Record
                  </p>
                  <p>
                    Example: 1, 123, Udawant Amol Pandharinath, TH, 08:00, 17:00, 08:00, 17:05, 9:05, 00:00, 9:05,
                    00:00, 00:00, Present, 08:00:in(SIT1),17:05:out(SIT2)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function ProtectedMusterPage() {
  return (
    <AuthGuard>
      <MusterPage />
    </AuthGuard>
  )
}
