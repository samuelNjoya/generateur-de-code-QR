import { useState } from 'react'
import { Mail, User, AlignLeft } from 'lucide-react'
import { buildMailto } from '../../utils/helpers'

export function EmailForm({ onChange }) {
  const [form, setForm] = useState({ to: '', subject: '', body: '' })

  const update = (key, val) => {
    const next = { ...form, [key]: val }
    setForm(next)
    onChange(next.to ? buildMailto(next) : '')
  }

  return (
    <div>
      <div className="field">
        <label className="label">Destinataire *</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><Mail size={16} strokeWidth={1.5} /></span>
          <input className="input-with-icon" type="email" placeholder="contact@entreprise.com" value={form.to} onChange={e => update('to', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="label">Objet</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><User size={16} strokeWidth={1.5} /></span>
          <input className="input-with-icon" placeholder="Demande d'information" value={form.subject} onChange={e => update('subject', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="label">Corps du message</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><AlignLeft size={16} strokeWidth={1.5} /></span>
          <textarea className="input-with-icon" placeholder="Bonjour, je souhaiterais..." value={form.body} onChange={e => update('body', e.target.value)} />
        </div>
      </div>
    </div>
  )
}