import { useState, useCallback } from 'react'
import { Upload, X, Plus } from 'lucide-react'
import { DEFAULT_LOGOS } from '../../data/logos'

function LogoPicker({ logo, onLogoChange }) {
  const [dragging, setDragging] = useState(false)

  const handleFileUpload = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => onLogoChange(e.target.result)
    reader.readAsDataURL(file)
  }, [onLogoChange])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }, [handleFileUpload])

  return (
    <div>
      <label className="label">Logo central</label>
      <div className="logo-grid">
        {DEFAULT_LOGOS.map(l => (
          <button
            key={l.id}
            className={`logo-item ${logo === l.svg ? 'active' : ''}`}
            onClick={() => onLogoChange(l.id === 'empty' ? null : l.svg)}
            title={l.name}
          >
            <span className="logo-svg" dangerouslySetInnerHTML={{ __html: l.svg }} />
            <span className="logo-name">{l.name}</span>
          </button>
        ))}

        {/* Upload personnalisé */}
        <button
          className={`logo-item logo-item-upload ${dragging ? 'drag-over' : ''}`}
          onClick={() => document.getElementById('logo-file-input').click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          title="Importer votre logo"
        >
          {logo && !DEFAULT_LOGOS.some(l => l.svg === logo) ? (
            <>
              <span className="logo-svg">
                <img src={logo} alt="Logo personnalisé" className="logo-custom-preview" />
              </span>
              <span className="logo-name">Mon logo</span>
            </>
          ) : (
            <>
              <span className="logo-svg logo-svg-placeholder">
                <Plus size={18} strokeWidth={1.5} />
              </span>
              <span className="logo-name">Importer</span>
            </>
          )}
        </button>
        <input
          id="logo-file-input"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => handleFileUpload(e.target.files[0])}
        />
      </div>

      {logo && DEFAULT_LOGOS.some(l => l.svg === logo) && (
        <div className="logo-active-info">
          <span className="logo-svg-sm" dangerouslySetInnerHTML={{ __html: logo }} />
          <span>{DEFAULT_LOGOS.find(l => l.svg === logo)?.name} sélectionné</span>
          <button className="btn-icon-sm" onClick={() => onLogoChange(null)}><X size={12} /></button>
        </div>
      )}
    </div>
  )
}

export default LogoPicker