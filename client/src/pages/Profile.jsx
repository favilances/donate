import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchProfileByUsername } from '../api/auth'
import ProfileCard from '../components/ProfileCard'

const Profile = () => {
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
          <Loader2 className="h-4 w-4 animate-spin" /> Profil yükleniyor
        </span>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-red-200/80 bg-white/80 p-8 text-center text-red-500 shadow-soft">
          Aradığın kullanıcı profili bulunamadı.
        </div>
      </main>
    )
  }

  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
      <ProfileCard profile={profile} />
    </main>
  )
}

export default Profile
