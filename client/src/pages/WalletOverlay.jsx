import { useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchSelectedDonations } from '../api/auth'
import { formatCurrency } from '../utils/format'

const AnimatedBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    <div className="absolute -left-24 top-0 h-64 w-64 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-accent/30 blur-3xl" />
    <div className="absolute bottom-[-120px] right-[-120px] h-80 w-80 animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-white/20 blur-3xl" />
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-800" />
  </div>
)

const WalletOverlay = () => {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [donations, setDonations] = useState([])

  const idsParam = searchParams.get('ids')
  const ids = useMemo(
    () =>
      (idsParam || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    [idsParam],
  )

  useEffect(() => {
    const loadDonations = async () => {
      if (ids.length === 0) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const { donations: selectedDonations } = await fetchSelectedDonations(ids)
        setDonations(selectedDonations ?? [])
      } catch (error) {
        console.error('selected donations error', error)
        toast.error('Seçili bağışlar yüklenemedi')
      } finally {
        setLoading(false)
      }
    }

    loadDonations()
  }, [ids])

  const totalAmount = useMemo(
    () => donations.reduce((sum, donation) => sum + (donation.amount ?? 0), 0),
    [donations],
  )

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 text-white">
      <AnimatedBackground />
      <main className="relative z-10 flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-3xl border border-white/20 bg-white/10 px-6 py-4 text-sm text-white/80">
            <Loader2 className="h-5 w-5 animate-spin" /> Bağışlar yükleniyor
          </div>
        ) : donations.length === 0 ? (
          <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-8 text-sm text-white/80 text-center">
            Seçili bağış yok.
          </div>
        ) : (
          <ul className="space-y-4">
            {donations.map((donation, index) => (
              <li
                key={donation.id}
                className="flex items-center justify-between gap-6 overflow-hidden rounded-3xl border border-white/20 bg-white/10 px-6 py-5 text-white shadow-xl shadow-black/30 transition-transform duration-300 hover:-translate-y-1"
                style={{ animation: `fadeInUp 0.4s ease forwards`, animationDelay: `${index * 0.08}s`, opacity: 0 }}
              >
                <span className="text-2xl font-semibold">
                  {donation.fromUserName ? donation.fromUserName : 'Anonim bağış'}
                </span>
                <span className="text-3xl font-bold tracking-tight">{formatCurrency(donation.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </main>

      <style>{`
        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default WalletOverlay
