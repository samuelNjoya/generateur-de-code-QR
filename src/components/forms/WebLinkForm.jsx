import { useState, useEffect } from 'react'
import { Link } from 'lucide-react'
import { normalizeUrl, isValidUrl } from '../../utils/helpers'

export function WebLinkForm({ onChange, initialData, isEditing }) {
  const [url, setUrl] = useState('')
  const [valid, setValid] = useState(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (isEditing && initialData && !initialized) {
      setUrl(initialData)
      setValid(isValidUrl(initialData))
      onChange(initialData)
      setInitialized(true)
    }
  }, [isEditing, initialData, initialized, onChange])

  const handleChange = (val) => {
    setUrl(val)
    if (!val) { setValid(null); onChange(''); return }
    const normalized = normalizeUrl(val)
    const ok = isValidUrl(normalized)
    setValid(ok)
    onChange(ok ? normalized : '')
  }

  return (
    <div className="field">
      <label className="label">URL du lien *</label>
      <div className="input-icon-wrapper">
        <span className="input-icon"><Link size={16} strokeWidth={1.5} /></span>
        <input
          type="url"
          className={`input-with-icon ${valid === false ? 'input-error' : valid === true ? 'input-valid' : ''}`}
          placeholder="exemple.com ou https://..."
          value={url}
          onChange={e => handleChange(e.target.value)}
        />
      </div>
      {url && valid && (
        <p className="field-hint">{normalizeUrl(url)}</p>
      )}
      {url && valid === false && (
        <p className="field-error">URL invalide</p>
      )}
    </div>
  )
}