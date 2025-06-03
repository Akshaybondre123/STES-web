"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, GraduationCap, Award, MapPin, Phone, Mail, Globe } from "lucide-react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"

export default function InstituteOverviewPage() {
  const departments = [
    { name: "Computer Engineering", hod: "Dr. A.K. Sharma", staff: 25, students: 240 },
    { name: "Mechanical Engineering", hod: "Prof. R.S. Patil", staff: 22, students: 180 },
    { name: "Civil Engineering", hod: "Dr. M.P. Joshi", staff: 18, students: 160 },
    { name: "Electrical Engineering", hod: "Prof. S.D. Kulkarni", staff: 20, students: 200 },
    { name: "Electronics & Telecom", hod: "Dr. V.N. Desai", staff: 15, students: 120 },
  ]

  const achievements = [
    { title: "NAAC A+ Accreditation", year: "2023", description: "Received highest grade from NAAC" },
    { title: "Best Engineering College Award", year: "2022", description: "State level recognition" },
    { title: "Research Excellence Award", year: "2021", description: "For outstanding research contributions" },
    { title: "Industry Partnership Award", year: "2020", description: "Excellence in industry collaboration" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation currentPage="Institute Overview" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Institute Overview</h1>
          <p className="text-gray-600">Comprehensive information about STES institution</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Institute Info */}
          <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Building className="h-5 w-5" />
                About STES
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Sinhgad Technical Education Society (STES) is a premier educational institution dedicated to providing
                quality technical education. Established with a vision to create competent engineers and technologists,
                STES has been at the forefront of engineering education for over two decades.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our institution is committed to academic excellence, research innovation, and industry collaboration. We
                strive to develop well-rounded professionals who can contribute meaningfully to society and the global
                technology landscape.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">100+</div>
                  <div className="text-gray-600 text-sm">Faculty Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">900+</div>
                  <div className="text-gray-600 text-sm">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">5</div>
                  <div className="text-gray-600 text-sm">Departments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">25+</div>
                  <div className="text-gray-600 text-sm">Years of Excellence</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-800 font-medium">Address</p>
                  <p className="text-gray-600 text-sm">
                    STES Campus, Pune-Bangalore Highway,
                    <br />
                    Pune, Maharashtra 411041
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-gray-800 font-medium">Phone</p>
                  <p className="text-gray-600 text-sm">+91 20 2792 7000</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-gray-800 font-medium">Email</p>
                  <p className="text-gray-600 text-sm">info@stes.edu.in</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-gray-800 font-medium">Website</p>
                  <p className="text-gray-600 text-sm">www.stes.edu.in</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Departments */}
        <Card className="bg-white border-gray-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-800 font-semibold mb-2">{dept.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">HOD: {dept.hod}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Staff: {dept.staff}</span>
                    <span className="text-gray-600">Students: {dept.students}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements & Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-800 font-semibold">{achievement.title}</h3>
                    <Badge variant="outline" className="border-gray-400 text-gray-600">
                      {achievement.year}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
