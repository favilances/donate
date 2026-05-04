import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Loader2, Sparkles, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchWalletSummary } from '../api/auth'
import useAuth from '../hooks/useAuth'
import { formatCurrency } from '../utils/format'

const Wallet = () => {
  const [summary, setSummary] = useState({ wallet: 0, donations: [] })
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(() => new Set())
  const { user } = useAuth()

  useEffect(() => {
    const loadWallet = async () => {
      setLoading(true)
      try {
        const data = await fetchWalletSummary()
        setSummary(data)
      } catch (error) {
        toast.error('Cüzdan bilgileri alınamadı')
      } finally {
        setLoading(false)
      }
    }

    loadWallet()
  }, [])

  const selectedCount = useMemo(() => selected.size, [selected])
  const hasSelection = selectedCount > 0

  const toggleDonation = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const clearSelection = () => setSelected(new Set())

  const openOverlay = () => {
    if (!hasSelection) {
      return
    }
    const ids = Array.from(selected)
    const search = new URLSearchParams({ ids: ids.join(',') })
    const overlayUrl = `/wallet/overlay?${search.toString()}`
    window.open(overlayUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          cüzdan özetin
        </span>
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Bağış akışını takip et ve bütçeni planla.</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Merhaba {user?.name?.split(' ')[0] ?? 'destekçi'}, bu bölümde gelen tüm destekleri tek bakışta görürsün. Rakamlar her
          yenilemede güncellenir.
        </p>
      </div>

      <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-soft backdrop-blur">
        <div className="relative px-8 pb-12 pt-12 text-white sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-700" aria-hidden />
          <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden />
          <div className="absolute -right-32 -bottom-24 h-64 w-64 rounded-full bg-white/15 blur-3xl" aria-hidden />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/70">toplam bakiye</p>
                  <p className="text-4xl font-semibold md:text-5xl">{formatCurrency(summary.wallet)}</p>
                </div>
              </div>
              <p className="max-w-xl text-sm text-white/80">
                Yeni bir destek geldiğinde toplam tutarın burada belirir. Aşağıdaki liste ise son katkıları sakin bir sırayla
                gösterir.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-white/80 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/60">Son 30 gün</p>
                  <p className="text-base font-semibold">
                    {formatCurrency(
                      summary.donations
                        .filter((donation) => {
                          const date = donation.date ? new Date(donation.date) : null
                          const diff = date ? (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24) : Infinity
                          return diff <= 30
                        })
                        .reduce((acc, donation) => acc + (donation.amount ?? 0), 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-8 pb-12 sm:px-10 lg:px-14">
          <header className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Son bağışlar</h2>
            <div className="flex items-center gap-3">
              {loading && (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> yükleniyor
                </span>
              )}
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 sm:flex">
                {hasSelection ? `${selectedCount} bağış seçildi` : 'Bağış seç' }
              </div>
            </div>
          </header>

          {!loading && summary.donations.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 text-sm text-slate-500 shadow-soft">
              Henüz bağış yapılmamış. Kampanyanı sosyal medyada paylaşarak ilk bağışını alabilirsin.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200/70 bg-white/95 px-5 py-4 text-xs text-slate-500 shadow-soft">
                <div className="flex items-center gap-2">
                  <span className="hidden rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600 sm:inline-flex">
                    {hasSelection ? `${selectedCount} seçili bağış` : 'Bağış seçmek için kartlara tıkla'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearSelection}
                    disabled={!hasSelection}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Seçimi temizle
                  </button>
                  <button
                    type="button"
                    onClick={openOverlay}
                    disabled={!hasSelection}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 font-semibold text-white shadow-sm shadow-slate-900/20 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    OBS görünümünü aç
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <ul className="space-y-3">
              {summary.donations.map((donation) => {
                const donationDate = donation.date ? new Date(donation.date) : null
                const formattedDate = donationDate
                  ? donationDate.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
                  : ''
                const isSelected = selected.has(donation.id)

                return (
                  <li
                    key={donation.id}
                    className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-sm shadow-soft transition-all duration-200 ${
                      isSelected
                        ? 'border-slate-900/70 bg-slate-900/90 text-white shadow-lg shadow-slate-900/40'
                        : 'border-slate-200/80 bg-white/90 text-slate-700 hover:border-slate-300'
                    }`}
                    onClick={() => toggleDonation(donation.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        toggleDonation(donation.id)
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold transition ${
                          isSelected ? 'border-white bg-white/20 text-white' : 'border-slate-300 bg-white text-slate-500'
                        }`}
                        aria-hidden
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                      <div className="flex flex-col">
                        <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {donation.fromUserName ? `${donation.fromUserName} bağışladı` : 'Anonim bağış'}
                        </span>
                        <span className={`text-xs uppercase tracking-wide ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {formatCurrency(donation.amount)}
                    </span>
                  </li>
                )
              })}
              </ul>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default Wallet
