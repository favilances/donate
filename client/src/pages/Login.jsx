import { useState } from 'react'
import { Lock, Mail, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast.success('Tekrar hoş geldin!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Giriş başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-col px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 rounded-3xl border border-slate-200/80 bg-white/85 p-10 shadow-soft backdrop-blur-xl md:grid-cols-[0.9fr,1.1fr] lg:p-12">
        <div className="flex flex-col justify-between space-y-10">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              hoş geldin
            </span>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Geri dön ve topluluğunu selamla.</h1>
            <p className="text-sm leading-6 text-slate-600">
              Panonu açmak ve destekçilerinle buluşmak için giriş yap. Eğer hesabın yoksa hemen
              {` `}
              <Link to="/register" className="font-semibold text-slate-900 underline">
                kaydol.
              </Link>
            </p>
          </div>
          <div className="grid gap-4 text-sm text-slate-600">
            {[
              { icon: ShieldCheck, text: 'Hesabın yalnızca sana ait. Güvende kal.' },
              { icon: Lock, text: 'Şifreni unuttuğunda bile yeniden erişim sağlayabilirsin.' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/5 text-slate-900">
                  <Icon className="h-5 w-5" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex h-full flex-col justify-center gap-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-soft backdrop-blur"
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Tekrar hoş geldin</h2>
            <p className="mt-1 text-sm text-slate-500">Devam etmek için kayıt sırasında kullandığın e-posta ve şifrenle giriş yap.</p>
          </div>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">E-posta</span>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-accent/10"
                placeholder="sen@orneksite.com"
              />
            </div>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Şifre</span>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-accent/10"
                placeholder="••••••••"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/25 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Login
