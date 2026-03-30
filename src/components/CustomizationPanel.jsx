import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Palette, Image, Trash2, AlertTriangle } from 'lucide-react'
import { contrastWarning, getECL } from '../utils/helpers'

const MODULE_SHAPES = [
  { id: 'square', label: 'Carré' },
  { id: 'rounded', label: 'Arrondi' },
  { id: 'dots', label: 'Ronds' },
]

const EYE_SHAPES = [
  { id: 'square', label: 'Carré' },
  { id: 'rounded', label: 'Arrondi' },
  { id: 'circle', label: 'Cercle' },
]

function CustomizationPanel({ style, onStyleChange, onLogoChange, logo, data }) {
  const [open, setOpen] = useState(false)
  const [dragging, setDragging] = useState(false)

  const ecl = getECL(data || '', !!logo)
  const warning = contrastWarning(style.fgColor, style.bgColor)

  const handleLogoUpload = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => onLogoChange(e.target.result)
    reader.readAsDataURL(file)
  }, [onLogoChange])

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    handleLogoUpload(file)
  }, [handleLogoUpload])

  return (
    <div>
      <div className="divider" />

      {/* Collapse toggle */}
      <div className="collapse-header" onClick={() => setOpen(v => !v)}>
        <span className="collapse-label">
          <Palette size={15} strokeWidth={1.5} />
          Personnalisation avancée
          <span className="badge">Optionnel</span>
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} strokeWidth={1.5} style={{ color: 'var(--text-3)' }} />
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}>

            <div style={{ paddingBottom: 16 }}>

              {/* Colors */}
              <div className="field">
                <label className="label">Couleurs</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 6 }}>QR Code</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="color-swatch">
                        <input type="color" value={style.fgColor} onChange={e => onStyleChange({ fgColor: e.target.value })} />
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{style.fgColor}</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 6 }}>Fond</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="color-swatch">
                        <input type="color" value={style.bgColor} onChange={e => onStyleChange({ bgColor: e.target.value })} />
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{style.bgColor}</span>
                    </div>
                  </div>
                </div>
                {warning && (
                  <div className="contrast-warning" style={{ color: warning.level === 'error' ? 'var(--red)' : 'var(--amber)' }}>
                    <AlertTriangle size={12} />
                    {warning.msg}
                  </div>
                )}
              </div>

              {/* Module shape */}
              <div className="field">
                <label className="label">Forme des modules</label>
                <div className="segment-control">
                  {MODULE_SHAPES.map(s => (
                    <button key={s.id} className={`segment-btn ${style.moduleShape === s.id ? 'active' : ''}`} onClick={() => onStyleChange({ moduleShape: s.id })}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eye shape */}
              <div className="field">
                <label className="label">Style des yeux (coins)</label>
                <div className="segment-control">
                  {EYE_SHAPES.map(s => (
                    <button key={s.id} className={`segment-btn ${style.eyeShape === s.id ? 'active' : ''}`} onClick={() => onStyleChange({ eyeShape: s.id })}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margin */}
              <div className="field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label className="label" style={{ marginBottom: 0 }}>Marge silencieuse</label>
                  <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{style.margin}px</span>
                </div>
                <input type="range" min="2" max="8" step="1" value={style.margin} onChange={e => onStyleChange({ margin: parseInt(e.target.value) })} />
              </div>

              {/* Logo */}
              <div className="field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label className="label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Image size={13} strokeWidth={1.5} /> Logo central
                  </label>
                  {logo && (
                    <button className="btn-icon" style={{ width: 28, height: 28, borderRadius: 6 }} onClick={() => onLogoChange(null)}>
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                {logo ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={logo} className="logo-preview" alt="Logo" />
                    <div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)', fontWeight: 500 }}>Logo chargé ✓</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 2 }}>ECL forcé en <span className="ecl-badge">H</span></p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`drop-zone ${dragging ? 'drag-over' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('logo-upload').click()}>
                    <Image size={20} strokeWidth={1.5} style={{ color: 'var(--text-3)', margin: '0 auto' }} />
                    <p>Glissez un logo ou <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>cliquez pour choisir</span></p>
                  </div>
                )}
                <input id="logo-upload" type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => handleLogoUpload(e.target.files[0])} />
              </div>

              {/* ECL info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>Correction d'erreur</span>
                <span className="ecl-badge">{ecl}</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomizationPanel
