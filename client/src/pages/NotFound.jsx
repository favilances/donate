import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <main className="relative mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-4 py-24 text-center">
    <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 p-12 shadow-soft backdrop-blur">
      <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" aria-hidden />
      <div className="relative space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          404 hata
        </span>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-900/5 text-slate-900">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">İstediğin sayfayı bulamadık.</h1>
        <p className="mx-auto max-w-md text-sm leading-6 text-slate-600">
          URL değişmiş olabilir ya da sayfa artık yayında değil. Ana sayfaya dönerek kampanyaları keşfetmeye devam edebilirsin.
        </p>
        <div className="flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/25 transition hover:bg-slate-700"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  </main>
)

export default NotFound
