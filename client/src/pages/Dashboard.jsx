import { useEffect, useState } from 'react'
import { ImageDown, Loader2, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateProfile } from '../api/auth'
import useAuth from '../hooks/useAuth'

const Dashboard = () => {
  const { user, logout, refreshUser } = useAuth()
  const [profile, setProfile] = useState({ bio: '', profilePic: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      try {
        const freshUser = await refreshUser()
        setProfile({ bio: freshUser.bio ?? '', profilePic: freshUser.profilePic ?? '' })
      } catch (error) {
        toast.error('Profil bilgileri alınamadı. Lütfen tekrar giriş yapın.')
        logout()
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [logout])

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profilePic: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await updateProfile(profile)
      await refreshUser()
      toast.success('Profil güncellendi')
    } catch (error) {
      toast.error('Profil güncellenemedi')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <span className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-500 shadow-soft">
          <Loader2 className="h-4 w-4 animate-spin" /> Profil bilgileri yükleniyor
        </span>
      </main>
    )
  }

  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          profil ayarları
        </span>
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Kendini anlat, profilini parlat.</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Merhaba {user?.name?.split(' ')[0] ?? 'bağışçı'}, aşağıdaki alanlardan profil kartında görünen biyografini ve görselini
          güncelleyebilirsin. Değişiklikler kaydedildikten sonra herkese açık profilinde anında görüntülenir.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-10 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-soft backdrop-blur md:grid-cols-[1.2fr,0.8fr] lg:p-12"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Biyografi</h2>
              <p className="text-xs uppercase tracking-wide text-slate-400">3-4 cümlede hikayeni paylaş</p>
            </div>
          </div>
          <textarea
            name="bio"
            rows={7}
            value={profile.bio}
            onChange={handleChange}
            className="min-h-[160px] w-full rounded-3xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-accent/10"
            placeholder="Kampanyanın hedefini, bağışların nasıl kullanılacağını ve destekçilerin neden sana güvenmesi gerektiğini anlat."
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>Maksimum 600 karakter önerilir.</span>
            <span>{profile.bio.length}/600</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/25 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Kaydediliyor…' : 'Değişiklikleri kaydet' }
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/5 text-slate-900">
              <ImageDown className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Profil görseli</h2>
              <p className="text-xs uppercase tracking-wide text-slate-400">1:1 oranlı önerilir</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-soft">
            <div className="flex items-center gap-6">
              <img
                src={
                  profile.profilePic ||
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSI1MCIgZmlsbD0iI0VGRUY3RiIvPgo8cGF0aCBkPSJNNTAgNTZhMjQgMjQgMCAxIDAgMC00OCAyNCAyNCAwIDAgMCAwIDQ4em0wIDE0Yy0yMi4wOCAwLTQwIDEyLjIxLTQwIDI3LjI4YTYgNiAwIDAgMCA2IDZoNjguYTYgNiAwIDAgMCA2LTZjMC0xNS4wNy0xNy45Mi0yNy4yOC00MC0yNy4yOFoiIGZpbGw9IiNDNkM4Q0YiLz4KPC9zdmc+Cg=='
                }
                alt="Profil"
                className="h-24 w-24 rounded-3xl object-cover shadow-soft"
              />
              <div className="space-y-2 text-sm text-slate-600">
                <p>Görselini buradan yükleyebilir ya da aşağıya bir bağlantı ekleyerek dilediğin an değiştirebilirsin.</p>
                <label className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  Yeni görsel yükle
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Alternatif URL</label>
              <input
                type="text"
                name="profilePic"
                value={profile.profilePic}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-accent/10"
                placeholder="https://ornek.com/avatar.jpg"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 text-sm text-slate-500 shadow-soft">
            <p className="font-semibold text-slate-900">İpucu</p>
            <p className="mt-2">Kare boyutlu ve yüksek çözünürlüklü görseller profil kartında en şık sonucu verir.</p>
          </div>
        </div>
      </form>
    </main>
  )
}

export default Dashboard
