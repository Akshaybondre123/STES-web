import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">STES</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                STES STAFF ATTENDANCE MONITORING DASHBOARD
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="S.S.Mane" />
              <AvatarFallback className="bg-purple-600 text-white">SM</AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-right">
              <p className="text-gray-800 font-medium">S.S.Mane</p>
              <p className="text-gray-600 text-sm">[ Director STES ]</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
