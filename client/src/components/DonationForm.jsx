import { useState } from 'react'
import { ArrowRight, CheckCircle2, CreditCard, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { createDonation } from '../api/auth'
import useAuth from '../hooks/useAuth'

const TEST_CARD = {
  number: '4242 4242 4242 4242',
  name: 'TEST USER',
  expiry: '12/30',
  cvc: '123',
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value)

const DonationForm = ({ recipientUsername }) => {
  const [amount, setAmount] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [loading, setLoading] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const { isAuthenticated } = useAuth()

  const handleFillTestCard = () => {
    setCardNumber(TEST_CARD.number)
    setCardName(TEST_CARD.name)
    setCardExpiry(TEST_CARD.expiry)
    setCardCvc(TEST_CARD.cvc)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!amount || Number(amount) <= 0) {
      toast.error('Lütfen geçerli bir tutar girin')
      return
    }

    const sanitizedNumber = cardNumber.replace(/\s+/g, '')
    if (!/^\d{16}$/.test(sanitizedNumber)) {
      toast.error('Kart numarası 16 haneli olmalı')
      return
    }

    if (!cardName.trim()) {
      toast.error('Kart üzerindeki ismi girin')
      return
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      toast.error('Son kullanma tarihi MM/YY formatında olmalı')
      return
    }

    if (!/^\d{3}$/.test(cardCvc)) {
      toast.error('CVC üç haneli olmalı')
      return
    }

    setLoading(true)
    try {
      const amountValue = Number(amount)
      const response = await createDonation({
        amount: amountValue,
        toUsername: recipientUsername,
      })

      const donation = response?.donation
      const recipient = response?.recipient

      const recipientLabel = recipient?.name ?? recipient?.username ?? recipientUsername ?? 'Bilinmiyor'

      setReceipt({
        amount: donation?.amount ?? amountValue,
        cardHolder: cardName.trim(),
        cardLast4: sanitizedNumber.slice(-4),
        processedAt: donation?.date ?? new Date().toISOString(),
        recipient: recipientLabel,
        donationId: donation?.id ?? null,
      })

      setAmount('')
      setCardNumber('')
      setCardName('')
      setCardExpiry('')
      setCardCvc('')
      toast.success('Bağış başarıyla kaydedildi')
    } catch (error) {
      console.error('donation create error', error)
      const message = error.response?.data?.message ?? 'Bağış kaydedilemedi'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const isSubmitDisabled =
    !isAuthenticated ||
    loading ||
    Number(amount) <= 0 ||
    !cardNumber ||
    !cardName ||
    !cardExpiry ||
    !cardCvc

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-soft"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/5 text-slate-900">
          <CreditCard className="h-5 w-5" />
        </span>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900">Test ödemesi oluştur</h3>
          <span className="text-xs text-slate-500">API bağlantısı olmadan hızlıca senaryo dene.</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full max-w-xs items-end gap-3 rounded-[40px] bg-slate-900/5 px-6 py-6 text-slate-900 shadow-inner">
          <span className="pb-1 text-3xl font-semibold">₺</span>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full bg-transparent text-center text-5xl font-semibold leading-none outline-none focus:outline-none"
            placeholder="250"
            autoFocus
          />
        </div>
        <p className="text-xs text-slate-500">Gönlünden geçen miktarı yaz ve kart bilgilerini doldur.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Kart bilgileri</p>
          <button
            type="button"
            onClick={handleFillTestCard}
            className="text-xs font-semibold text-slate-500 underline-offset-4 transition hover:text-slate-900 hover:underline"
          >
            Test kartını doldur
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={cardName}
            onChange={(event) => setCardName(event.target.value)}
            placeholder="Kart üzerindeki isim"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
          <input
            type="text"
            value={cardNumber}
            onChange={(event) => setCardNumber(event.target.value)}
            placeholder="Kart numarası (16 hane)"
            inputMode="numeric"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
          <input
            type="text"
            value={cardExpiry}
            onChange={(event) => setCardExpiry(event.target.value)}
            placeholder="MM/YY"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
          <input
            type="password"
            value={cardCvc}
            onChange={(event) => setCardCvc(event.target.value)}
            placeholder="CVC"
            inputMode="numeric"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
        </div>
      </div>

      {!isAuthenticated && (
        <p className="rounded-2xl border border-red-200/80 bg-red-50 px-4 py-3 text-xs font-medium text-red-500">
          Bağış yapmadan önce lütfen giriş yap.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/25 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'İşleniyor…' : 'Bağışı tamamla'}
        <ArrowRight className="h-4 w-4" />
      </button>

      {receipt && (
        <div className="space-y-4 rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-6 text-slate-900">
          <div className="flex items-center gap-3 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-semibold">Bağış başarıyla işlendi</span>
          </div>
          <dl className="grid gap-3 text-sm">
            {receipt.recipient && (
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Bağış alan</dt>
                <dd className="font-semibold">{receipt.recipient}</dd>
              </div>
            )}
            {receipt.donationId && (
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">İşlem kodu</dt>
                <dd className="font-semibold">{receipt.donationId}</dd>
              </div>
            )}
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Bağış tutarı</dt>
              <dd className="font-semibold">{formatCurrency(receipt.amount)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Kart sahibinin adı</dt>
              <dd className="font-semibold">{receipt.cardHolder}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Kart son 4</dt>
              <dd className="font-semibold">•••• {receipt.cardLast4}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">İşlem zamanı</dt>
              <dd className="font-semibold">
                {new Date(receipt.processedAt).toLocaleString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-xs text-slate-500">
        <Info className="mt-0.5 h-4 w-4 text-slate-400" />
        <p>
          Test senaryosu için aşağıdaki kartı kullanabilirsin:
          <br />
          <span className="font-medium text-slate-700">{TEST_CARD.number} · {TEST_CARD.expiry} · {TEST_CARD.cvc}</span>
        </p>
      </div>
    </form>
  )
}

export default DonationForm
