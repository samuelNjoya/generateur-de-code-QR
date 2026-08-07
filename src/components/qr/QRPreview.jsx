import { useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Share2, FileText } from 'lucide-react'
import { svgToPngBlob, svgToPngBlobWithTitle, downloadBlob, exportPdf } from '../../utils/helpers'

function QRPreview({ svgString, title, isGenerating, onShare }) {
  const containerRef = useRef(null)
  const getSvgEl = () => containerRef.current?.querySelector('svg')

  const handleDownloadPng = useCallback(async () => {
    const svgEl = getSvgEl()
    if (!svgEl) return
    try {
      const blob = await svgToPngBlobWithTitle(svgEl, title, 2000)
      downloadBlob(blob, `${title || 'QR'}_2000px.png`)
    } catch (e) { console.error(e) }
  }, [title])

  const handleDownloadPdf = useCallback(async () => {
    const svgEl = getSvgEl()
    if (!svgEl) return
    try { await exportPdf(svgEl, title || 'QR Code') } catch (e) { console.error(e) }
  }, [title])

  const handleShare = useCallback(async () => {
    const svgEl = getSvgEl()
    if (!svgEl) return
    if (navigator.share) {
      try {
        const blob = await svgToPngBlob(svgEl, 1000)
        const file = new File([blob], `${title || 'QR'}.png`, { type: 'image/png' })
        await navigator.share({ title: title || 'QR Code', files: [file] })
      } catch (e) { if (e.name !== 'AbortError') console.error(e) }
    } else if (onShare) { onShare() }
  }, [title, onShare])

  return (
    <div className="qr-preview-wrapper-v2">
      {title && (svgString || isGenerating) && (
        <motion.p className="qr-title-v2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {title}
        </motion.p>
      )}

      <div className="qr-display-v2" ref={containerRef}>
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div key="loading" className="qr-state-v2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="qr-skeleton" />
            </motion.div>
          ) : svgString ? (
            <motion.div key="qr" className="qr-svg-container-v2"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              dangerouslySetInnerHTML={{ __html: svgString }}
            />
          ) : (
            <motion.div key="empty" className="qr-state-v2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="qr-placeholder-v2">
                <div className="qr-placeholder-grid">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`qr-placeholder-dot ${[0, 2, 6, 8].includes(i) ? 'corner' : ''}`} />
                  ))}
                </div>
              </div>
              <p className="qr-placeholder-text">Votre QR code s'affichera ici</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {svgString && !isGenerating && (
          <motion.div className="qr-actions-v2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <button className="btn-ghost" onClick={handleDownloadPng} title="PNG 2000×2000px">
              <Download size={15} strokeWidth={1.5} /> PNG HD
            </button>
            <button className="btn-ghost" onClick={handleDownloadPdf} title="Export PDF">
              <FileText size={15} strokeWidth={1.5} /> PDF
            </button>
            <button className="btn-ghost" onClick={handleShare} title="Partager">
              <Share2 size={15} strokeWidth={1.5} /> Partager
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QRPreview