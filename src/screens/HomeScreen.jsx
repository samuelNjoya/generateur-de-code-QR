import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, UserSquare2, MessageCircle, Wifi, MapPin, CalendarDays, Mail, Smartphone, Type, Package, ChevronRight } from 'lucide-react'

import { WebLinkForm, VCardForm, WhatsAppForm, WiFiForm, GPSForm, EventForm, EmailForm, USSDForm, TextForm } from '../components/forms'
import { useToast } from '../hooks/useToast'
import GeneratorScreen from './GeneratorScreen'
import BatchScreen from './BatchScreen'

export const QR_TYPES = [
  { id: 'url',      label: 'Lien',      Icon: Link,          form: WebLinkForm,  sub: 'Lien URL vers un site web' },
  { id: 'vcard',    label: 'Contact',   Icon: UserSquare2,   form: VCardForm,    sub: 'Contact vCard 3.0 compatible' },
  { id: 'whatsapp', label: 'WhatsApp',  Icon: MessageCircle, form: WhatsAppForm, sub: 'Message WhatsApp direct' },
  { id: 'wifi',     label: 'WiFi',      Icon: Wifi,          form: WiFiForm,     sub: 'Connexion WiFi automatique' },
  { id: 'gps',      label: 'GPS',       Icon: MapPin,        form: GPSForm,      sub: 'Localisation GPS / Maps' },
  { id: 'event',    label: 'Événement', Icon: CalendarDays,  form: EventForm,    sub: 'Événement agenda / iCal' },
  { id: 'email',    label: 'Email',     Icon: Mail,          form: EmailForm,    sub: 'Message email pré-rempli' },
  { id: 'ussd',     label: 'Paiement',  Icon: Smartphone,    form: USSDForm,     sub: 'Mobile Money / code USSD' },
  { id: 'text',     label: 'Texte',     Icon: Type,          form: TextForm,     sub: 'Texte brut libre' },
]

function TypeGrid({ onSelectType, onOpenBatch }) {
  return (
    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
      <p className="section-title">Créer un QR code</p>
      <p className="section-sub">Choisissez un type pour commencer la génération</p>

      <div className="type-grid">
        {QR_TYPES.map((t, i) => (
          <motion.button
            key={t.id}
            className="type-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            onClick={() => onSelectType(t.id)}>
            <span className="type-card-icon"><t.Icon size={20} strokeWidth={1.6} /></span>
            <span className="type-card-label">{t.label}</span>
            <span className="type-card-sub">{t.sub}</span>
            <ChevronRight className="type-card-chevron" size={16} strokeWidth={1.75} />
          </motion.button>
        ))}

        <motion.button
          className="type-card type-card-batch"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: QR_TYPES.length * 0.03, duration: 0.2 }}
          onClick={onOpenBatch}>
          <span className="type-card-icon"><Package size={20} strokeWidth={1.6} /></span>
          <span className="type-card-label">Traitement par lot</span>
          <span className="type-card-sub">Générez plusieurs QR codes d'un coup (ZIP)</span>
          <ChevronRight className="type-card-chevron" size={16} strokeWidth={1.75} />
        </motion.button>
      </div>
    </motion.div>
  )
}

function HomeScreen({ restoreSignal }) {
  const [view, setView] = useState('list') // 'list' | 'generator' | 'batch'
  const [activeTypeId, setActiveTypeId] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const showToast = useToast()

  // Restore from the catalogue ("Modifier") — open the generator pre-filled
  useEffect(() => {
    if (!restoreSignal) return
    setEditingItem(restoreSignal)
    setActiveTypeId(restoreSignal.type)
    setView('generator')
    showToast('QR chargé pour modification')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restoreSignal])

  const openType = (id) => {
    setEditingItem(null)
    setActiveTypeId(id)
    setView('generator')
  }

  const backToList = () => {
    setView('list')
    setActiveTypeId(null)
    setEditingItem(null)
  }

  const activeType = QR_TYPES.find(t => t.id === activeTypeId)

  return (
    <div className="home-screen">
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <TypeGrid key="list" onSelectType={openType} onOpenBatch={() => setView('batch')} />
        )}
        {view === 'generator' && activeType && (
          <motion.div key="generator" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <GeneratorScreen type={activeType} editingItem={editingItem} onBack={backToList} />
          </motion.div>
        )}
        {view === 'batch' && (
          <motion.div key="batch" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <BatchScreen onBack={backToList} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomeScreen

