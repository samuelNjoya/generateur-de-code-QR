function SegmentControl({ options, value, onChange }) {
  return (
    <div className="segment-control">
      {options.map(o => (
        <button key={o.id} className={`segment-btn ${value === o.id ? 'active' : ''}`} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default SegmentControl
