// ── URL validation & normalization ──────────────────────────────────────────
export function normalizeUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (!/^https?:\/\//i.test(trimmed)) return 'https://' + trimmed
  return trimmed
}

export function isValidUrl(url) {
  try { new URL(url); return true } catch { return false }
}

// ── vCard 3.0 generator ─────────────────────────────────────────────────────
export function buildVCard({ firstName, lastName, org, title, email, phone1, phone2 }) {
  const escape = (s = '') => s.replace(/[,;\\]/g, c => '\\' + c).replace(/\n/g, '\\n')
  const lines = ['BEGIN:VCARD', 'VERSION:3.0']
  const fn = [firstName, lastName].filter(Boolean).map(escape).join(' ')
  if (fn) lines.push(`FN:${fn}`)
  if (lastName || firstName) lines.push(`N:${escape(lastName)};${escape(firstName)};;;`)
  if (org) lines.push(`ORG:${escape(org)}`)
  if (title) lines.push(`TITLE:${escape(title)}`)
  if (email) lines.push(`EMAIL;TYPE=WORK,INTERNET:${email}`)
  if (phone1) lines.push(`TEL;TYPE=CELL:${phone1}`)
  if (phone2) lines.push(`TEL;TYPE=HOME:${phone2}`)
  lines.push('END:VCARD')
  return lines.join('\n')
}

// ── WhatsApp URL ─────────────────────────────────────────────────────────────
export function buildWhatsAppUrl(phone, message) {
  const clean = phone.replace(/\D/g, '')
  const base = `https://wa.me/${clean}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

// ── WiFi string ──────────────────────────────────────────────────────────────
export function buildWifiString({ ssid, password, security, hidden }) {
  const esc = (s = '') => s.replace(/([\\";,:])/g, '\\$1')
  return `WIFI:T:${security};S:${esc(ssid)};P:${esc(password)};H:${hidden ? 'true' : 'false'};;`
}

// ── GPS / Maps URL ───────────────────────────────────────────────────────────
export function buildGeoUrl(lat, lng, label) {
  if (label) return `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`
  return `geo:${lat},${lng}`
}

// ── vEvent / iCal ────────────────────────────────────────────────────────────
export function buildVEvent({ title, location, description, startDate, endDate }) {
  const fmt = (d) => d ? d.replace(/[-:]/g, '').replace('T', 'T').slice(0, 15) : ''
  const escape = (s = '') => s.replace(/[,;\\]/g, c => '\\' + c)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QR Pro//EN',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(startDate)}`,
    `DTEND:${fmt(endDate)}`,
    `SUMMARY:${escape(title)}`,
    location ? `LOCATION:${escape(location)}` : '',
    description ? `DESCRIPTION:${escape(description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n')
}

// ── Contrast ratio check ─────────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function luminance([r, g, b]) {
  const toLinear = c => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

export function getContrastRatio(hex1, hex2) {
  const l1 = luminance(hexToRgb(hex1))
  const l2 = luminance(hexToRgb(hex2))
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function contrastWarning(fgHex, bgHex) {
  const ratio = getContrastRatio(fgHex, bgHex)
  if (ratio < 3) return { level: 'error', msg: `Contraste insuffisant (${ratio.toFixed(1)}:1) — QR illisible` }
  if (ratio < 4.5) return { level: 'warn', msg: `Contraste faible (${ratio.toFixed(1)}:1) — Difficile à scanner` }
  return null
}

// ── ECL decision ─────────────────────────────────────────────────────────────
export function getECL(data, hasLogo) {
  if (hasLogo || data.length > 150) return 'H'
  if (data.length > 80) return 'Q'
  return 'M'
}

// ── History (localStorage) ───────────────────────────────────────────────────
const HISTORY_KEY = 'qrpro_history'

export function saveToHistory(entry) {
  try {
    const list = getHistory()
    const updated = [{ ...entry, savedAt: Date.now() }, ...list.filter(h => h.data !== entry.data)].slice(0, 10)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch (_) {}
}

export function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}

export function clearHistory() {
  try { localStorage.removeItem(HISTORY_KEY) } catch (_) {}
}

// ── Country codes for WhatsApp ────────────────────────────────────────────────
export const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'USA/Canada' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroun' },
  { code: '+225', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { code: '+221', flag: '🇸🇳', name: 'Sénégal' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisie' },
  { code: '+213', flag: '🇩🇿', name: 'Algérie' },
  { code: '+20', flag: '🇪🇬', name: 'Égypte' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+27', flag: '🇿🇦', name: 'Afrique du Sud' },
  { code: '+44', flag: '🇬🇧', name: 'Royaume-Uni' },
  { code: '+49', flag: '🇩🇪', name: 'Allemagne' },
  { code: '+34', flag: '🇪🇸', name: 'Espagne' },
  { code: '+39', flag: '🇮🇹', name: 'Italie' },
  { code: '+32', flag: '🇧🇪', name: 'Belgique' },
  { code: '+41', flag: '🇨🇭', name: 'Suisse' },
  { code: '+55', flag: '🇧🇷', name: 'Brésil' },
  { code: '+52', flag: '🇲🇽', name: 'Mexique' },
  { code: '+57', flag: '🇨🇴', name: 'Colombie' },
  { code: '+91', flag: '🇮🇳', name: 'Inde' },
  { code: '+86', flag: '🇨🇳', name: 'Chine' },
  { code: '+81', flag: '🇯🇵', name: 'Japon' },
  { code: '+82', flag: '🇰🇷', name: 'Corée du Sud' },
  { code: '+971', flag: '🇦🇪', name: 'Émirats Arabes Unis' },
  { code: '+966', flag: '🇸🇦', name: 'Arabie Saoudite' },
  { code: '+7', flag: '🇷🇺', name: 'Russie' },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
  { code: '+31', flag: '🇳🇱', name: 'Pays-Bas' },
]

// ── Export utilities ─────────────────────────────────────────────────────────
export function svgToPngBlob(svgEl, size = 2000) {
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgEl)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size; canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      URL.revokeObjectURL(url)
      canvas.toBlob(resolve, 'image/png', 1.0)
    }
    img.onerror = reject
    img.src = url
  })
}

// Same as svgToPngBlob but reserves a header band to print the QR title above
// the code — used only when a title is present, to preserve exact pixel
// output of svgToPngBlob for existing/untitled exports.
export function svgToPngBlobWithTitle(svgEl, title, size = 2000) {
  if (!title) return svgToPngBlob(svgEl, size)
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgEl)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const titleH = Math.round(size * 0.09)
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size + titleH
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#1a1a1a'
      ctx.font = `600 ${Math.round(titleH * 0.4)}px 'DM Sans', system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(title, canvas.width / 2, titleH / 2, canvas.width * 0.92)
      ctx.drawImage(img, 0, titleH, size, size)
      URL.revokeObjectURL(url)
      canvas.toBlob(resolve, 'image/png', 1.0)
    }
    img.onerror = reject
    img.src = url
  })
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export async function exportPdf(svgEl, title = 'QR Code') {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const svgData = new XMLSerializer().serializeToString(svgEl)
  const blob = new Blob([svgData], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 800; canvas.height = 800
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 800, 800)
      ctx.drawImage(img, 0, 0, 800, 800)
      URL.revokeObjectURL(url)
      const imgData = canvas.toDataURL('image/png', 1.0)
      const pageW = 210, pageH = 297
      const qrSize = 120
      const x = (pageW - qrSize) / 2
      const y = (pageH - qrSize) / 2 - 20
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(26, 26, 26)
      doc.text(title, pageW / 2, y - 12, { align: 'center' })
      doc.addImage(imgData, 'PNG', x, y, qrSize, qrSize)
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 110)
      doc.text('Généré par QR Pro', pageW / 2, y + qrSize + 10, { align: 'center' })
      doc.save(`${title.replace(/\s+/g, '_')}_qrpro.pdf`)
      resolve()
    }
    img.src = url
  })
}

// ── Email (mailto) ───────────────────────────────────────────────────────────
export function buildMailto({ to, subject, body }) {
  const params = []
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
  if (body) params.push(`body=${encodeURIComponent(body)}`)
  const query = params.length ? `?${params.join('&')}` : ''
  return `mailto:${to || ''}${query}`
}

// ── Scanned content parsing (for the Scanner tab) ───────────────────────────
function parseVCardFields(raw) {
  const fields = []
  const get = (re) => (raw.match(re) || [])[1]
  const fn = get(/FN:(.+)/)
  const org = get(/ORG:(.+)/)
  const title = get(/TITLE:(.+)/)
  const email = get(/EMAIL[^:]*:(.+)/)
  const tels = [...raw.matchAll(/TEL[^:]*:(.+)/g)].map(m => m[1])
  if (fn) fields.push({ label: 'Nom', value: fn })
  if (org) fields.push({ label: 'Organisation', value: org })
  if (title) fields.push({ label: 'Fonction', value: title })
  if (email) fields.push({ label: 'Email', value: email })
  tels.forEach((t, i) => fields.push({ label: i === 0 ? 'Téléphone' : 'Téléphone 2', value: t }))
  return fields
}

function parseWifiFields(raw) {
  const get = (re) => (raw.match(re) || [])[1]
  const ssid = (get(/S:((?:[^\\;]|\\.)*);/) || '').replace(/\\(.)/g, '$1')
  const password = (get(/P:((?:[^\\;]|\\.)*);/) || '').replace(/\\(.)/g, '$1')
  const security = get(/T:([^;]*);/)
  return [
    { label: 'Réseau (SSID)', value: ssid },
    { label: 'Sécurité', value: security || 'Ouvert' },
    { label: 'Mot de passe', value: password || '—' },
  ]
}

export function parseScannedData(raw) {
  const data = (raw || '').trim()

  if (/^BEGIN:VCARD/i.test(data)) {
    return { type: 'vcard', title: 'Contact', fields: parseVCardFields(data), raw: data }
  }
  if (/^WIFI:/i.test(data)) {
    return { type: 'wifi', title: 'Réseau WiFi', fields: parseWifiFields(data), raw: data }
  }
  if (/^BEGIN:VCALENDAR/i.test(data)) {
    const summary = (data.match(/SUMMARY:(.+)/) || [])[1]
    return { type: 'event', title: 'Événement', fields: summary ? [{ label: 'Titre', value: summary }] : [], raw: data }
  }
  if (/^geo:/i.test(data)) {
    return { type: 'gps', title: 'Position GPS', fields: [{ label: 'Coordonnées', value: data.replace('geo:', '') }], raw: data }
  }
  if (/^mailto:/i.test(data)) {
    return { type: 'email', title: 'Email', fields: [{ label: 'Destinataire', value: data.replace('mailto:', '').split('?')[0] }], raw: data }
  }
  if (/^https:\/\/wa\.me\//i.test(data)) {
    return { type: 'whatsapp', title: 'WhatsApp', fields: [{ label: 'Numéro', value: data.replace('https://wa.me/', '').split('?')[0] }], raw: data }
  }
  if (/^tel:/i.test(data)) {
    return { type: 'phone', title: 'Numéro de téléphone', fields: [{ label: 'Numéro', value: data.replace('tel:', '') }], raw: data }
  }
  if (/^[#*][\d*#]*#$/.test(data)) {
    return { type: 'ussd', title: 'Code Mobile Money (USSD)', fields: [{ label: 'Expression', value: data }], raw: data }
  }
  if (/^https?:\/\//i.test(data)) {
    return { type: 'url', title: 'Lien', fields: [{ label: 'URL', value: data }], raw: data }
  }
  return { type: 'text', title: 'Texte', fields: [{ label: 'Contenu', value: data }], raw: data }
}
