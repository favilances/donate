const Cookies = () => (
  <main className="relative mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
    <div className="space-y-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-10 shadow-soft backdrop-blur sm:p-14">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        yasal
      </span>
      <h1 className="text-3xl font-semibold text-slate-900">Çerez Politikası</h1>
      <p className="text-sm text-slate-500">Son güncelleme: Haziran 2025</p>

      <div className="space-y-6 text-sm leading-7 text-slate-600">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">1. Çerez Nedir?</h2>
          <p>
            Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır.
            Platformumuzda kullanıcı deneyimini iyileştirmek, güvenliği sağlamak ve analiz yapmak amacıyla
            çerezlerden yararlanılmaktadır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">2. Kullanılan Çerez Türleri</h2>

          <h3 className="mt-4 font-semibold text-slate-900">Zorunlu Çerezler</h3>
          <p>
            Platformun temel işlevlerini yerine getirebilmesi için gerekli olan çerezlerdir. Oturum açma ve güvenlik
            amacıyla kullanılır. Bu çerezler devre dışı bırakıldığında platform düzgün çalışmayabilir.
          </p>

          <h3 className="mt-4 font-semibold text-slate-900">Analitik Çerezler</h3>
          <p>
            Platformun nasıl kullanıldığını anlamamıza yardımcı olan çerezlerdir. Hangi sayfaların ziyaret edildiği,
            ne kadar süre kalındığı gibi anonim veriler toplar.
          </p>

          <h3 className="mt-4 font-semibold text-slate-900">İşlevsel Çerezler</h3>
          <p>
            Tercihlerinizi hatırlayarak daha kişisel bir deneyim sunmamızı sağlar. Dil seçeneği gibi tercihleriniz
            bu çerezler aracılığıyla saklanır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">3. Çerez Yönetimi</h2>
          <p>
            Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz. Çerezleri tamamen devre dışı bırakmak,
            platformun bazı özelliklerinin çalışmamasına neden olabilir. Çerez yönetimiyle ilgili detaylı bilgiye
            tarayıcınızın yardım sayfasından ulaşabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">4. Üçüncü Taraf Çerezleri</h2>
          <p>
            Platformumuz, analiz ve altyapı hizmetleri için üçüncü taraf hizmet sağlayıcıların çerezlerini
            kullanabilir. Bu hizmet sağlayıcıların çerez politikaları kendi gizlilik politikalarına tabidir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">5. Güncellemeler</h2>
          <p>
            Bu Çerez Politikası zaman zaman güncellenebilir. Güncellemeler platformda yayınlandığı anda yürürlüğe girer.
            Politikadaki değişiklikleri takip etmek kullanıcının sorumluluğundadır.
          </p>
        </section>
      </div>
    </div>
  </main>
)

export default Cookies