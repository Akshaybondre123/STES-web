"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Database, Trash2 } from "lucide-react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  })

  const [profile, setProfile] = useState({
    name: "S.S.Mane",
    email: "director@stes.edu.in",
    phone: "+91 20 2792 7000",
    designation: "Director STES",
  })

  const [showAlert, setShowAlert] = useState(false)

  const handleSaveProfile = () => {
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all attendance data? This action cannot be undone.")) {
      localStorage.removeItem("attendanceData")
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation currentPage="Settings" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-500">Manage your account and application preferences</p>
        </div>

        {showAlert && (
          <Alert className="mb-6 bg-green-600/20 border-green-600/30">
            <AlertDescription className="text-green-900">Settings saved successfully!</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="bg-gray-100 border-gray-200 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="bg-gray-100 border-gray-200 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-900">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="bg-gray-100 border-gray-200 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation" className="text-gray-900">
                  Designation
                </Label>
                <Input
                  id="designation"
                  value={profile.designation}
                  onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                  className="bg-gray-100 border-gray-200 text-gray-900"
                />
              </div>

              <Button onClick={handleSaveProfile} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive attendance alerts via email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>

              <Separator className="bg-gray-200" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Browser push notifications</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>

              <Separator className="bg-gray-200" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Text message alerts</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-gray-900">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  className="bg-gray-100 border-gray-200 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-gray-900">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  className="bg-gray-100 border-gray-200 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-900">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  className="bg-gray-100 border-gray-200 text-gray-900"
                />
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Update Password</Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-gray-900 font-medium">Export Data</h3>
                <p className="text-gray-500 text-sm">Download all attendance data as CSV</p>
                <Button
                  variant="outline"
                  className="w-full bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200"
                >
                  Export All Data
                </Button>
              </div>

              <Separator className="bg-gray-200" />

              <div className="space-y-2">
                <h3 className="text-gray-900 font-medium">Clear Data</h3>
                <p className="text-gray-500 text-sm">Remove all attendance records from the system</p>
                <Button
                  onClick={clearAllData}
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
