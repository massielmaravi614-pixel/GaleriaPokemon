import { useEffect, useState } from 'react'
import { setup, setInitialConfig, setPaymentConfig } from '@dankira/izipay'

const PAYMENT_AMOUNT = 19.9

function PaymentForm() {
  const [cardName, setCardName] = useState('Juan Pérez')
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
  const [expiry, setExpiry] = useState('12/26')
  const [cvc, setCvc] = useState('123')
  const [email, setEmail] = useState('cliente@ejemplo.com')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  const production = import.meta.env.VITE_IZIPAY_PRODUCTION === 'true'
  const merchantCode = import.meta.env.VITE_IZIPAY_MERCHANT_CODE ?? ''
  const proxyUrl = import.meta.env.VITE_IZIPAY_PROXY_URL ?? ''

  const testPassword = import.meta.env.VITE_IZIPAY_TEST_PASSWORD ?? ''
  const testPublicKey = import.meta.env.VITE_IZIPAY_TEST_PUBLIC_KEY ?? ''
  const testSha256 = import.meta.env.VITE_IZIPAY_TEST_SHA256 ?? ''

  const prodPassword = import.meta.env.VITE_IZIPAY_PROD_PASSWORD ?? ''
  const prodPublicKey = import.meta.env.VITE_IZIPAY_PROD_PUBLIC_KEY ?? ''
  const prodSha256 = import.meta.env.VITE_IZIPAY_PROD_SHA256 ?? ''

  const hasTestConfig = merchantCode && testPassword && testPublicKey && testSha256
  const hasProdConfig = merchantCode && prodPassword && prodPublicKey && prodSha256
  const canInitialize = proxyUrl && (production ? hasProdConfig : hasTestConfig)

  useEffect(() => {
    if (!canInitialize) return

    const config = {
      merchant_code: merchantCode,
      production,
      proxy_url: proxyUrl,
      endpoint: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js',
      language: 'es',
    }

    if (production) {
      config.prod_password = prodPassword
      config.prod_public_key = prodPublicKey
      config.prod_sha256 = prodSha256
    } else {
      config.test_password = testPassword
      config.test_public_key = testPublicKey
      config.test_sha256 = testSha256
    }

    setInitialConfig(config)
    setReady(true)
  }, [canInitialize, merchantCode, proxyUrl, production, prodPassword, prodPublicKey, prodSha256, testPassword, testPublicKey, testSha256])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('')

    if (!canInitialize) {
      setStatus(
        'Falta la configuración de Izipay. Copia .env.example a .env y completa las credenciales para usar el pago real.',
      )
      return
    }

    setLoading(true)
    setPaymentConfig({
      amount: PAYMENT_AMOUNT,
      currency: 'PEN',
      orderId: `ORD-${Date.now()}`,
      customer: {
        email: email || 'cliente@ejemplo.com',
      },
    })

    try {
      await setup((payment) => {
        const response = payment?.res || payment

        setStatus(
          response
            ? 'Pago enviado a Izipay. Revisa la consola para el resultado del callback.'
            : 'Formulario de pago Izipay abierto. Completa la transacción en el modal.',
        )

        console.log('Izipay payment callback:', response)
      })
    } catch (error) {
      console.error('Izipay setup error', error)
      setStatus('Error al iniciar el pago con Izipay. Revisa la consola para más detalles.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-yellow-400/40 bg-red-950/95 p-6 shadow-2xl shadow-red-900/40">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-yellow-100">
          Nombre en la tarjeta
          <input
            type="text"
            value={cardName}
            onChange={(event) => setCardName(event.target.value)}
            placeholder="Juan Pérez"
            className="w-full rounded-full border border-red-700/80 bg-red-900/90 px-4 py-3 text-yellow-100 outline-none transition focus:border-yellow-300/90"
            required
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-yellow-100">
          Número de tarjeta
          <input
            type="text"
            inputMode="numeric"
            value={cardNumber}
            onChange={(event) => setCardNumber(event.target.value)}
            placeholder="4242 4242 4242 4242"
            className="w-full rounded-full border border-red-700/80 bg-red-900/90 px-4 py-3 text-yellow-100 outline-none transition focus:border-yellow-300/90"
            required
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2 text-sm font-medium text-yellow-100">
          Expiración
          <input
            type="text"
            value={expiry}
            onChange={(event) => setExpiry(event.target.value)}
            placeholder="MM/AA"
            className="w-full rounded-full border border-red-700/80 bg-red-900/90 px-4 py-3 text-yellow-100 outline-none transition focus:border-yellow-300/90"
            required
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-yellow-100">
          CVC
          <input
            type="text"
            value={cvc}
            onChange={(event) => setCvc(event.target.value)}
            placeholder="123"
            className="w-full rounded-full border border-red-700/80 bg-red-900/90 px-4 py-3 text-yellow-100 outline-none transition focus:border-yellow-300/90"
            required
          />
        </label>

        <div className="rounded-[2rem] border border-yellow-300/30 bg-red-900/90 p-4 text-sm text-yellow-100">
          <p className="font-semibold text-yellow-200">Total</p>
          <p className="mt-2 text-3xl text-yellow-300">S/ {PAYMENT_AMOUNT.toFixed(2)}</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-orange-400/30 transition hover:from-red-400 hover:to-yellow-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Preparando pago...' : 'Pagar ahora'}
      </button>

      <div id="izipay-form" className="mt-6" />

      {status ? (
        <div className="rounded-3xl border border-yellow-300/50 bg-yellow-300/10 p-4 text-sm text-yellow-100">
          {status}
        </div>
      ) : null}

      {!ready && (
        <div className="rounded-3xl border border-yellow-300/50 bg-yellow-300/10 p-4 text-sm text-yellow-100">
          La integración de Izipay aún no está configurada. Revisa <code>.env.example</code> y crea un <code>.env</code> con tus credenciales.
        </div>
      )}
    </form>
  )
}

export default PaymentForm
