import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'

const initialState = {
  name: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
}

const Register = () => {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Şifreler eşleşmiyor')
      return
    }

    setLoading(true)
    try {
      await register({
        name: form.name,
        email: form.email,
        username: form.username,
        password: form.password,
      })
      toast.success('Hesap oluşturuldu!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Kayıt işlemi başarısız oldu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 rounded-3xl border border-slate-200/80 bg-white/80 p-10 shadow-soft backdrop-blur-xl md:grid-cols-[1.05fr,0.95fr] lg:p-14">
        <div className="flex flex-col justify-between space-y-10">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              hemen katıl
            </span>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              Hikayeni paylaş, destekçilerini bir araya getir.
            </h1>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Kısa bir formu doldurarak kişisel bağış sayfanı aç ve topluluğunun yanında yer al.
            </p>
          </div>
          <ul className="space-y-4 text-sm text-slate-600">
            {[
              'Dakikalar içinde profilini hazırla',
              'Hikayeni dilediğin gibi paylaş',
              'Desteklerini tek yerden takip et',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white via-white/70 to-white/20" aria-hidden />
          <form
            onSubmit={handleSubmit}
            className="relative space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-soft backdrop-blur"
          >
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Hesap oluştur</h2>
              <p className="mt-1 text-sm text-slate-500">
                Zaten kayıtlı mısın?{' '}
                <Link to="/login" className="font-semibold text-slate-900 underline">
                  Giriş yap
                </Link>
              </p>
            </div>

            <div className="grid gap-4">
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Ad Soyad</span>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-accent/10"
                  placeholder="Örn. Elif Yılmaz"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">E-posta</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-accent/10"
                  placeholder="sen@orneksite.com"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Kullanıcı adı</span>
                <input
                  type="text"
                  name="username"
                  required
                  value={form.username}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-accent/10"
                  placeholder="ornekkullanici"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Şifre</span>
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-accent/10"
                  placeholder="••••••••"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Şifre tekrar</span>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-accent/10"
                  placeholder="••••••••"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/25 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Kaydediliyor…' : 'Kayıt Ol'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Register
