import { Search, Sun, Bell } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-white border-b border-gray-200 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar parcelas, cultivos o datos..."
              className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Weather */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
            <Sun className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">24°C</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Ing. Hernandez</p>
              <p className="text-xs text-gray-500">Jefe de Operaciones</p>
            </div>
            <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">IH</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
