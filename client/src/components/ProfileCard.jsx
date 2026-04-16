import { HeartHandshake, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const fallbackAvatar =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIHJ4PSI4MCIgZmlsbD0iI0VGRUY3RiIvPgo8Y2lyY2xlIGN4PSI4MCIgY3k9IjYwIiByPSIzNSIgZmlsbD0iI0M2QzhDRiIvPgo8cGF0aCBkPSJNNjAgMTI0YzAtMTkuOTEgMTUuMDktMzAgMzAtMzBzMzAgMTAuMDkgMzAgMzB2MTljMCA2LjYyLTUuMzggMTItMTIgMTJINzJjLTYuNjIgMC0xMi01LjM4LTEyLTEyeiIgZmlsbD0iI0M2QzhDRiIvPgo8L3N2Zz4K'

const ProfileCard = ({ profile }) => {
  const handleShare = async () => {
    const shareUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/profile/${profile.username}`
        : `/profile/${profile.username}`
    const shareTitle = `${profile.name} - Bağış kampanyası`

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl })
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Paylaşım tamamlanamadı')
        }
      }
      return
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Profil bağlantısı kopyalandı')
      } catch (error) {
        console.error('Share fallback failed', error)
        toast.error('Bağlantı kopyalanamadı')
      }
      return
    }

    toast.error('Paylaşma özelliği bu cihazda desteklenmiyor')
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col items-center gap-4 text-center">
        <img
          src={profile.profilePic || fallbackAvatar}
          alt={`${profile.name} profil fotoğrafı`}
          className="h-32 w-32 rounded-full border border-slate-200 object-cover shadow-soft"
        />
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{profile.name}</h1>
          <p className="text-sm text-slate-500">@{profile.username}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to={`/profile/${profile.username}/donate`}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/25 transition hover:bg-slate-700"
          >
            <HeartHandshake className="h-4 w-4" />
            Destekle
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Share2 className="h-4 w-4" />
            Paylaş
          </button>
        </div>
      </header>

      <article className="mx-auto max-w-2xl rounded-3xl border border-slate-200/80 bg-white/95 p-6 text-center shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">Hakkında</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {profile.bio?.trim() || 'Henüz bir açıklama eklenmedi.'}
        </p>
      </article>
    </section>
  )
}

export default ProfileCard
