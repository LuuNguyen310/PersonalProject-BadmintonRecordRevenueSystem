import { LayoutDashboard, Package, CreditCard, ShieldIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'DASHBOARD',
      icon: LayoutDashboard,
      onClick: () => setCurrentPage('dashboard'),
    },
    {
      id: 'products',
      label: 'PRODUCT CATALOG',
      icon: Package,
      onClick: () => setCurrentPage('products'),
    },
    {
      id: 'payment-audit',
      label: 'PAYMENT MANAGING',
      icon: CreditCard,
      onClick: () => setCurrentPage('payment-audit'),
    },
    {
      id: 'testing',
      label: 'TESTING',
      icon: CreditCard,
      onClick: () => setCurrentPage('testing'),
    },
  ]

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center">
          <ShieldIcon className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <div className="text-cyan-500 font-bold text-sm">ADM-01</div>
          <div className="text-slate-400 text-xs">CIRCUIT OVERSIGHT</div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-4 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`justify-start gap-3 h-auto py-3 px-4 ${isActive
                  ? 'bg-cyan-500 bg-opacity-20 text-cyan-500 hover:bg-cyan-500 hover:bg-opacity-30'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                }`}
              onClick={item.onClick}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold tracking-wider">{item.label}</span>
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-800 text-slate-500 text-xs">
        <p>© 2024 Circuit System</p>
      </div>
    </div>
  )
}
