import { useState } from 'react'
import { Smartphone } from 'lucide-react'

export function USSDForm({ onChange }) {
  const [code, setCode] = useState('')

  const update = (val) => {
    setCode(val)
    onChange(val.trim())
  }

  return (
    <div>
      <div className="field">
        <label className="label">Expression USSD *</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><Smartphone size={16} strokeWidth={1.5} /></span>
          <input
            className="input-with-icon"
            style={{ fontFamily: 'var(--font-mono)' }}
            placeholder="#150*11*5000*numero#"
            value={code}
            onChange={e => update(e.target.value)}
          />
        </div>
        <p className="field-hint">Le QR encodera cette chaîne exacte, composée automatiquement à la lecture.</p>
      </div>
    </div>
  )
}