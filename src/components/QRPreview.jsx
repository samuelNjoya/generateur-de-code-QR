import { useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Share2, FileText, Loader } from 'lucide-react'
import { svgToPngBlob, downloadBlob, exportPdf } from '../utils/helpers'

function QRPreview({ svgString, title, isGenerating, onShare }) {
  const containerRef = useRef(null)

  const getSvgEl = () => containerRef.current?.querySelector('svg')

  const handleDownloadPng = useCallback(async () => {
    const svgEl = getSvgEl()
    if (!svgEl) return
    try {
      const blob = await svgToPngBlob(svgEl, 2000)
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

  const isEmpty = !svgString && !isGenerating

  return (
    <div className="qr-preview-wrapper">
      {/* QR Display */}
      <div className="qr-display" ref={containerRef}>
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div key="loading" className="qr-loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Loader size={24} className="spin" style={{ color: 'var(--text-3)' }} />
            </motion.div>
          ) : svgString ? (
            <motion.div key="qr"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="qr-svg-container"
              dangerouslySetInnerHTML={{ __html: svgString }}
            />
          ) : (
            <motion.div key="empty" className="qr-empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="qr-placeholder">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`qr-placeholder-block ${[0,2,6,8].includes(i) ? 'corner' : ''}`} />
                ))}
              </div>
              <p>Saisissez vos données<br/>pour générer votre QR</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title display */}
      <AnimatePresence>
        {title && svgString && (
          <motion.div className="qr-title-display"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}>
            {title}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <AnimatePresence>
        {svgString && !isGenerating && (
          <motion.div className="qr-actions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}>
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

      <style>{`
        .qr-preview-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .qr-display {
          width: 200px;
          height: 200px;
          background: #fff;
          border-radius: 20px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        @media (min-width: 768px) {
          .qr-display { width: 240px; height: 240px; }
        }
        .qr-svg-container {
          width: 88%;
          height: 88%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qr-svg-container svg {
          width: 100%;
          height: 100%;
        }
        .qr-loading, .qr-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--text-3);
          font-size: 0.8rem;
          text-align: center;
          line-height: 1.5;
        }
        .qr-placeholder {
          display: grid;
          grid-template-columns: repeat(3, 28px);
          grid-template-rows: repeat(3, 28px);
          gap: 4px;
          opacity: 0.2;
        }
        .qr-placeholder-block {
          background: var(--text-3);
          border-radius: 4px;
        }
        .qr-placeholder-block.corner {
          background: var(--text);
          border-radius: 6px;
        }
        .spin {
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .qr-title-display {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.02em;
          text-align: center;
          max-width: 240px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .qr-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .qr-actions .btn-ghost {
          font-size: 0.8125rem;
          padding: 7px 12px;
        }
      `}</style>
    </div>
  )
}

export default QRPreview
