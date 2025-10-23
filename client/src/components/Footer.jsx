import { Link } from 'react-router-dom'

const legalLinks = [
  { label: 'Hizmet Şartları', to: '/legal/terms' },
  { label: 'Gizlilik Politikası', to: '/legal/privacy' },
  { label: 'Çerez Politikası', to: '/legal/cookies' },
]

const Footer = () => (
  <footer className="relative z-10 mt-auto border-t border-slate-200/80 bg-white/85 backdrop-blur">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
        {legalLinks.map(({ label, to }) => (
          <Link key={label} to={to} className="transition hover:text-slate-900">
            {label}
          </Link>
        ))}
      </nav>
      <p className="text-xs text-slate-500">© 2025 noirLang</p>
    </div>
  </footer>
)

export default Footer
