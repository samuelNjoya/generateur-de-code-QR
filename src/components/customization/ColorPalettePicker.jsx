import { Palette } from 'lucide-react'

function ColorPalettePicker({ label, colors, value, onChange, icon: Icon }) {
  return (
    <div>
      <div className="color-palette-header">
        {Icon && <Icon size={14} strokeWidth={1.5} />}
        <span>{label}</span>
        <span className="color-value" style={{ backgroundColor: value }} />
        <span className="color-hex">{value}</span>
      </div>
      <div className="color-palette-grid">
        {colors.map(c => (
          <button
            key={c.hex}
            className={`color-swatch-btn ${value === c.hex ? 'active' : ''}`}
            style={{ backgroundColor: c.hex }}
            onClick={() => onChange(c.hex)}
            title={c.name}
            aria-label={c.name}
          >
            {value === c.hex && (
              <span className="color-check">✓</span>
            )}
          </button>
        ))}
        <div className="color-swatch-custom">
          <div className="color-swatch-input-wrapper">
            <input
              type="color"
              value={value}
              onChange={e => onChange(e.target.value)}
              aria-label="Couleur personnalisée"
            />
            <Palette size={14} strokeWidth={1.5} />
          </div>
          <span className="color-swatch-label">Perso</span>
        </div>
      </div>
    </div>
  )
}

export default ColorPalettePicker