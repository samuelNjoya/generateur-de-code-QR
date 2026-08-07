import { useState, useEffect } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { buildWhatsAppUrl, COUNTRY_CODES } from '../../utils/helpers'

export function WhatsAppForm({ onChange, initialData, isEditing }) {
  const [countryCode, setCountryCode] = useState('+237')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (isEditing && initialData && !initialized) {
      setInitialized(true)
      try {
        const url = new URL(initialData)
        const path = url.pathname.replace('/', '')
        const textParam = url.searchParams.get('text')
        if (textParam) setMessage(decodeURIComponent(textParam))
        if (path) {
          for (const cc of COUNTRY_CODES) {
            if (path.startsWith(cc.code.replace('+', ''))) {
              setCountryCode(cc.code)
              setPhone(path.replace(cc.code.replace('+', ''), ''))
              break
            }
          }
        }
      } catch {
        setPhone(initialData)
      }
      onChange(initialData)
    }
  }, [isEditing, initialData, initialized, onChange])

  const handlePhoneChange = (val) => {
    const cleaned = val.replace(/[^\d]/g, '')
    setPhone(cleaned)
    if (!cleaned) { onChange(''); return }
    const full = countryCode + cleaned
    onChange(buildWhatsAppUrl(full, message))
  }

  const handleMessageChange = (val) => {
    setMessage(val)
    if (!phone) return
    const full = countryCode + phone
    onChange(buildWhatsAppUrl(full, val))
  }

  useEffect(() => {
    if (!phone) { onChange(''); return }
    const full = countryCode + phone
    onChange(buildWhatsAppUrl(full, message))
  }, [countryCode])

  return (
    <div>
      <div className="field">
        <label className="label">Numéro WhatsApp *</label>
        <div className="phone-row-input">
          <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="select-country">
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>
          <div className="input-icon-wrapper" style={{ flex: 1 }}>
            <span className="input-icon"><Phone size={16} strokeWidth={1.5} /></span>
            <input
              className={`input-with-icon ${phone && phone.length < 6 ? 'input-error' : phone ? 'input-valid' : ''}`}
              type="tel"
              placeholder="6XX XXX XXX"
              value={phone}
              onChange={e => handlePhoneChange(e.target.value)}
            />
          </div>
        </div>
        {phone && phone.length < 6 && (
          <p className="field-error">Numéro trop court (min. 6 chiffres)</p>
        )}
      </div>
      <div className="field">
        <label className="label">Message pré-rempli (optionnel)</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><MessageCircle size={16} strokeWidth={1.5} /></span>
          <textarea className="input-with-icon" placeholder="Bonjour, je vous contacte suite à..." value={message} onChange={e => handleMessageChange(e.target.value)} />
        </div>
        <p className="field-hint">{message.length} caractères</p>
      </div>
    </div>
  )
}