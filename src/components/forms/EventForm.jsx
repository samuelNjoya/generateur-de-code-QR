import { useState } from 'react'
import { CalendarDays, MapPin, AlignLeft } from 'lucide-react'
import { buildVEvent } from '../../utils/helpers'

export function EventForm({ onChange }) {
  const [form, setForm] = useState({ title: '', location: '', description: '', startDate: '', endDate: '' })

  const update = (key, val) => {
    const next = { ...form, [key]: val }
    setForm(next)
    onChange(next.title && next.startDate ? buildVEvent(next) : '')
  }

  return (
    <div>
      <div className="field">
        <label className="label">Titre de l'événement *</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><CalendarDays size={16} strokeWidth={1.5} /></span>
          <input className="input-with-icon" placeholder="Réunion de lancement" value={form.title} onChange={e => update('title', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label className="label">Début *</label>
          <input type="datetime-local" value={form.startDate} onChange={e => update('startDate', e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Fin</label>
          <input type="datetime-local" value={form.endDate} onChange={e => update('endDate', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="label">Lieu</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><MapPin size={16} strokeWidth={1.5} /></span>
          <input className="input-with-icon" placeholder="Hôtel Hilton, Yaoundé" value={form.location} onChange={e => update('location', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="label">Description</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><AlignLeft size={16} strokeWidth={1.5} /></span>
          <textarea className="input-with-icon" placeholder="Ordre du jour, informations supplémentaires..." value={form.description} onChange={e => update('description', e.target.value)} />
        </div>
      </div>
    </div>
  )
}