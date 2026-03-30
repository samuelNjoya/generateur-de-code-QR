import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, UserSquare2, MessageCircle, Wifi, MapPin, CalendarDays, Sun, Moon, History } from 'lucide-react'

import QRPreview from './components/QRPreview'
import { WebLinkForm, VCardForm, WhatsAppForm, WiFiForm, GPSForm, EventForm } from './components/Forms'
import CustomizationPanel from './components/CustomizationPanel'
import HistoryPanel from './components/HistoryPanel'
import BatchPanel from './components/BatchPanel'
import { useQRGenerator } from './hooks/useQRGenerator'
import { saveToHistory, getHistory } from './utils/helpers'

const TABS = [
  { id: 'url',      label: 'Lien',      Icon: Link,          form: WebLinkForm },
  { id: 'vcard',    label: 'Contact',   Icon: UserSquare2,   form: VCardForm },
  { id: 'whatsapp', label: 'WhatsApp',  Icon: MessageCircle, form: WhatsAppForm },
  { id: 'wifi',     label: 'WiFi',      Icon: Wifi,          form: WiFiForm },
  { id: 'gps',      label: 'GPS',       Icon: MapPin,        form: GPSForm },
  { id: 'event',    label: 'Événement', Icon: CalendarDays,  form: EventForm },
]

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

function Toast({ message, onHide }) {
  useEffect(() => { const t = setTimeout(onHide, 2500); return () => clearTimeout(t) }, [])
  return (
    <motion.div className="toast"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
      {message}
    </motion.div>
  )
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('qrpro_theme') || 'light')
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState(1)
  const [qrData, setQrData] = useState('')
  const [qrTitle, setQrTitle] = useState('')
  const [logo, setLogo] = useState(null)
  const [toast, setToast] = useState(null)
  const [historyCount, setHistoryCount] = useState(getHistory().length)
  const prevTabRef = useRef(0)

  const { svgString, isGenerating, style, updateStyle, generate } = useQRGenerator()

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('qrpro_theme', theme)
  }, [theme])

  // Re-generate when style changes
  useEffect(() => {
    if (qrData) generate(qrData, logo, style)
  }, [style, logo])

  const handleDataChange = useCallback((data) => {
    setQrData(data)
    if (data) {
      generate(data, logo, style)
      // Auto-save to history after 1s of stability
      const t = setTimeout(() => {
        saveToHistory({ data, type: TABS[activeTab].id, label: qrTitle })
        setHistoryCount(getHistory().length)
      }, 1000)
      return () => clearTimeout(t)
    } else {
      generate('', logo, style)
    }
  }, [logo, style, activeTab, qrTitle, generate])

  const switchTab = (i) => {
    setDirection(i > prevTabRef.current ? 1 : -1)
    prevTabRef.current = i
    setActiveTab(i)
    setQrData('')
    generate('', null, style)
  }

  const handleHistorySelect = (item) => {
    setQrData(item.data)
    generate(item.data, null, style)
    const tabIdx = TABS.findIndex(t => t.id === item.type)
    if (tabIdx >= 0) switchTab(tabIdx)
    showToast('QR restauré depuis l\'historique')
  }

  const showToast = (msg) => setToast(msg)

  const CurrentForm = TABS[activeTab].form

  return (
    <div className="desktop-layout" style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Desktop sidebar / Mobile top preview */}
      <aside className="qr-sidebar">
        <div className="sidebar-inner">
          {/* Header */}
          <div className="app-header">
            <div className="app-logo">
              <span className="app-logo-icon">⬛</span>
              <span className="app-name">QR<strong>Pro</strong></span>
            </div>
            <button className="btn-icon" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} title="Thème">
              {theme === 'dark' ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </button>
          </div>

          {/* QR Preview card */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <QRPreview
              svgString={svgString}
              title={qrTitle}
              isGenerating={isGenerating}
            />
          </div>

          {/* Title field */}
          <div className="field" style={{ marginTop: 0 }}>
            <label className="label">Titre affiché (optionnel)</label>
            <input
              placeholder="Ex: Mon site web professionnel"
              value={qrTitle}
              onChange={e => setQrTitle(e.target.value)}
            />
          </div>

          {/* Desktop tab navigation */}
          <div className="desktop-tabs">
            {TABS.map((tab, i) => (
              <button key={tab.id} className={`desktop-tab ${activeTab === i ? 'active' : ''}`} onClick={() => switchTab(i)}>
                <tab.Icon size={14} strokeWidth={1.5} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-scroll main-content">
        {/* Mobile header */}
        <div className="mobile-header">
          <div className="app-logo">
            <span className="app-logo-icon">⬛</span>
            <span className="app-name">QR<strong>Pro</strong></span>
          </div>
          <button className="btn-icon" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile QR Preview */}
        <div className="mobile-preview">
          <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <QRPreview svgString={svgString} title={qrTitle} isGenerating={isGenerating} />
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label className="label">Titre affiché (optionnel)</label>
            <input placeholder="Ex: Mon site web" value={qrTitle} onChange={e => setQrTitle(e.target.value)} />
          </div>
        </div>

        {/* Form card */}
        <div className="card form-card">
          <div className="form-header">
            <div>
              <p className="section-title">{TABS[activeTab].label}</p>
              <p className="section-sub">
                {activeTab === 0 && 'Lien URL vers un site web'}
                {activeTab === 1 && 'Contact vCard 3.0 compatible'}
                {activeTab === 2 && 'Message WhatsApp direct'}
                {activeTab === 3 && 'Connexion WiFi automatique'}
                {activeTab === 4 && 'Localisation GPS / Maps'}
                {activeTab === 5 && 'Événement agenda / iCal'}
              </p>
            </div>
            {qrData && (
              <span className="badge" style={{ background: 'var(--green)', color: '#fff', flexShrink: 0 }}>✓ Prêt</span>
            )}
          </div>

          {/* Animated form */}
          <div style={{ overflow: 'hidden', position: 'relative' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeTab}
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

          {/* Customization */}
          <CustomizationPanel
            style={style}
            onStyleChange={updateStyle}
            onLogoChange={setLogo}
            logo={logo}
            data={qrData}
          />

          {/* History */}
          {historyCount > 0 && <HistoryPanel onSelect={handleHistorySelect} />}

          {/* Batch */}
          <BatchPanel />
        </div>

        {/* Padding bottom for mobile tab bar */}
        <div style={{ height: 16 }} />
      </main>

      {/* Mobile Tab Bar */}
      <nav className="tab-bar">
        {TABS.map((tab, i) => (
          <button key={tab.id} className={`tab-item ${activeTab === i ? 'active' : ''}`} onClick={() => switchTab(i)}>
            <tab.Icon size={20} strokeWidth={1.5} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key={toast} message={toast} onHide={() => setToast(null)} />}
      </AnimatePresence>

      <style>{`
        .desktop-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* Mobile styles */
        .qr-sidebar { display: none; }
        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px 8px;
        }
        .mobile-preview { padding: 0 16px 16px; }
        .form-card { margin: 0 16px; padding: 20px; }
        .form-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
        .desktop-tabs { display: none; }

        .app-logo { display: flex; align-items: center; gap: 8px; }
        .app-logo-icon { font-size: 1.1rem; line-height: 1; }
        .app-name { font-size: 1.125rem; font-weight: 300; letter-spacing: -0.03em; color: var(--text); }
        .app-name strong { font-weight: 700; }

        /* Desktop layout */
        @media (min-width: 768px) {
          .desktop-layout {
            flex-direction: row !important;
            height: 100vh;
            overflow: hidden;
          }

          .qr-sidebar {
            display: flex;
            flex-direction: column;
            width: 360px;
            flex-shrink: 0;
            height: 100vh;
            overflow-y: auto;
            border-right: 1px solid var(--border);
            background: var(--bg-card);
            position: sticky;
            top: 0;
          }

          .sidebar-inner {
            padding: 28px 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .app-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;
          }

          .main-content {
            flex: 1;
            height: 100vh;
            overflow-y: auto;
            padding: 32px;
          }

          .mobile-header { display: none; }
          .mobile-preview { display: none; }

          .form-card {
            max-width: 600px;
            margin: 0 auto;
            padding: 28px;
          }

          .desktop-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .desktop-tab {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 7px 12px;
            border-radius: var(--radius-sm);
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--text-3);
            background: transparent;
            border: 1.5px solid var(--border);
            cursor: pointer;
            transition: all var(--transition);
          }
          .desktop-tab:hover { color: var(--text); border-color: var(--text-3); }
          .desktop-tab.active { color: var(--text); background: var(--accent-soft); border-color: var(--border-focus); }
        }

        @media (min-width: 1100px) {
          .qr-sidebar { width: 400px; }
          .sidebar-inner { padding: 36px 32px; }
        }
      `}</style>
    </div>
  )
}

export default App
