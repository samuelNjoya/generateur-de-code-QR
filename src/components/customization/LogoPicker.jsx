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

  const isCustomLogo = logo && !DEFAULT_LOGOS.some(l => l.svg === logo)

  return (
    <div>
      <label className="label">Choisir un logo</label>
      <div className="logo-grid">
        {DEFAULT_LOGOS.map(l => (
          <button
            key={l.id}
            className={`logo-item ${logo === l.svg ? 'active' : ''}`}
            onClick={() => onLogoChange(l.id === 'empty' ? null : l.svg)}
            title={l.name}
          >
            <span 
              className="logo-svg-wrapper"
              dangerouslySetInnerHTML={{ __html: l.svg }}
            />
            <span className="logo-name">{l.name}</span>
          </button>
        ))}

        <button
          className={`logo-item logo-item-upload ${dragging ? 'drag-over' : ''} ${isCustomLogo ? 'active' : ''}`}
          onClick={() => document.getElementById('logo-file-input').click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          title="Importer votre logo"
        >
          {isCustomLogo ? (
            <>
              <span className="logo-svg-wrapper">
                <img src={logo} alt="Logo personnalisé" className="logo-custom-preview" />
              </span>
              <span className="logo-name">Mon logo</span>
            </>
          ) : (
            <>
              <span className="logo-svg-wrapper logo-svg-placeholder">
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
    </div>
  )
}

export default LogoPicker