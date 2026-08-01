import { Sun, Moon, QrCode } from 'lucide-react'

function ShellHeader({ mobileTitle, desktopTitle, desktopSub, theme, onToggleTheme }) {
  return (
    <>
      <header className="shell-header-mobile">
        <span className="shell-title-mobile">
          <span className="app-logo-icon app-logo-icon-sm"><QrCode size={15} strokeWidth={2} /></span>
          {mobileTitle}
        </span>
        <button className="btn-icon" onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
        </button>
      </header>

      <header className="shell-header-desktop">
        <div>
          <p className="shell-header-title">{desktopTitle}</p>
          {desktopSub && <p className="shell-header-sub">{desktopSub}</p>}
        </div>
      </header>
    </>
  )
}

export default ShellHeader
