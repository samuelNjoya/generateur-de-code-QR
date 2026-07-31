import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}>
          <motion.div className="modal-card"
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            {title && (
              <div className="modal-header">
                <p className="section-title" style={{ marginBottom: 0 }}>{title}</p>
                <button className="btn-icon" onClick={onClose}><X size={16} strokeWidth={1.5} /></button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
