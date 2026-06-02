import { HeartHandshake, Link2, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fallbackAvatar } from '../utils/avatar'

const ProfileCard = ({ profile }) => {
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/profile/${profile.username}`
      : `/profile/${profile.username}`
  const shareTitle = `${profile.name} - Bağış kampanyası`
  const shareText = `${profile.name} için bağış kampanyası! Destek olmak için:`

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl })
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Paylaşım tamamlanamadı')
        }
      }
      return
    }
    handleCopyLink()
  }

  const handleCopyLink = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Profil bağlantısı kopyalandı')
      } catch (error) {
        toast.error('Bağlantı kopyalanamadı')
      }
    }
  }

  const shareTwitter = () => {
    const text = encodeURIComponent(`${shareText} ${shareUrl}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener')
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${shareText} ${shareUrl}`)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener')
  }

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener')
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
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Share2 className="h-4 w-4" />
            Paylaş
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={shareTwitter}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-sky-50 hover:text-sky-600"
          >
            𝕏 Twitter
          </button>
          <button
            type="button"
            onClick={shareWhatsApp}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-emerald-50 hover:text-emerald-600"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={shareFacebook}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-blue-50 hover:text-blue-600"
          >
            Facebook
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
          >
            <Link2 className="h-3.5 w-3.5" />
            Bağlantı kopyala
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
