import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchProfileByUsername } from '../api/auth'
import DonationForm from '../components/DonationForm'

const fallbackAvatar =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIHJ4PSI4MCIgZmlsbD0iI0VGRUY3RiIvPgo8Y2lyY2xlIGN4PSI4MCIgY3k9IjYwIiByPSIzNSIgZmlsbD0iI0M2QzhDRiIvPgo8cGF0aCBkPSJNNjAgMTI0YzAtMTkuOTEgMTUuMDktMzAgMzAtMzBzMzAgMTAuMDkgMzAgMzB2MTljMCA2LjYyLTUuMzggMTItMTIgMTJINzJjLTYuNjIgMC0xMi01LjM4LTEyLTEyeiIgZmlsbD0iI0M2QzhDRiIvPgo8L3N2Zz4K'

const Donate = () => {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    setLoading(true)
    try {
      const { user } = await fetchProfileByUsername(username)
      setProfile(user)
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Profil bulunamadı')
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <span className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-500 shadow-soft">
          <Loader2 className="h-4 w-4 animate-spin" /> Kullanıcı bilgileri yükleniyor
        </span>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-red-200/80 bg-white/80 p-8 text-center text-red-500 shadow-soft">
          Bağış yapmak istediğin kullanıcı bulunamadı.
        </div>
      </main>
    )
  }

  return (
    <main className="relative mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        to={`/profile/${username}`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" /> Profil sayfasına dön
      </Link>

      <section className="space-y-8 rounded-[32px] border border-slate-200/80 bg-white/95 p-10 shadow-soft">
        <header className="flex flex-col items-center gap-3 text-center">
          <img
            src={profile.profilePic || fallbackAvatar}
            alt={`${profile.name} profil fotoğrafı`}
            className="h-24 w-24 rounded-full border border-slate-200 object-cover shadow-soft"
          />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{profile.name} için bağış yap</h1>
            <p className="text-sm text-slate-500">@{profile.username}</p>
          </div>
        </header>

        <DonationForm recipientUsername={profile.username} />
      </section>
    </main>
  )
}

export default Donate
