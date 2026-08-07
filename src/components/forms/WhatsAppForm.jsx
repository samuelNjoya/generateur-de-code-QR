import { useState, useEffect } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { buildWhatsAppUrl, COUNTRY_CODES } from '../../utils/helpers'

export function WhatsAppForm({ onChange }) {
  const [countryCode, setCountryCode] = useState('+237')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!phone) { onChange(''); return }
    const full = countryCode + phone.replace(/^0/, '')
    onChange(buildWhatsAppUrl(full, message))
  }, [countryCode, phone, message])

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
            <input className="input-with-icon" type="tel" placeholder="6XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Message pré-rempli (optionnel)</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><MessageCircle size={16} strokeWidth={1.5} /></span>
          <textarea className="input-with-icon" placeholder="Bonjour, je vous contacte suite à..." value={message} onChange={e => setMessage(e.target.value)} />
        </div>
        <p className="field-hint">{message.length} caractères — encodé automatiquement</p>
      </div>
    </div>
  )
}