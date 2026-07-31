import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, UserSquare2, MessageCircle, Wifi, MapPin, CalendarDays, Mail, Smartphone } from 'lucide-react'

import Card from '../components/ui/Card'
import QRPreview from '../components/QRPreview'
import CustomizationPanel from '../components/CustomizationPanel'
import BatchPanel from '../components/BatchPanel'
import { WebLinkForm, VCardForm, WhatsAppForm, WiFiForm, GPSForm, EventForm, EmailForm, USSDForm } from '../components/Forms'
import { useQRGenerator } from '../hooks/useQRGenerator'
import { useToast } from '../hooks/useToast'
import { saveToHistory } from '../utils/helpers'
import { encryptPayload } from '../utils/security'

export const QR_TYPES = [
  { id: 'url',      label: 'Lien',      Icon: Link,          form: WebLinkForm,  sub: 'Lien URL vers un site web' },
  { id: 'vcard',    label: 'Contact',   Icon: UserSquare2,   form: VCardForm,    sub: 'Contact vCard 3.0 compatible' },
  { id: 'whatsapp', label: 'WhatsApp',  Icon: MessageCircle, form: WhatsAppForm, sub: 'Message WhatsApp direct' },
  { id: 'wifi',     label: 'WiFi',      Icon: Wifi,          form: WiFiForm,     sub: 'Connexion WiFi automatique' },
  { id: 'gps',      label: 'GPS',       Icon: MapPin,        form: GPSForm,      sub: 'Localisation GPS / Maps' },
  { id: 'event',    label: 'Événement', Icon: CalendarDays,  form: EventForm,    sub: 'Événement agenda / iCal' },
  { id: 'email',    label: 'Email',     Icon: Mail,          form: EmailForm,    sub: 'Message email pré-rempli' },
  { id: 'ussd',     label: 'Paiement',  Icon: Smartphone,    form: USSDForm,     sub: 'Mobile Money / code USSD' },
]

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

function HomeScreen({ restoreSignal }) {
  const [activeType, setActiveType] = useState(0)
  const [direction, setDirection] = useState(1)
  const [qrData, setQrData] = useState('')
  const [finalData, setFinalData] = useState('')
  const [qrTitle, setQrTitle] = useState('')
  const [logo, setLogo] = useState(null)
  const [password, setPassword] = useState('')
  const prevTypeRef = useRef(0)
  const showToast = useToast()

  const { svgString, isGenerating, style, updateStyle, generate } = useQRGenerator()

  // Encode (encrypt if protected) whenever the raw content or password changes
  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!qrData) { if (!cancelled) setFinalData(''); return }
      if (password) {
        try {
          const enc = await encryptPayload(qrData, password)
          if (!cancelled) setFinalData(enc)
        } catch (e) {
          console.error(e)
          if (!cancelled) setFinalData(qrData)
        }
      } else if (!cancelled) {
        setFinalData(qrData)
      }
    }
    run()
    return () => { cancelled = true }
  }, [qrData, password])

  // Regenerate the visual QR whenever the embedded content or style changes
  useEffect(() => {
    generate(finalData, logo, style)
  }, [finalData, logo, style, generate])

  // Auto-save to history after 1s of stability
  useEffect(() => {
    if (!finalData) return
    const t = setTimeout(() => {
      saveToHistory({ data: finalData, type: QR_TYPES[activeType].id, label: qrTitle })
    }, 1000)
    return () => clearTimeout(t)
  }, [finalData, activeType, qrTitle])

  const handleDataChange = useCallback((data) => {
    setQrData(data)
  }, [])

  const switchType = (i) => {
    setDirection(i > prevTypeRef.current ? 1 : -1)
    prevTypeRef.current = i
    setActiveType(i)
    setQrData('')
  }

  // Restore from Library
  useEffect(() => {
    if (!restoreSignal) return
    setPassword('')
    setQrTitle(restoreSignal.label || '')
    setQrData(restoreSignal.data)
    const idx = QR_TYPES.findIndex(t => t.id === restoreSignal.type)
    if (idx >= 0) switchType(idx)
    showToast('QR restauré depuis le catalogue')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restoreSignal])

  const CurrentForm = QR_TYPES[activeType].form

  return (
    <div className="home-screen">
      <Card style={{ padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <QRPreview svgString={svgString} title={qrTitle} isGenerating={isGenerating} />
      </Card>

      <div className="field" style={{ marginBottom: 16 }}>
        <label className="label">Titre affiché (optionnel)</label>
        <input
          placeholder="Ex: Mon site web professionnel"
          value={qrTitle}
          onChange={e => setQrTitle(e.target.value)}
        />
      </div>

      <div className="type-pills" style={{ marginBottom: 16 }}>
        {QR_TYPES.map((t, i) => (
          <button key={t.id} className={`type-pill ${activeType === i ? 'active' : ''}`} onClick={() => switchType(i)}>
            <t.Icon size={14} strokeWidth={1.5} /> {t.label}
          </button>
        ))}
      </div>

      <Card className="form-card" style={{ padding: 20 }}>
        <div className="form-header">
          <div>
            <p className="section-title">{QR_TYPES[activeType].label}</p>
            <p className="section-sub">{QR_TYPES[activeType].sub}</p>
          </div>
          {qrData && (
            <span className="badge" style={{ background: 'var(--green)', color: '#fff', flexShrink: 0 }}>✓ Prêt</span>
          )}
        </div>

        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeType}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}>
              <CurrentForm onChange={handleDataChange} />
            </motion.div>
          </AnimatePresence>
        </div>

        <CustomizationPanel
          style={style}
          onStyleChange={updateStyle}
          onLogoChange={setLogo}
          logo={logo}
          data={qrData}
          password={password}
          onPasswordChange={setPassword}
        />

        <BatchPanel />
      </Card>
    </div>
  )
}

export default HomeScreen
