import { motion } from 'framer-motion'

function BottomTabBar({ tabs, active, onChange }) {
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button key={t.id} className={`bottom-nav-item ${active === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
          {active === t.id && (
            <motion.span layoutId="bottom-nav-indicator" className="bottom-nav-indicator"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
          )}
          <t.Icon size={21} strokeWidth={active === t.id ? 2 : 1.5} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomTabBar
