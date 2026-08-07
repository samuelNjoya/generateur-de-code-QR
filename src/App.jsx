import { useState, useEffect } from 'react'
import { Home, ScanLine, Library, User } from 'lucide-react'

import Sidebar from './components/layout/Sidebar'
import ShellHeader from './components/layout/ShellHeader'
import BottomTabBar from './components/layout/BottomTabBar'
import { ToastProvider } from './hooks/useToast'
import { useSecureStorage } from './hooks/useSecureStorage'
import HomeScreen from './screens/HomeScreen'
import ScanScreen from './screens/ScanScreen'
import LibraryScreen from './screens/LibraryScreen'
import ProfileScreen from './screens/ProfileScreen'

const APP_TABS = [
  { id: 'home',    label: 'Accueil',   Icon: Home,     sub: 'Générez et personnalisez vos QR codes' },
  { id: 'scan',    label: 'Scanner',   Icon: ScanLine, sub: 'Lisez un QR code avec la caméra' },
  { id: 'library', label: 'Catalogue', Icon: Library,  sub: 'Retrouvez vos QR codes récents' },
  { id: 'profile', label: 'Profil',    Icon: User,     sub: 'Thème et informations' },
]

function AppShell() {
  const { getItem, setItem } = useSecureStorage()

  const [theme, setTheme] = useState(() => {
    const saved = getItem('qrpro_theme')
    if (saved) return saved
    try {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  const [appTab, setAppTab] = useState('home')
  const [restoreSignal, setRestoreSignal] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    setItem('qrpro_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  const handleRestore = (item) => {
    setRestoreSignal(item)
    setAppTab('home')
  }

  const current = APP_TABS.find(t => t.id === appTab)

  return (
    <div className="app-shell">
      <Sidebar tabs={APP_TABS} active={appTab} onChange={setAppTab} theme={theme} onToggleTheme={toggleTheme} />

      <div className="shell-main-desktop">
        <ShellHeader
          mobileTitle="QRPro"
          desktopTitle={current.label}
          desktopSub={current.sub}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <div className="shell-content">
          <div style={{ display: appTab === 'home' ? 'block' : 'none' }}>
            <HomeScreen restoreSignal={restoreSignal} />
          </div>

          {appTab === 'scan' && <ScanScreen />}

          <div style={{ display: appTab === 'library' ? 'block' : 'none' }}>
            <LibraryScreen active={appTab === 'library'} onRestore={handleRestore} />
          </div>

          <div style={{ display: appTab === 'profile' ? 'block' : 'none' }}>
            <ProfileScreen theme={theme} onToggleTheme={toggleTheme} />
          </div>
        </div>
      </div>

      <BottomTabBar tabs={APP_TABS} active={appTab} onChange={setAppTab} />
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  )
}

export default App