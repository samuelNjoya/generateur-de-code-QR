import { useState } from 'react'
import { Type } from 'lucide-react'

export function TextForm({ onChange }) {
  const [text, setText] = useState('')

  const update = (val) => {
    setText(val)
    onChange(val.trim())
  }

  return (
    <div>
      <div className="field">
        <label className="label">Contenu texte *</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><Type size={16} strokeWidth={1.5} /></span>
          <textarea
            className="input-with-icon"
            style={{ minHeight: 140 }}
            placeholder="Écrivez ici le texte à encoder dans le QR code…"
            value={text}
            onChange={e => update(e.target.value)}
          />
        </div>
        <p className="field-hint">{text.length} caractères</p>
      </div>
    </div>
  )
}