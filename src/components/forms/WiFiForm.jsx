import { useState } from 'react'
import { Wifi, Lock, Eye, EyeOff } from 'lucide-react'
import { buildWifiString } from '../../utils/helpers'

export function WiFiForm({ onChange }) {
  const [form, setForm] = useState({ ssid: '', password: '', security: 'WPA', hidden: false })
  const [showPass, setShowPass] = useState(false)

  const update = (key, val) => {
    const next = { ...form, [key]: val }
    setForm(next)
    onChange(next.ssid ? buildWifiString(next) : '')
  }

  return (
    <div>
      <div className="field">
        <label className="label">Nom du réseau (SSID) *</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><Wifi size={16} strokeWidth={1.5} /></span>
          <input className="input-with-icon" placeholder="MonWiFi_Maison" value={form.ssid} onChange={e => update('ssid', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="label">Type de sécurité</label>
        <div className="segment-control">
          {['WPA', 'WEP', 'nopass'].map(s => (
            <button key={s} className={`segment-btn ${form.security === s ? 'active' : ''}`} onClick={() => update('security', s)}>
              {s === 'nopass' ? 'Ouvert' : s}
            </button>
          ))}
        </div>
      </div>
      {form.security !== 'nopass' && (
        <div className="field">
          <label className="label">Mot de passe</label>
          <div className="input-icon-wrapper">
            <span className="input-icon"><Lock size={16} strokeWidth={1.5} /></span>
            <input className="input-with-icon input-with-suffix" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => update('password', e.target.value)} />
            <button type="button" className="input-suffix-btn" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      )}
      <div className="field-checkbox">
        <input type="checkbox" id="hidden-net" checked={form.hidden} onChange={e => update('hidden', e.target.checked)} />
        <label htmlFor="hidden-net">Réseau masqué (hidden)</label>
      </div>
    </div>
  )
}