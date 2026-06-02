import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Map, 
  Brain, 
  ClipboardCheck, 
  TrendingUp,
  Settings,
  Leaf,
  Sprout,
  BookOpen,
  Bell,
  FileText,
  Cloud
} from 'lucide-react'

const menuItems = [
  { 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    label: 'Panel Principal'
  },
  // 1. Configuración base: qué cultivos y variedades existen
  { 
    path: '/catalogos', 
    icon: BookOpen, 
    label: 'Catálogos'
  },
  // 2. Dónde se va a producir
  { 
    path: '/gestion/parcelas', 
    icon: Map, 
    label: 'Gestión de Parcelas'
  },
  // 3. Qué se siembra en esos lotes
  { 
    path: '/gestion/siembras', 
    icon: Sprout, 
    label: 'Siembras'
  },
  // 4. Cosechas
  { 
    path: '/gestion/cosechas', 
    icon: ClipboardCheck, 
    label: 'Registro de Cosecha'
  },
  // 6. Predicciones ML
  { 
    path: '/mlclima/predicciones', 
    icon: Brain, 
    label: 'Predicciones ML'
  },
  // 7. Análisis post-cosecha
  { 
    path: '/eficiencia', 
    icon: TrendingUp, 
    label: 'Eficiencia Operativa'
  },
  // 8. Centro de Alertas
  { 
    path: '/alertas', 
    icon: Bell, 
    label: 'Centro de Alertas'
  },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-14 px-6 flex items-center border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-base">AgroPredict</h1>
            <p className="text-gray-500 text-[10px] font-medium uppercase tracking-wide">AI Precision</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Settings */}
        <NavLink
          to="/configuracion"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
              <span className="text-sm font-medium">Configuración</span>
            </>
          )}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-700 font-semibold text-sm">IH</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Ing. Hernandez</p>
            <p className="text-xs text-gray-500 truncate">Jefe de Operaciones</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
