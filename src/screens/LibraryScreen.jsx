import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Library, Lock, Share2, Pencil } from 'lucide-react'
import QRCode from 'qrcode'
import { getHistory, clearHistory, deleteHistoryItem, svgToPngBlob, downloadBlob } from '../utils/helpers'
import { isEncryptedPayload } from '../utils/security'
import { useToast } from '../hooks/useToast'
import Modal from '../components/ui/Modal'

const TYPE_ICON = { url: '🔗', vcard: '👤', whatsapp: '💬', wifi: '📶', gps: '📍', event: '📅', email: '✉️', ussd: '💳', text: '📝', batch: '📦' }

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
  const [confirm, setConfirm] = useState(null) // { type: 'clear' } | { type: 'delete', item }
  const [sharingId, setSharingId] = useState(null)
  const showToast = useToast()

  const refresh = useCallback(() => setHistory(getHistory()), [])

  useEffect(() => {
    if (active) refresh()
  }, [active, refresh])

  const handleClear = () => {
    clearHistory()
    refresh()
    setConfirm(null)
    showToast('Historique vidé')
  }

  const handleDelete = (item) => {
    deleteHistoryItem(item.id)
    refresh()
    setConfirm(null)
    showToast('QR supprimé')
  }

  const handleSelect = (item) => {
    onRestore({ ...item, ts: Date.now() })
  }

  const handleShare = async (item, e) => {
    e.stopPropagation()
    setSharingId(item.id)
    try {
      const svgStr = await QRCode.toString(item.data, { type: 'svg', width: 1000, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#1a1a1a', light: '#ffffff' } })
      const svgEl = new DOMParser().parseFromString(svgStr, 'image/svg+xml').documentElement
      const blob = await svgToPngBlob(svgEl, 1000)
      const filename = `${(item.label || 'QR').replace(/[^a-zA-Z0-9-_ ]/g, '')}.png`
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], filename, { type: 'image/png' })] })) {
        await navigator.share({ title: item.label || 'QR Code', files: [new File([blob], filename, { type: 'image/png' })] })
      } else {
        downloadBlob(blob, filename)
        showToast('Partage indisponible — image téléchargée')
      }
    } catch (err) {
      if (err?.name !== 'AbortError') { console.error(err); showToast("Impossible de partager ce QR") }
    } finally {
      setSharingId(null)
    }
  }

  const pluralSuffix = history.length > 1 ? 's' : ''
  const countLabel = history.length === 0 ? 'Aucun QR enregistré' : `${history.length} QR enregistré${pluralSuffix}`

  return (
    <div className="library-screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <p className="section-title" style={{ marginBottom: 2 }}>Catalogue</p>
          <p className="section-sub" style={{ marginBottom: 0 }}>{countLabel}</p>
        </div>
        {history.length > 0 && (
          <button className="btn-icon" onClick={() => setConfirm({ type: 'clear' })} title="Vider l'historique">
            <Trash2 size={15} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="library-empty">
          <Library size={32} strokeWidth={1.2} />
          <p>Aucun QR enregistré pour l'instant.<br />Générez un QR dans l'onglet Accueil, puis appuyez sur « Enregistrer » pour le retrouver ici.</p>
        </div>
      ) : (
        <div className="library-grid">
          <AnimatePresence>
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                className="library-card"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ delay: i * 0.03 }}>
                <div className="library-card-actions">
                  <button
                    className="library-card-action"
                    onClick={(e) => handleShare(item, e)}
                    title="Partager"
                    aria-label="Partager ce QR">
                    <Share2 size={13} strokeWidth={1.75} className={sharingId === item.id ? 'spin' : ''} />
                  </button>
                  <button
                    className="library-card-action library-card-action-danger"
                    onClick={(e) => { e.stopPropagation(); setConfirm({ type: 'delete', item }) }}
                    title="Supprimer"
                    aria-label="Supprimer ce QR">
                    <Trash2 size={13} strokeWidth={1.75} />
                  </button>
                </div>

                <button
                  type="button"
                  className="library-card-body"
                  onClick={() => handleSelect(item)}>
                  <LibraryMiniQR data={item.data} />
                  <span className="library-card-label">
                    {isEncryptedPayload(item.data) ? <Lock size={11} style={{ display: 'inline', verticalAlign: -1 }} /> : TYPE_ICON[item.type] || '📄'}
                    {' '}{item.label || item.data.slice(0, 14)}
                  </span>
                  <span className="library-card-edit"><Pencil size={11} strokeWidth={1.75} /> Modifier</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={confirm?.type === 'clear' ? "Vider l'historique ?" : 'Supprimer ce QR ?'}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', marginBottom: 18 }}>
          {confirm?.type === 'clear'
            ? 'Tous les QR enregistrés seront définitivement supprimés du catalogue. Cette action est irréversible.'
            : 'Ce QR sera définitivement supprimé du catalogue. Cette action est irréversible.'}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setConfirm(null)}>Annuler</button>
          <button
            className="btn-primary"
            style={{ flex: 1, background: 'var(--red)' }}
            onClick={() => confirm?.type === 'clear' ? handleClear() : handleDelete(confirm.item)}>
            <Trash2 size={15} strokeWidth={1.5} /> Supprimer
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default LibraryScreen

