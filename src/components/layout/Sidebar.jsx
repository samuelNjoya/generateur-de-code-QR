import { Sun, Moon, QrCode } from 'lucide-react'

function Sidebar({ tabs, active, onChange, theme, onToggleTheme }) {
  return (
    <aside className="shell-sidebar-desktop">
      <div className="sidebar-brand">
        <span className="app-logo-icon"><QrCode size={18} strokeWidth={2} /></span>
        <span className="app-name">QR<strong>Pro</strong></span>
      </div>

      <nav className="sidebar-nav">
        {tabs.map(t => (
          <button key={t.id} className={`sidebar-nav-item ${active === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
            <t.Icon size={18} strokeWidth={1.5} />
            {t.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="btn-ghost" style={{ width: '100%' }} onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
          {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
