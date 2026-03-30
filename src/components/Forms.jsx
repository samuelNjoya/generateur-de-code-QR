import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { normalizeUrl, isValidUrl, buildVCard, buildWhatsAppUrl, buildWifiString, buildGeoUrl, buildVEvent, COUNTRY_CODES } from '../utils/helpers'

// ── Web Link ─────────────────────────────────────────────────────────────────
export function WebLinkForm({ onChange }) {
  const [url, setUrl] = useState('')
  const [valid, setValid] = useState(null)

  const handleChange = (val) => {
    setUrl(val)
    if (!val) { setValid(null); onChange(''); return }
    const normalized = normalizeUrl(val)
    const ok = isValidUrl(normalized)
    setValid(ok)
    onChange(ok ? normalized : '')
  }

  return (
    <div>
      <div className="field">
        <label className="label">URL du lien *</label>
        <div style={{ position: 'relative' }}>
          <input
            type="url"
            placeholder="exemple.com ou https://..."
            value={url}
            onChange={e => handleChange(e.target.value)}
            style={{ paddingRight: 36, borderColor: valid === false ? 'var(--red)' : valid === true ? 'var(--green)' : undefined }}
          />
          {valid !== null && (
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem' }}>
              {valid ? '✓' : '✗'}
            </span>
          )}
        </div>
        {url && !valid && (
          <p style={{ fontSize: '0.75rem', color: 'var(--red)', marginTop: 4 }}>URL invalide</p>
        )}
        {url && valid && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            → {normalizeUrl(url)}
          </p>
        )}
      </div>
    </div>
  )
}

// ── vCard ────────────────────────────────────────────────────────────────────
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
      <div className="row">
        <div className="field">
          <label className="label">Prénom</label>
          <input placeholder="Jean" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Nom *</label>
          <input placeholder="Dupont" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
        </div>
      </div>
      <div className="field" style={{ marginTop: 14 }}>
        <label className="label">Organisation</label>
        <input placeholder="Entreprise SARL" value={form.org} onChange={e => update('org', e.target.value)} />
      </div>
      <div className="field">
        <label className="label">Titre / Fonction</label>
        <input placeholder="Directeur Commercial" value={form.title} onChange={e => update('title', e.target.value)} />
      </div>
      <div className="field">
        <label className="label">Email professionnel</label>
        <input type="email" placeholder="jean@entreprise.com" value={form.email} onChange={e => update('email', e.target.value)} />
      </div>
      <div className="field">
        <label className="label">Téléphone principal (Mobile)</label>
        <input type="tel" placeholder="+237 6XX XXX XXX" value={form.phone1} onChange={e => update('phone1', e.target.value)} />
      </div>
      <div className="field">
        <label className="label">Téléphone secondaire (Fixe)</label>
        <input type="tel" placeholder="+237 2XX XXX XXX" value={form.phone2} onChange={e => update('phone2', e.target.value)} />
      </div>
    </div>
  )
}

// ── WhatsApp ─────────────────────────────────────────────────────────────────
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
        <div className="phone-row">
          <select value={countryCode} onChange={e => setCountryCode(e.target.value)} style={{ width: 'auto', minWidth: 130 }}>
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>
          <input type="tel" placeholder="6XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="label">Message pré-rempli (optionnel)</label>
        <textarea
          placeholder="Bonjour, je vous contacte suite à..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{ minHeight: 80 }}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 4 }}>{message.length} caractères — encodé automatiquement</p>
      </div>
    </div>
  )
}

// ── WiFi ─────────────────────────────────────────────────────────────────────
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
        <input placeholder="MonWiFi_Maison" value={form.ssid} onChange={e => update('ssid', e.target.value)} />
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
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              style={{ paddingRight: 44 }}
            />
            <button onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '0.75rem' }}>
              {showPass ? 'Cacher' : 'Voir'}
            </button>
          </div>
        </div>
      )}
      <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 }}>
        <input type="checkbox" id="hidden-net" checked={form.hidden} onChange={e => update('hidden', e.target.checked)} style={{ width: 18, height: 18, borderRadius: 4 }} />
        <label htmlFor="hidden-net" style={{ fontSize: '0.875rem', color: 'var(--text-2)', cursor: 'pointer', margin: 0 }}>Réseau masqué (hidden)</label>
      </div>
    </div>
  )
}

// ── GPS Location ─────────────────────────────────────────────────────────────
export function GPSForm({ onChange }) {
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [label, setLabel] = useState('')
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
      onChange(buildGeoUrl(lat, lng, label))
    } else { onChange('') }
  }, [lat, lng, label])

  const geolocate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(pos => {
      setLat(pos.coords.latitude.toFixed(6))
      setLng(pos.coords.longitude.toFixed(6))
      setLocating(false)
    }, () => setLocating(false))
  }

  return (
    <div>
      <div className="row">
        <div className="field">
          <label className="label">Latitude *</label>
          <input placeholder="3.8480" value={lat} onChange={e => setLat(e.target.value)} type="number" step="any" />
        </div>
        <div className="field">
          <label className="label">Longitude *</label>
          <input placeholder="11.5021" value={lng} onChange={e => setLng(e.target.value)} type="number" step="any" />
        </div>
      </div>
      <button className="btn-ghost" style={{ marginTop: 10, width: '100%' }} onClick={geolocate} disabled={locating}>
        {locating ? '📍 Localisation...' : '📍 Utiliser ma position actuelle'}
      </button>
      <div className="field" style={{ marginTop: 14 }}>
        <label className="label">Nom du lieu (optionnel)</label>
        <input placeholder="Mon Bureau, Yaoundé" value={label} onChange={e => setLabel(e.target.value)} />
      </div>
      {lat && lng && (
        <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noreferrer"
          style={{ fontSize: '0.8125rem', color: 'var(--blue)', display: 'block', marginTop: 8 }}>
          ↗ Voir sur Google Maps
        </a>
      )}
    </div>
  )
}

// ── vEvent / Calendar ────────────────────────────────────────────────────────
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
        <input placeholder="Réunion de lancement" value={form.title} onChange={e => update('title', e.target.value)} />
      </div>
      <div className="row">
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
        <input placeholder="Hôtel Hilton, Yaoundé" value={form.location} onChange={e => update('location', e.target.value)} />
      </div>
      <div className="field">
        <label className="label">Description</label>
        <textarea placeholder="Ordre du jour, informations supplémentaires..." value={form.description} onChange={e => update('description', e.target.value)} />
      </div>
    </div>
  )
}
