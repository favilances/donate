import { Search, Loader2, User, HeartHandshake, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchUsers } from '../api/auth'
import { fallbackAvatar } from '../utils/avatar'

const Discover = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState(false)
  const limit = 20

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSearched(false)
      setPage(1)
      setTotal(0)
      setError(false)
      return
    }

    setPage(1)
  }, [query])

  useEffect(() => {
    if (!query.trim()) return

    const delay = setTimeout(async () => {
      setLoading(true)
      setError(false)
      try {
        const data = await searchUsers(query, page)
        setResults(data.users ?? [])
        setTotal(data.total ?? 0)
        setSearched(true)
      } catch (error) {
        console.error('search error', error)
        setResults([])
        setError(true)
        setSearched(true)
      } finally {
        setLoading(false)
      }
    }, query ? 300 : 0)

    return () => clearTimeout(delay)
  }, [query, page])

  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          keşfet
        </span>
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Yaratıcıları keşfet</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          İlham veren kişileri bul, hikayelerini keşfet ve destek ol.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="İsim veya kullanıcı adı ile ara…"
          className="w-full rounded-3xl border border-slate-200 bg-white/95 py-4 pl-14 pr-6 text-sm shadow-soft outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-accent/10"
          autoFocus
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Aranıyor…
        </div>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-12 text-center shadow-soft">
          <User className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-sm text-slate-500">Sonuç bulunamadı.</p>
          <p className="mt-1 text-xs text-slate-400">Farklı bir arama terimi dene.</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-3xl border border-red-200/80 bg-red-50 p-12 text-center shadow-soft">
          <p className="text-sm text-red-500">Arama sırasında bir hata oluştu. Lütfen tekrar dene.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.username}`}
              className="group flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-brand"
            >
              <img
                src={user.profilePic || fallbackAvatar}
                alt={user.name}
                className="h-16 w-16 flex-shrink-0 rounded-full border border-slate-200 object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold text-slate-900">{user.name}</h3>
                <p className="truncate text-xs text-slate-500">@{user.username}</p>
                {user.bio && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {user.bio}
                  </p>
                )}
              </div>
              <HeartHandshake className="h-5 w-5 flex-shrink-0 text-slate-300 transition group-hover:text-accent" />
            </Link>
          ))}
        </div>
      )}

      {results.length > 0 && total > limit && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Geri
          </button>
          <span className="text-sm text-slate-500">
            Sayfa {page} / {Math.ceil(total / limit)}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / limit)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            İleri <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {!loading && !searched && (
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-12 text-center shadow-soft">
          <Search className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-sm text-slate-500">Yukarıya bir isim yazarak aramaya başla.</p>
        </div>
      )}
    </main>
  )
}

export default Discover