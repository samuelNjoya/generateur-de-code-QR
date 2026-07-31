import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Library, Lock } from 'lucide-react'
import QRCode from 'qrcode'
import { getHistory, clearHistory } from '../utils/helpers'
import { isEncryptedPayload } from '../utils/security'
import { useToast } from '../hooks/useToast'

const TYPE_ICON = { url: '🔗', vcard: '👤', whatsapp: '💬', wifi: '📶', gps: '📍', event: '📅', email: '✉️', ussd: '💳', batch: '📦' }

function LibraryMiniQR({ data }) {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    QRCode.toString(data, { type: 'svg', width: 84, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1a1a1a', light: '#ffffff' } })
      .then(setSvg).catch(() => {})
  }, [data])
  return <div className="library-card-qr" dangerouslySetInnerHTML={{ __html: svg }} />
}

function LibraryScreen({ onRestore, active }) {
  const [history, setHistory] = useState(getHistory())
  const showToast = useToast()

  const refresh = useCallback(() => setHistory(getHistory()), [])

  useEffect(() => {
    if (active) refresh()
  }, [active, refresh])

  const handleClear = () => {
    clearHistory()
    refresh()
    showToast('Historique vidé')
  }

  const handleSelect = (item) => {
    onRestore({ ...item, ts: Date.now() })
  }

  return (
    <div className="library-screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <p className="section-title" style={{ marginBottom: 2 }}>Catalogue</p>
          <p className="section-sub" style={{ marginBottom: 0 }}>{history.length}/10 QR enregistrés récemment</p>
        </div>
        {history.length > 0 && (
          <button className="btn-icon" onClick={handleClear} title="Vider l'historique">
            <Trash2 size={15} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="library-empty">
          <Library size={32} strokeWidth={1.2} />
          <p>Aucun QR enregistré pour l'instant.<br />Générez un QR dans l'onglet Accueil pour le retrouver ici.</p>
        </div>
      ) : (
        <div className="library-grid">
          <AnimatePresence>
            {history.map((item, i) => (
              <motion.button
                key={item.savedAt}
                className="library-card"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleSelect(item)}
                style={{ border: 'none', cursor: 'pointer' }}>
                <LibraryMiniQR data={item.data} />
                <span className="library-card-label">
                  {isEncryptedPayload(item.data) ? <Lock size={11} style={{ display: 'inline', verticalAlign: -1 }} /> : TYPE_ICON[item.type] || '📄'}
                  {' '}{item.label || item.data.slice(0, 14)}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default LibraryScreen
