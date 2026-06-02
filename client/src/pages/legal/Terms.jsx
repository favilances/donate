const Terms = () => (
  <main className="relative mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
    <div className="space-y-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-10 shadow-soft backdrop-blur sm:p-14">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        yasal
      </span>
      <h1 className="text-3xl font-semibold text-slate-900">Hizmet Şartları</h1>
      <p className="text-sm text-slate-500">Son güncelleme: Haziran 2025</p>

      <div className="space-y-6 text-sm leading-7 text-slate-600">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">1. Genel</h2>
          <p>
            İşbu Hizmet Şartları (&ldquo;Şartlar&rdquo;), bağışla platformunu (&ldquo;Platform&rdquo;) kullanımınıza ilişkin
            koşulları belirler. Platformu kullanarak bu Şartları kabul etmiş olursunuz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">2. Hesap Kaydı</h2>
          <p>
            Platforma kayıt olurken doğru, güncel ve eksiksiz bilgi vermeyi kabul edersiniz. Hesabınızın güvenliğinden ve
            şifrenizin gizliliğinden siz sorumlusunuz. 18 yaşından küçükler yalnızca ebeveyn izniyle kayıt olabilir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">3. Kullanım Kuralları</h2>
          <p>Platformu kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>Yasa dışı veya izinsiz amaçlarla platformu kullanmamak</li>
            <li>Başka kullanıcıların haklarına saygı göstermek</li>
            <li>Yanıltıcı, taciz edici veya uygunsuz içerik paylaşmamak</li>
            <li>Platformun işleyişini engelleyecek faaliyetlerde bulunmamak</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">4. Bağışlar</h2>
          <p>
            Platform üzerinden yapılan bağışlar gönüllülük esasına dayanır. Bağışların iadesi, ilgili mevzuat
            çerçevesinde ve platform yönetiminin takdirinde değerlendirilir. Bağış işlemleri sırasında sağlanan bilgilerin
            doğruluğu bağışçının sorumluluğundadır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">5. Fikri Mülkiyet</h2>
          <p>
            Platformda yer alan tüm içerik, tasarım, logo ve yazılımın fikri mülkiyet hakları saklıdır. Kullanıcılar,
            kendi profillerinde paylaştıkları içeriklerin telif haklarını ihlal etmediğini beyan eder.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">6. Sorumluluk Reddi</h2>
          <p>
            Platform, &ldquo;olduğu gibi&rdquo; sunulmaktadır. Kesintisiz hizmet garantisi verilmez. Platform yönetimi,
            kullanıcılar arasındaki anlaşmazlıklardan sorumlu değildir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">7. Değişiklikler</h2>
          <p>
            Bu Şartlar önceden bildirim yapılmaksızın değiştirilebilir. Güncel şartlara platform üzerinden erişebilirsiniz.
            Değişiklik sonrası platformu kullanmaya devam etmeniz, güncellenen şartları kabul ettiğiniz anlamına gelir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">8. İletişim</h2>
          <p>
            Soru, görüş ve talepleriniz için platform üzerindeki iletişim kanallarını kullanabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  </main>
)

export default Terms