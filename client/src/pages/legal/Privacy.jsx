const Privacy = () => (
  <main className="relative mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
    <div className="space-y-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-10 shadow-soft backdrop-blur sm:p-14">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        yasal
      </span>
      <h1 className="text-3xl font-semibold text-slate-900">Gizlilik Politikası</h1>
      <p className="text-sm text-slate-500">Son güncelleme: Haziran 2025</p>

      <div className="space-y-6 text-sm leading-7 text-slate-600">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">1. Veri Sorumlusu</h2>
          <p>
            Kişisel verileriniz, veri sorumlusu sıfatıyla bağışla platformu tarafından 6698 sayılı Kişisel Verilerin
            Korunması Kanunu&rdquo;na (&ldquo;KVKK&rdquo;) uygun olarak işlenmektedir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">2. Toplanan Veriler</h2>
          <p>Platformu kullanırken aşağıdaki kişisel verileriniz toplanabilir:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>Ad, soyad, e-posta adresi, kullanıcı adı</li>
            <li>Profil fotoğrafı ve biyografi bilgisi</li>
            <li>Bağış işlemlerine ilişkin bilgiler</li>
            <li>Platform kullanımına ilişkin log kayıtları</li>
            <li>Çerezler aracılığıyla toplanan teknik veriler</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">3. Verilerin İşlenme Amaçları</h2>
          <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>Hesap oluşturma ve yönetimi</li>
            <li>Bağış işlemlerinin gerçekleştirilmesi</li>
            <li>Kullanıcı profillerinin görüntülenmesi</li>
            <li>Platform güvenliğinin sağlanması</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">4. Verilerin Aktarılması</h2>
          <p>
            Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmaz. Veriler, yalnızca platformun
            barındırılması ve işletilmesi amacıyla hizmet sağlayıcılarla sınırlı ölçüde paylaşılabilir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">5. KVKK Kapsamında Haklarınız</h2>
          <p>KVKK&rsquo;nun 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>Verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
            <li>Verilerinizin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Eksik veya yanlış verilerin düzeltilmesini talep etme</li>
            <li>Verilerinizin silinmesini veya yok edilmesini talep etme</li>
            <li>Verilerinizin aktarıldığı üçüncü kişilere bildirilmesini talep etme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">6. Veri Saklama Süresi</h2>
          <p>
            Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve yasal yükümlülükler çerçevesinde saklanır.
            Hesabınızı sildiğinizde, yasal zorunluluklar dışındaki verileriniz anonim hale getirilir veya silinir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">7. Haklarınızı Kullanma</h2>
          <p>
            KVKK kapsamındaki haklarınızı kullanmak için platform üzerinden bizimle iletişime geçebilirsiniz.
            Talepleriniz en geç 30 gün içinde sonuçlandırılacaktır.
          </p>
        </section>
      </div>
    </div>
  </main>
)

export default Privacy