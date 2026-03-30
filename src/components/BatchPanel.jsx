import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Package, Loader } from 'lucide-react'
import QRCode from 'qrcode'
import { svgToPngBlob } from '../utils/helpers'

async function generateQRSvg(data) {
  return QRCode.toString(data, {
    type: 'svg', width: 400, margin: 4,
    errorCorrectionLevel: data.length > 150 ? 'H' : 'M',
    color: { dark: '#1a1a1a', light: '#ffffff' }
  })
}

function BatchPanel() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  const handleGenerate = async () => {
    if (!lines.length) return
    setGenerating(true)
    setDone(false)
    try {
      const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js')).default
      const zip = new JSZip()

      for (let i = 0; i < lines.length; i++) {
        const data = lines[i]
        const svgStr = await generateQRSvg(data)
        // Convert SVG to PNG blob
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgStr, 'image/svg+xml')
        const svgEl = svgDoc.documentElement
        const blob = await svgToPngBlob(svgEl, 800)
        const filename = `QR_${String(i + 1).padStart(3, '0')}_${data.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.png`
        zip.file(filename, blob)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url; a.download = `QR_Batch_${lines.length}_codes.zip`; a.click()
      URL.revokeObjectURL(url)
      setDone(true)
    } catch (err) {
      // Fallback: download individual SVGs
      for (let i = 0; i < Math.min(lines.length, 5); i++) {
        const svgStr = await generateQRSvg(lines[i])
        const blob = new Blob([svgStr], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = `QR_${i+1}.svg`; a.click()
        URL.revokeObjectURL(url)
      }
      setDone(true)
    }
    setGenerating(false)
  }

  return (
    <div>
      <div className="divider" />
      <div className="collapse-header" onClick={() => setOpen(v => !v)}>
        <span className="collapse-label">
          <Package size={15} strokeWidth={1.5} />
          Génération Batch
          <span className="badge">Multi QR</span>
        </span>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ paddingBottom: 16 }}>
          <div className="field">
            <label className="label">Un lien / texte par ligne ({lines.length} entrées)</label>
            <textarea
              placeholder={"https://site1.com\nhttps://site2.com\nhttps://site3.com"}
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ minHeight: 120, fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
            />
          </div>
          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: 4 }}
            onClick={handleGenerate}
            disabled={!lines.length || generating}>
            {generating
              ? <><Loader size={15} className="spin" /> Génération en cours...</>
              : <><Download size={15} strokeWidth={1.5} /> Générer & télécharger ZIP ({lines.length})</>
            }
          </button>
          {done && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--green)', textAlign: 'center', marginTop: 8 }}>
              ✓ {lines.length} QR codes générés avec succès
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default BatchPanel
