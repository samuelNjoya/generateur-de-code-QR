function FormField({ label, hint, error, style, children }) {
  return (
    <div className="field" style={style}>
      {label && <label className="label">{label}</label>}
      {children}
      {error && <p style={{ fontSize: '0.75rem', color: 'var(--red)', marginTop: 4 }}>{error}</p>}
      {!error && hint && <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

export default FormField
