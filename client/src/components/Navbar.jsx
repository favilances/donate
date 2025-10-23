import { useEffect, useRef, useState } from 'react'
import { ChevronDown, HeartHandshake, LogOut } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const linkBase =
  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200'

const navLinkClass = ({ isActive }) =>
  `${linkBase} ${
    isActive
      ? 'bg-charcoal text-porcelain shadow-sm shadow-slate-900/10'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const displayName = user?.name || user?.username || 'Misafir'
  const avatarFallback = displayName.trim().charAt(0)?.toUpperCase() ?? 'M'
  const avatarSrc = user?.profilePic

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <HeartHandshake className="h-5 w-5" />
          </span>
          bağışla
        </Link>
        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-border/70 bg-white px-3 py-1.5 text-left shadow-sm shadow-slate-900/5 transition hover:border-slate-300"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <div className="hidden flex-col text-xs leading-tight text-slate-500 md:flex">
                  <span className="font-semibold text-slate-900">{displayName}</span>
                  <span>Profil menüsü</span>
                </div>
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={`${displayName} profil fotoğrafı`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white text-sm font-semibold">
                    {avatarFallback}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-50 mt-3 w-52 rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-xl shadow-slate-900/10 backdrop-blur">
                  <NavLink
                    to={`/profile/${user?.username}`}
                    className={({ isActive }) => `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-900 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Profilim
                  </NavLink>
                  <NavLink
                    to="/wallet"
                    className={({ isActive }) => `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-900 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Cüzdan
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-900 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Ayarlar
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      handleLogout()
                    }}
                    className="mt-1 flex w-full items-center justify-between gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-900/20 transition hover:bg-slate-700"
                  >
                    Çıkış
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className={navLinkClass}>
                Giriş
              </NavLink>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-900/20 transition hover:bg-slate-700"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
