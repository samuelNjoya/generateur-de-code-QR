function ColorPicker({ label, value, onChange }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 6 }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="color-swatch">
          <input type="color" value={value} onChange={e => onChange(e.target.value)} />
        </div>
        <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{value}</span>
      </div>
    </div>
  )
}

export default ColorPicker
