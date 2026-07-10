'use client'

import { useSession, signIn } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import {
  User,
  Package,
  MapPin,
  Heart,
  Menu,
  X,
  LogIn,
} from 'lucide-react'

const navItems = [
  { name: 'Perfil', href: '/cuenta', icon: User, exact: true },
  { name: 'Pedidos', href: '/cuenta/pedidos', icon: Package },
  { name: 'Direcciones', href: '/cuenta/direcciones', icon: MapPin },
  { name: 'Favoritos', href: '/cuenta/favoritos', icon: Heart },
]

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href
  return pathname.startsWith(href)
}

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#E35205] border-t-transparent rounded-full" />
      </div>
    )
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E35205]/10 flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-7 w-7 text-[#E35205]" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Inicia Sesión</h1>
          <p className="text-sm text-[#888] mb-6">
            Accede a tu cuenta para ver tus pedidos, gestionar tus direcciones y más.
          </p>
          <button
            onClick={() => signIn()}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, #E35205, #CC3300)' }}
          >
            Iniciar Sesión
          </button>
          <p className="text-xs text-[#555] mt-4">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-[#E35205] hover:underline font-medium">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[220px] bg-[#0D0D0D] border-r border-[#1A1A1A] pt-14 lg:pt-0 transition-transform lg:transition-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4">
          {/* User info in sidebar */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1A1A1A]">
            <div className="w-10 h-10 rounded-full bg-[#E35205]/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-[#E35205]">
                {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {session.user.name || 'Usuario'}
              </p>
              <p className="text-[11px] text-[#666] truncate">{session.user.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#E35205]/10 text-[#E35205] border border-[#E35205]/20'
                      : 'text-[#888] hover:text-white hover:bg-[#1A1A1A] border border-transparent'
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg bg-[#1A1A1A] text-[#888] hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </aside>

      {/* Mobile top tab bar */}
      <div className="lg:hidden fixed top-14 left-0 right-0 z-30 bg-[#111] border-b border-[#1A1A1A]">
        <div className="flex overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  active
                    ? 'text-[#E35205] border-[#E35205]'
                    : 'text-[#666] border-transparent hover:text-[#CCC]'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-6 lg:pt-6 pt-28">
        {/* Mobile hamburger (only shows when sidebar is closed) */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden mb-4 p-2 rounded-lg bg-[#1A1A1A] text-[#888] hover:text-white transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        {children}
      </main>
    </div>
  )
}