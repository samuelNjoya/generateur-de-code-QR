import { ArrowLeft, Package } from 'lucide-react'
import Card from '../components/ui/Card'
import BatchPanel from '../components/BatchPanel'

// Dedicated full-page batch generator — reached from the "Traitement par lot"
// card on the Home catalogue instead of being buried under every QR type.
function BatchScreen({ onBack }) {
  return (
    <div className="generator-screen">
      <div className="page-header">
        <button className="btn-icon" onClick={onBack} aria-label="Retour au catalogue">
          <ArrowLeft size={18} strokeWidth={1.75} />
        </button>
        <div className="page-header-icon">
          <Package size={18} strokeWidth={1.6} />
        </div>
        <div>
          <p className="section-title" style={{ marginBottom: 2 }}>Traitement par lot</p>
          <p className="section-sub" style={{ marginBottom: 0 }}>Générez plusieurs QR codes d'un coup et téléchargez-les en ZIP</p>
        </div>
      </div>

      <Card style={{ padding: 20 }}>
        <BatchPanel />
      </Card>
    </div>
  )
}

export default BatchScreen
