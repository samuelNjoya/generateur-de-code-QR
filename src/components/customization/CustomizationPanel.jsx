import { useState } from 'react'
import { Palette, Box, Image, Lock, AlertTriangle } from 'lucide-react'
import SegmentControl from '../ui/SegmentControl'
import TemplateSelector from './TemplateSelector'
import ColorPalettePicker from './ColorPalettePicker'
import LogoPicker from './LogoPicker'
import { QR_COLORS, BG_COLORS } from '../../data/colors'
import { contrastWarning } from '../../utils/helpers'

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

const TABS = [
  { id: 'colors', label: 'Couleurs', Icon: Palette },
  { id: 'shapes', label: 'Formes', Icon: Box },
  { id: 'logo', label: 'Logo', Icon: Image },
  { id: 'security', label: 'Sécurité', Icon: Lock },
]

function CustomizationPanel({ style, onStyleChange, onLogoChange, logo, data, password, onPasswordChange }) {
  const [activeTab, setActiveTab] = useState('colors')
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

  const ActiveIcon = TABS.find(t => t.id === activeTab)?.Icon

  return (
    <div className="customization-v2">
      {/* Tabs */}
      <div className="custom-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`custom-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.Icon size={16} strokeWidth={1.5} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="custom-tab-content">
        {activeTab === 'colors' && (
          <div className="custom-tab-panel">
            <TemplateSelector currentStyle={style} onSelectTemplate={handleTemplateSelect} />
            
            <div className="divider-sm" />

            <ColorPalettePicker
              label="Couleur du QR"
              colors={QR_COLORS}
              value={style.fgColor}
              onChange={(fgColor) => onStyleChange({ fgColor })}
            />

            <div className="divider-sm" />

            <ColorPalettePicker
              label="Couleur du fond"
              colors={BG_COLORS}
              value={style.bgColor}
              onChange={(bgColor) => onStyleChange({ bgColor })}
            />

            {warning && (
              <div className={`contrast-warning ${warning.level === 'error' ? 'contrast-error' : 'contrast-warn'}`}>
                <AlertTriangle size={13} strokeWidth={1.5} />
                {warning.msg}
              </div>
            )}
          </div>
        )}

        {activeTab === 'shapes' && (
          <div className="custom-tab-panel">
            <div className="field">
              <label className="label">Forme des modules</label>
              <SegmentControl options={MODULE_SHAPES} value={style.moduleShape} onChange={(val) => onStyleChange({ moduleShape: val })} />
            </div>

            <div className="field">
              <label className="label">Style des coins</label>
              <SegmentControl options={EYE_SHAPES} value={style.eyeShape} onChange={(val) => onStyleChange({ eyeShape: val })} />
            </div>

            <div className="field">
              <div className="range-header">
                <label className="label" style={{ marginBottom: 0 }}>Marge</label>
                <span className="range-value">{style.margin}px</span>
              </div>
              <input type="range" min="2" max="8" step="1" value={style.margin} onChange={e => onStyleChange({ margin: parseInt(e.target.value) })} />
            </div>
          </div>
        )}

        {activeTab === 'logo' && (
          <div className="custom-tab-panel">
            <LogoPicker logo={logo} onLogoChange={onLogoChange} />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="custom-tab-panel">
            <div className="field">
              <label className="label">Mot de passe de protection</label>
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
                <p className="field-hint">Le contenu sera chiffré. Mot de passe requis au scan pour le révéler.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomizationPanel