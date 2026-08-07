import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Save, RefreshCw, ArrowRight, Wand2 } from 'lucide-react'
import Card from '../components/ui/Card'
import QRPreview from '../components/qr/QRPreview'
import CustomizationPanel from '../components/customization/CustomizationPanel'
import { useQRGenerator } from '../hooks/useQRGenerator'
import { useToast } from '../hooks/useToast'
import { saveToHistory } from '../utils/helpers'
import { encryptPayload } from '../utils/security'

function GeneratorScreen({ type, editingItem, onBack }) {
  const [step, setStep] = useState('form')
  const [qrData, setQrData] = useState('')
  const [finalData, setFinalData] = useState('')
  const [qrTitle, setQrTitle] = useState('')
  const [logo, setLogo] = useState(null)
  const [password, setPassword] = useState('')
  const [savedId, setSavedId] = useState(null)
  const [formReady, setFormReady] = useState(false)
  const showToast = useToast()
  const { svgString, isGenerating, style, updateStyle, generate } = useQRGenerator()

  // Prefill from editing
  useEffect(() => {
    if (!editingItem) return
    setQrTitle(editingItem.label || '')
    setQrData(editingItem.data)
    setPassword('')
    setSavedId(editingItem.id)
    setFormReady(true)
    setStep('form')
  }, [editingItem])

  // Encrypt if password is set
  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!qrData) { if (!cancelled) setFinalData(''); return }
      if (password) {
        try {
          const enc = await encryptPayload(qrData, password)
          if (!cancelled) setFinalData(enc)
        } catch {
          if (!cancelled) setFinalData(qrData)
        }
      } else if (!cancelled) {
        setFinalData(qrData)
      }
    }
    run()
    return () => { cancelled = true }
  }, [qrData, password])

  // Generate QR in preview step
  useEffect(() => {
    if (step === 'preview') {
      generate(finalData, logo, style)
    }
  }, [finalData, logo, style, generate, step])

  const handleDataChange = useCallback((data) => {
    setQrData(data)
    setFormReady(false)
  }, [])

  const handleGenerate = () => {
    if (!qrData) return
    setStep('preview')
  }

  const handleBackToForm = () => {
    setStep('form')
  }

  const handleSave = () => {
    if (!finalData) return
    const saved = saveToHistory({ data: finalData, type: type.id, label: qrTitle }, savedId)
    if (saved) {
      setSavedId(saved.id)
      showToast(savedId ? 'QR mis à jour' : 'QR enregistré')
      onBack()
    }
  }

  const CurrentForm = type.form

  if (step === 'form') {
    return (
      <div className="generator-screen">
        <div className="page-header">
          <button className="btn-icon" onClick={onBack} aria-label="Retour">
            <ArrowLeft size={18} strokeWidth={1.75} />
          </button>
          <div className="page-header-icon">
            <type.Icon size={18} strokeWidth={1.6} />
          </div>
          <div>
            <p className="section-title" style={{ marginBottom: 2 }}>{type.label}</p>
            <p className="section-sub" style={{ marginBottom: 0 }}>{type.sub}</p>
          </div>
        </div>

        <div className="step-indicator">
          <span className="step-dot active">1</span>
          <span className="step-line" />
          <span className="step-dot">2</span>
        </div>

        <Card className="form-card" style={{ padding: 20 }}>
          <div className="field" style={{ marginBottom: 16 }}>
            <label className="label" htmlFor="qr-title-input">Titre (optionnel)</label>
            <input
              id="qr-title-input"
              placeholder="Ex: Mon site web professionnel"
              value={qrTitle}
              onChange={e => setQrTitle(e.target.value)}
            />
          </div>

          <CurrentForm 
            onChange={handleDataChange} 
            initialData={editingItem?.data || ''}
            isEditing={!!editingItem && formReady}
          />

          <div className="divider" />

          <button className="btn-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={!qrData}>
            <Wand2 size={16} strokeWidth={1.75} />
            Générer le QR code
            <ArrowRight size={16} strokeWidth={1.75} />
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="generator-screen">
      <div className="page-header">
        <button className="btn-icon" onClick={handleBackToForm} aria-label="Retour au formulaire">
          <ArrowLeft size={18} strokeWidth={1.75} />
        </button>
        <div className="page-header-icon">
          <type.Icon size={18} strokeWidth={1.6} />
        </div>
        <div>
          <p className="section-title" style={{ marginBottom: 2 }}>{type.label}</p>
          <p className="section-sub" style={{ marginBottom: 0 }}>Personnalisez et enregistrez</p>
        </div>
      </div>

      <div className="step-indicator">
        <span className="step-dot">1</span>
        <span className="step-line active" />
        <span className="step-dot active">2</span>
      </div>

      {/* QR fixe en haut */}
      <div className="qr-preview-fixed">
        <QRPreview svgString={svgString} title={qrTitle} isGenerating={isGenerating} />
      </div>

      {/* Personnalisation en onglets */}
      <CustomizationPanel
        style={style}
        onStyleChange={updateStyle}
        onLogoChange={setLogo}
        logo={logo}
        data={qrData}
        password={password}
        onPasswordChange={setPassword}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingBottom: 24 }}>
        <button className="btn-ghost" style={{ flex: 1 }} onClick={handleBackToForm}>
          <ArrowLeft size={16} strokeWidth={1.75} /> Modifier
        </button>
        <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={!finalData}>
          {savedId ? <RefreshCw size={16} strokeWidth={1.75} /> : <Save size={16} strokeWidth={1.75} />}
          {savedId ? 'Mettre à jour' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}

export default GeneratorScreen