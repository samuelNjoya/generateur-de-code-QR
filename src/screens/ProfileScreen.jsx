import { motion } from 'framer-motion'
import { Sun, Moon, Info, ShieldCheck, ScanLine, Layers, HelpCircle } from 'lucide-react'
import Card from '../components/ui/Card'

const HELP_ITEMS = [
  { Icon: Layers, title: 'Formats disponibles', text: "Lien, Contact, WhatsApp, WiFi, GPS, Événement, Email et Paiement (USSD)." },
  { Icon: ScanLine, title: 'Scanner intégré', text: "Utilisez l'onglet Scanner pour lire n'importe quel QR avec l'appareil photo." },
  { Icon: ShieldCheck, title: 'QR protégé', text: "Ajoutez un mot de passe en personnalisation pour chiffrer localement le contenu du QR." },
]

function ProfileScreen({ theme, onToggleTheme }) {
  return (
    <div className="profile-screen">
      <p className="section-title">Profil</p>
      <p className="section-sub">Préférences générales et informations sur l'application</p>

      <Card style={{ padding: '4px 18px', marginBottom: 20 }}>
        <div className="profile-row">
          <span className="profile-row-label">
            {theme === 'dark' ? <Moon size={17} strokeWidth={1.5} /> : <Sun size={17} strokeWidth={1.5} />}
            <span>
              Thème {theme === 'dark' ? 'sombre' : 'clair'}
              <span className="profile-row-sub" style={{ display: 'block' }}>Basé sur les préférences système, modifiable manuellement</span>
            </span>
          </span>
          <button className="theme-switch" onClick={onToggleTheme} aria-label="Basculer le thème">
            <motion.span className="theme-switch-thumb" animate={{ x: theme === 'dark' ? 20 : 0 }} transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}>
              {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
            </motion.span>
          </button>
        </div>
        <div className="profile-row">
          <span className="profile-row-label">
            <Info size={17} strokeWidth={1.5} />
            <span>
              QR<strong>Pro</strong> — version 2.0.0
              <span className="profile-row-sub" style={{ display: 'block' }}>
                Application installable, fonctionne hors-ligne
              </span>
            </span>
          </span>
        </div>
      </Card>

      <p className="section-title" style={{ fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        <HelpCircle size={16} strokeWidth={1.5} /> Aide
      </p>
      <Card style={{ padding: '4px 18px' }}>
        {HELP_ITEMS.map(item => (
          <div className="profile-row" key={item.title}>
            <span className="profile-row-label">
              <item.Icon size={17} strokeWidth={1.5} />
              <span>
                {item.title}
                <span className="profile-row-sub" style={{ display: 'block' }}>{item.text}</span>
              </span>
            </span>
          </div>
        ))}
      </Card>
    </div>
  )
}

export default ProfileScreen
