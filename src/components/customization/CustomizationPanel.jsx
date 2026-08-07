import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, SlidersHorizontal, Image, Lock } from 'lucide-react'
import Collapse from '../ui/Collapse'
import SegmentControl from '../ui/SegmentControl'
import TemplateSelector from './TemplateSelector'
import ColorPalettePicker from './ColorPalettePicker'
import LogoPicker from './LogoPicker'
import { QR_COLORS, BG_COLORS } from '../../data/colors'
import { contrastWarning } from '../../utils/helpers'
import { AlertTriangle } from 'lucide-react'

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

function CustomizationPanel({ style, onStyleChange, onLogoChange, logo, data, password, onPasswordChange }) {
  const [showPass, setShowPass] = useState(false)
  const warning = contrastWarning(style.fgColor, style.bgColor)

  const handleTemplateSelect = (template) => {
    onStyleChange({
      moduleShape: template.moduleShape,
      eyeShape: template.eyeShape,
      fgColor: template.fgColor,
      bgColor: template.bgColor,
      margin: template.margin,
    })
  }

  return (
    <div>
      <Collapse
        icon={SlidersHorizontal}
        label="Personnalisation"
        badge="Optionnel"
        defaultOpen={false}
      >
        <div className="customization-content">
          {/* Templates */}
          <TemplateSelector currentStyle={style} onSelectTemplate={handleTemplateSelect} />

          <div className="divider-sm" />

          {/* Forme des modules */}
          <div className="field">
            <label className="label">Forme des modules</label>
            <SegmentControl options={MODULE_SHAPES} value={style.moduleShape} onChange={(val) => onStyleChange({ moduleShape: val })} />
          </div>

          {/* Style des yeux */}
          <div className="field">
            <label className="label">Style des yeux (coins)</label>
            <SegmentControl options={EYE_SHAPES} value={style.eyeShape} onChange={(val) => onStyleChange({ eyeShape: val })} />
          </div>

          {/* Marge */}
          <div className="field">
            <div className="range-header">
              <label className="label" style={{ marginBottom: 0 }}>Marge silencieuse</label>
              <span className="range-value">{style.margin}px</span>
            </div>
            <input type="range" min="2" max="8" step="1" value={style.margin} onChange={e => onStyleChange({ margin: parseInt(e.target.value) })} />
          </div>

          <div className="divider-sm" />

          {/* Palette couleurs QR */}
          <ColorPalettePicker
            label="Couleur du QR"
            colors={QR_COLORS}
            value={style.fgColor}
            onChange={(fgColor) => onStyleChange({ fgColor })}
            icon={null}
          />

          <div className="field-spacer" />

          {/* Palette couleurs fond */}
          <ColorPalettePicker
            label="Couleur du fond"
            colors={BG_COLORS}
            value={style.bgColor}
            onChange={(bgColor) => onStyleChange({ bgColor })}
            icon={null}
          />

          {warning && (
            <div className={`contrast-warning ${warning.level === 'error' ? 'contrast-error' : 'contrast-warn'}`}>
              <AlertTriangle size={13} strokeWidth={1.5} />
              {warning.msg}
            </div>
          )}

          <div className="divider-sm" />

          {/* Logo */}
          <LogoPicker logo={logo} onLogoChange={onLogoChange} />

          <div className="divider-sm" />

          {/* Password protection */}
          <div className="field">
            <label className="label">
              <Lock size={13} strokeWidth={1.5} /> Protéger par mot de passe
            </label>
            <div className="input-icon-wrapper">
              <span className="input-icon"><Lock size={15} strokeWidth={1.5} /></span>
              <input
                className="input-with-icon input-with-suffix"
                type={showPass ? 'text' : 'password'}
                placeholder="Laisser vide pour ne pas protéger"
                value={password || ''}
                onChange={e => onPasswordChange(e.target.value)}
              />
              <button type="button" className="input-suffix-btn" onClick={() => setShowPass(v => !v)}>
                {showPass ? 'Cacher' : 'Voir'}
              </button>
            </div>
            {password && (
              <p className="field-hint">Le contenu sera chiffré localement. Il faudra ce mot de passe pour le révéler au scan.</p>
            )}
          </div>
        </div>
      </Collapse>
    </div>
  )
}

export default CustomizationPanel