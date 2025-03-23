"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const isAuthPage = pathname.startsWith("/auth")

  if (isAuthPage) return null

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              ClassroomAI
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <NavLink href="/dashboard" onClick={closeMenu}>
                  Dashboard
                </NavLink>
                <NavLink href="/assignments" onClick={closeMenu}>
                  Assignments
                </NavLink>
                {user.role === "teacher" && (
                  <NavLink href="/analytics" onClick={closeMenu}>
                    Analytics
                  </NavLink>
                )}
                <Button variant="ghost" size="sm" onClick={signOut} className="flex items-center gap-1">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/about" onClick={closeMenu}>
                  About
                </NavLink>
                <NavLink href="/features" onClick={closeMenu}>
                  Features
                </NavLink>
                <Button asChild variant="default" size="sm">
                  <Link href="/auth/login">Login</Link>
                </Button>
              </>
            )}
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="ml-2" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <div className="flex flex-col space-y-3">
            {user ? (
              <>
                <NavLink href="/dashboard" onClick={closeMenu}>
                  Dashboard
                </NavLink>
                <NavLink href="/assignments" onClick={closeMenu}>
                  Assignments
                </NavLink>
                {user.role === "teacher" && (
                  <NavLink href="/analytics" onClick={closeMenu}>
                    Analytics
                  </NavLink>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOut()
                    closeMenu()
                  }}
                  className="flex items-center justify-start gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/about" onClick={closeMenu}>
                  About
                </NavLink>
                <NavLink href="/features" onClick={closeMenu}>
                  Features
                </NavLink>
                <Button asChild variant="default" size="sm" className="w-full justify-center">
                  <Link href="/auth/login" onClick={closeMenu}>
                    Login
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children, onClick }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        isActive ? "text-foreground font-semibold" : "text-muted-foreground"
      }`}
    >
      {children}
    </Link>
  )
}

