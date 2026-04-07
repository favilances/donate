import { ArrowRight, CreditCard, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const features = [
  {
    title: 'Kolay başlangıç',
    description: 'Kısa bir kayıtla kişisel bağış sayfan hazır olur.',
    icon: Sparkles,
  },
  {
    title: 'Hikayeni paylaş',
    description: 'Profilinde kim olduğunu anlat ve destekçilerinle bağ kur.',
    icon: ShieldCheck,
  },
  {
    title: 'Takipte kal',
    description: 'Bağışlarını tek ekrandan gör ve süreci sakin bir şekilde yönet.',
    icon: CreditCard,
  },
]

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-white/80 p-10 shadow-brand backdrop-blur-xl md:p-16">
        <div className="absolute inset-y-0 right-0 hidden w-64 translate-x-16 rounded-full bg-gradient-to-br from-accent/10 via-slate-100 to-transparent blur-3xl md:block" />
        <div className="relative z-10 max-w-3xl space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1 text-xs font-medium uppercase tracking-wide text-slate-500 shadow-sm shadow-slate-900/5">
            Yeni • bağışla
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl lg:text-6xl">Hikayeni paylaş, desteklerini hisset.</h1>
          <p className="max-w-2xl text-base text-slate-600 md:text-lg">
            Bağış sayfanı aç, topluluğunu davet et ve herkesin kolayca katkı sunmasını sağla. Sadelik, sakinlik ve güven bu
            deneyimin merkezinde.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/profile/${user.username}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/20 transition hover:bg-slate-700"
                >
                  Profilime git
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-white"
                >
                  Profilimi düzenle
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/20 transition hover:bg-slate-700"
                >
                  Ücretsiz başla
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-white"
                >
                  Giriş yap
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-brand"
          >
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent transition group-hover:bg-accent/20">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-soft backdrop-blur-xl md:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Sade bir bağış süreci</h2>
          <p className="text-sm leading-6 text-slate-600">
            Her adım net ve anlaşılır olsun diye tasarladık. Destekçilerin hangi adımı izleyeceğini bilir, sen de gelen
            katkıları zahmetsizce takip edersin.
          </p>
          <ul className="space-y-3 text-sm text-slate-600">
            {[
              'Sayfanı oluştur, kısa bir mesajla topluluğunu selamla.',
              'Destekçiler basit bir form ile katkıda bulunur.',
              'Güncellenen listeden gelen desteği takip et.',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-accent/20 bg-accent/5 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_55%)]" aria-hidden />
          <div className="relative z-10 space-y-4">
            <div className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-soft">
              <p className="text-sm font-semibold text-slate-900">3 adımda bağış</p>
              <ol className="mt-3 space-y-2 text-sm text-slate-600">
                <li>1. Tutara karar ver.</li>
                <li>2. Mesajını ekle.</li>
                <li>3. Destek gönderildiğinde profil anında yenilenir.</li>
              </ol>
            </div>
            <p className="text-xs text-slate-500">
              Şeffaf, sakin ve anlaşılır bir akışla hem sen hem de destekçilerin rahat eder.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
