"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavigationProps {
  currentPage: string
}

export function Navigation({ currentPage }: NavigationProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("stes_logged_in")
    localStorage.removeItem("stes_current_user")
    router.push("/login")
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Muster", href: "/muster" },
    { name: "Attendance Summary", href: "/attendance-summary" },
    { name: "Institute Overview", href: "/institute-overview" },
    { name: "Reports", href: "/reports" },
    { name: "Settings", href: "/settings" },
  ]

  return (
    <nav className="bg-gray-100 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8 overflow-x-auto py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "whitespace-nowrap text-sm font-medium transition-colors hover:text-purple-600",
                  currentPage === item.name
                    ? "text-purple-600 border-b-2 border-purple-600 pb-1"
                    : "text-gray-600 hover:text-purple-600",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
