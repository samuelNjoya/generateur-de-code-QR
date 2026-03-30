import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Clock, Trash2 } from 'lucide-react'
import { getHistory, clearHistory } from '../utils/helpers'
import QRCode from 'qrcode'

function HistoryMiniQR({ data }) {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    QRCode.toString(data, { type: 'svg', width: 80, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1a1a1a', light: '#ffffff' } })
      .then(setSvg).catch(() => {})
  }, [data])
  return <div style={{ width: 56, height: 56 }} dangerouslySetInnerHTML={{ __html: svg }} />
}

function HistoryPanel({ onSelect }) {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (open) setHistory(getHistory())
  }, [open])

  const handleClear = (e) => {
    e.stopPropagation()
    clearHistory()
    setHistory([])
  }

  const typeLabel = (type) => {
    const map = { url: '🔗', vcard: '👤', whatsapp: '💬', wifi: '📶', gps: '📍', event: '📅', batch: '📦' }
    return map[type] || '📄'
  }

  if (!getHistory().length && !open) return null

  return (
    <div>
      <div className="divider" />
      <div className="collapse-header" onClick={() => setOpen(v => !v)}>
        <span className="collapse-label">
          <Clock size={15} strokeWidth={1.5} />
          Historique récent
          <span className="badge">{getHistory().length}/10</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {open && history.length > 0 && (
            <button className="btn-icon" style={{ width: 26, height: 26, borderRadius: 6 }} onClick={handleClear} title="Vider">
              <Trash2 size={11} />
            </button>
          )}
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} strokeWidth={1.5} style={{ color: 'var(--text-3)' }} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}>
            <div style={{ paddingBottom: 16 }}>
              {history.length === 0 ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>
                  Aucun QR enregistré
                </p>
              ) : (
                <div className="history-grid">
                  {history.map((item, i) => (
                    <motion.div key={item.savedAt}
                      className="history-item"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => onSelect(item)}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <HistoryMiniQR data={item.data} />
                      </div>
                      <div className="history-item-label">
                        {typeLabel(item.type)} {item.label || item.data.slice(0, 12)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HistoryPanel
