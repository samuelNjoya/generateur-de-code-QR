import { useState } from 'react'
import { User, Building, Briefcase, Mail, Phone } from 'lucide-react'
import { buildVCard } from '../../utils/helpers'

export function VCardForm({ onChange }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', org: '', title: '', email: '', phone1: '', phone2: '' })

  const update = (key, val) => {
    const next = { ...form, [key]: val }
    setForm(next)
    const data = buildVCard(next)
    onChange(Object.values(next).some(v => v) ? data : '')
  }

  return (
    <div>
      <div className="form-row">
        <div className="field">
          <label className="label">Prénom</label>
          <div className="input-icon-wrapper">
            <span className="input-icon"><User size={16} strokeWidth={1.5} /></span>
            <input className="input-with-icon" placeholder="Jean" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label className="label">Nom *</label>
          <div className="input-icon-wrapper">
            <span className="input-icon"><User size={16} strokeWidth={1.5} /></span>
            <input className="input-with-icon" placeholder="Dupont" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Organisation</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><Building size={16} strokeWidth={1.5} /></span>
          <input className="input-with-icon" placeholder="Entreprise SARL" value={form.org} onChange={e => update('org', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="label">Titre / Fonction</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><Briefcase size={16} strokeWidth={1.5} /></span>
          <input className="input-with-icon" placeholder="Directeur Commercial" value={form.title} onChange={e => update('title', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="label">Email professionnel</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><Mail size={16} strokeWidth={1.5} /></span>
          <input className="input-with-icon" type="email" placeholder="jean@entreprise.com" value={form.email} onChange={e => update('email', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="label">Téléphone principal (Mobile)</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><Phone size={16} strokeWidth={1.5} /></span>
          <input className="input-with-icon" type="tel" placeholder="+237 6XX XXX XXX" value={form.phone1} onChange={e => update('phone1', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="label">Téléphone secondaire (Fixe)</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><Phone size={16} strokeWidth={1.5} /></span>
          <input className="input-with-icon" type="tel" placeholder="+237 2XX XXX XXX" value={form.phone2} onChange={e => update('phone2', e.target.value)} />
        </div>
      </div>
    </div>
  )
}