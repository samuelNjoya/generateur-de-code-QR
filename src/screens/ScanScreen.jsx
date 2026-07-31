import { useEffect, useRef, useState, useCallback } from 'react'
import { Camera, ExternalLink, Copy, Lock, RotateCcw } from 'lucide-react'
import Modal from '../components/ui/Modal'
import { parseScannedData } from '../utils/helpers'
import { isEncryptedPayload, decryptPayload } from '../utils/security'
import { useToast } from '../hooks/useToast'

function ScanScreen() {
  const scannerRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | starting | scanning | error
  const [errorMsg, setErrorMsg] = useState('')
  const [rawResult, setRawResult] = useState(null)
  const [parsed, setParsed] = useState(null)
  const [needsPassword, setNeedsPassword] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const showToast = useToast()

  const stopScanner = useCallback(async () => {
    const inst = scannerRef.current
    scannerRef.current = null
    if (inst) {
      try { await inst.stop() } catch { /* already stopped */ }
      try { inst.clear() } catch { /* noop */ }
    }
  }, [])

  const handleDecoded = useCallback((decodedText) => {
    if (navigator.vibrate) navigator.vibrate(200)
    stopScanner()
    setStatus('idle')
    if (isEncryptedPayload(decodedText)) {
      setRawResult(decodedText)
      setNeedsPassword(true)
    } else {
      setParsed(parseScannedData(decodedText))
    }
  }, [stopScanner])

  const startScanner = useCallback(async () => {
    setStatus('starting')
    setErrorMsg('')
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const instance = new Html5Qrcode('qr-scan-region')
      scannerRef.current = instance
      await instance.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => handleDecoded(decodedText),
        () => {}
      )
      setStatus('scanning')
    } catch (e) {
      console.error(e)
      setStatus('error')
      setErrorMsg("Impossible d'accéder à la caméra. Vérifiez les autorisations du navigateur.")
    }
  }, [handleDecoded])

  useEffect(() => {
    startScanner()
    return () => { stopScanner() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUnlock = async () => {
    try {
      const plain = await decryptPayload(rawResult, passwordInput)
      setParsed(parseScannedData(plain))
      setNeedsPassword(false)
      setPasswordInput('')
      setPasswordError('')
    } catch {
      setPasswordError('Mot de passe incorrect')
    }
  }

  const handleRescan = () => {
    setParsed(null)
    setRawResult(null)
    setNeedsPassword(false)
    setPasswordInput('')
    setPasswordError('')
    startScanner()
  }

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value)
      showToast('Copié dans le presse-papiers')
    } catch { /* clipboard unavailable */ }
  }

  const primaryAction = (() => {
    if (!parsed) return null
    if (parsed.type === 'url') return { label: 'Ouvrir le lien', href: parsed.raw }
    if (parsed.type === 'whatsapp') return { label: 'Ouvrir WhatsApp', href: parsed.raw }
    if (parsed.type === 'email') return { label: 'Envoyer un email', href: parsed.raw }
    if (parsed.type === 'phone') return { label: 'Appeler', href: parsed.raw }
    if (parsed.type === 'gps') return { label: 'Voir sur la carte', href: `https://www.google.com/maps?q=${parsed.raw.replace('geo:', '')}` }
    return null
  })()

  return (
    <div className="scan-screen">
      <p className="section-title">Scanner</p>
      <p className="section-sub">Visez un QR code pour le décoder instantanément</p>

      <div className="scan-wrapper">
        <div id="qr-scan-region" />
        {status === 'scanning' && (
          <div className="scan-frame">
            <span className="scan-corner tl" /><span className="scan-corner tr" />
            <span className="scan-corner bl" /><span className="scan-corner br" />
          </div>
        )}
        {status !== 'scanning' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#fff', padding: 24, textAlign: 'center' }}>
            <Camera size={28} strokeWidth={1.3} />
            <p style={{ fontSize: '0.8125rem' }}>{status === 'starting' ? 'Ouverture de la caméra…' : (errorMsg || 'Caméra en pause')}</p>
            {status !== 'starting' && (
              <button className="btn-primary" onClick={startScanner}>Activer la caméra</button>
            )}
          </div>
        )}
      </div>
      <p className="scan-hint">{status === 'scanning' ? 'Alignez le QR code dans le cadre' : ''}</p>

      <Modal open={needsPassword} onClose={handleRescan} title="QR protégé">
        <div className="field">
          <label className="label">Mot de passe requis</label>
          <input type="password" value={passwordInput} autoFocus
            onChange={e => { setPasswordInput(e.target.value); setPasswordError('') }}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()} />
          {passwordError && <p style={{ fontSize: '0.75rem', color: 'var(--red)', marginTop: 4 }}>{passwordError}</p>}
        </div>
        <button className="btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={handleUnlock}>
          <Lock size={15} strokeWidth={1.5} /> Déverrouiller
        </button>
      </Modal>

      <Modal open={!!parsed} onClose={handleRescan} title={parsed?.title}>
        {parsed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {parsed.fields.map(f => (
              <div key={f.label} className="field" style={{ marginTop: 0 }}>
                <label className="label">{f.label}</label>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text)', wordBreak: 'break-word', fontFamily: 'var(--font-mono)' }}>{f.value}</p>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {primaryAction && (
                <a className="btn-primary" style={{ flex: 1 }} href={primaryAction.href} target="_blank" rel="noreferrer">
                  <ExternalLink size={15} strokeWidth={1.5} /> {primaryAction.label}
                </a>
              )}
              <button className="btn-ghost" onClick={() => handleCopy(parsed.raw)}><Copy size={15} strokeWidth={1.5} /> Copier</button>
            </div>
            <button className="btn-ghost" style={{ width: '100%' }} onClick={handleRescan}>
              <RotateCcw size={15} strokeWidth={1.5} /> Scanner à nouveau
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ScanScreen
