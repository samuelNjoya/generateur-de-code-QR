import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

function Collapse({ icon: Icon, label, badge, actions, defaultOpen = false, onOpenChange, children }) {
  const [open, setOpen] = useState(defaultOpen)

  const toggle = () => {
    setOpen(v => {
      onOpenChange?.(!v)
      return !v
    })
  }

  return (
    <div>
      <div className="divider" />
      <div className="collapse-header" onClick={toggle}>
        <span className="collapse-label">
          {Icon && <Icon size={15} strokeWidth={1.5} />}
          {label}
          {badge && <span className="badge">{badge}</span>}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {actions}
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} strokeWidth={1.5} style={{ color: 'var(--text-3)' }} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}>
            <div style={{ paddingBottom: 16 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Collapse
