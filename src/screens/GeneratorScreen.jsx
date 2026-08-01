import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Save, RefreshCw } from 'lucide-react'

import Card from '../components/ui/Card'
import QRPreview from '../components/QRPreview'
import CustomizationPanel from '../components/CustomizationPanel'
import { useQRGenerator } from '../hooks/useQRGenerator'
import { useToast } from '../hooks/useToast'
import { saveToHistory } from '../utils/helpers'
import { encryptPayload } from '../utils/security'

// Dedicated full-page generator for a single QR type — reached only by
// tapping a type card on the Home catalogue. Nothing is saved automatically:
// the user must press "Enregistrer" to add/update the entry in the catalogue.
function GeneratorScreen({ type, editingItem, onBack }) {
  const [qrData, setQrData] = useState('')
  const [finalData, setFinalData] = useState('')
  const [qrTitle, setQrTitle] = useState('')
  const [logo, setLogo] = useState(null)
  const [password, setPassword] = useState('')
  const [savedId, setSavedId] = useState(null)
  const showToast = useToast()

  const { svgString, isGenerating, style, updateStyle, generate } = useQRGenerator()

  // Prefill from an existing catalogue entry when editing.
  useEffect(() => {
    if (!editingItem) return
    setQrTitle(editingItem.label || '')
    setQrData(editingItem.data)
    setPassword('')
    setSavedId(editingItem.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingItem])

  // Encode (encrypt if protected) whenever the raw content or password changes
  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!qrData) {
        if (!cancelled) setFinalData('')
        return
      }
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

  const handleDataChange = useCallback((data) => {
    setQrData(data)
  }, [])

  const handleSave = () => {
    if (!finalData) return
    const saved = saveToHistory({ data: finalData, type: type.id, label: qrTitle }, savedId)
    if (saved) {
      setSavedId(saved.id)
      showToast(savedId ? 'QR mis à jour dans le catalogue ✓' : 'QR enregistré dans le catalogue ✓')
    }
  }

  const CurrentForm = type.form

  return (
    <div className="generator-screen">
      <div className="page-header">
        <button className="btn-icon" onClick={onBack} aria-label="Retour au catalogue">
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

      <Card style={{ padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <QRPreview svgString={svgString} title={qrTitle} isGenerating={isGenerating} />
      </Card>

      <div className="field" style={{ marginBottom: 16 }}>
        <label className="label" htmlFor="qr-title-input">Titre affiché (optionnel)</label>
        <input
          id="qr-title-input"
          placeholder="Ex: Mon site web professionnel"
          value={qrTitle}
          onChange={e => setQrTitle(e.target.value)}
        />
      </div>

      <Card className="form-card" style={{ padding: 20 }}>
        <CurrentForm onChange={handleDataChange} />

        <CustomizationPanel
          style={style}
          onStyleChange={updateStyle}
          onLogoChange={setLogo}
          logo={logo}
          data={qrData}
          password={password}
          onPasswordChange={setPassword}
        />

        <div className="divider" />
        <button className="btn-primary" style={{ width: '100%' }} onClick={handleSave} disabled={!finalData}>
          {savedId ? <RefreshCw size={16} strokeWidth={1.75} /> : <Save size={16} strokeWidth={1.75} />}
          {savedId ? 'Mettre à jour dans le catalogue' : 'Enregistrer dans le catalogue'}
        </button>
      </Card>
    </div>
  )
}

export default GeneratorScreen
