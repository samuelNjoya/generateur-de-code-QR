import { useState, useEffect } from 'react'
import { MapPin, Navigation, Search } from 'lucide-react'
import { buildGeoUrl } from '../../utils/helpers'

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
      <div className="form-row">
        <div className="field">
          <label className="label">Latitude *</label>
          <div className="input-icon-wrapper">
            <span className="input-icon"><MapPin size={16} strokeWidth={1.5} /></span>
            <input className="input-with-icon" placeholder="3.8480" value={lat} onChange={e => setLat(e.target.value)} type="number" step="any" />
          </div>
        </div>
        <div className="field">
          <label className="label">Longitude *</label>
          <div className="input-icon-wrapper">
            <span className="input-icon"><MapPin size={16} strokeWidth={1.5} /></span>
            <input className="input-with-icon" placeholder="11.5021" value={lng} onChange={e => setLng(e.target.value)} type="number" step="any" />
          </div>
        </div>
      </div>
      <button type="button" className="btn-ghost" style={{ width: '100%', marginTop: 4 }} onClick={geolocate} disabled={locating}>
        <Navigation size={15} strokeWidth={1.5} />
        {locating ? 'Localisation...' : 'Utiliser ma position actuelle'}
      </button>
      <div className="field">
        <label className="label">Nom du lieu (optionnel)</label>
        <div className="input-icon-wrapper">
          <span className="input-icon"><Search size={16} strokeWidth={1.5} /></span>
          <input className="input-with-icon" placeholder="Mon Bureau, Yaoundé" value={label} onChange={e => setLabel(e.target.value)} />
        </div>
      </div>
      {lat && lng && (
        <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noreferrer" className="field-link">
          Voir sur Google Maps
        </a>
      )}
    </div>
  )
}