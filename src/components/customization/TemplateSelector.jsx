import { QR_TEMPLATES } from '../../data/templates'

function TemplateSelector({ currentStyle, onSelectTemplate }) {
  const isActive = (template) => {
    return (
      template.moduleShape === currentStyle.moduleShape &&
      template.eyeShape === currentStyle.eyeShape &&
      template.fgColor === currentStyle.fgColor &&
      template.bgColor === currentStyle.bgColor
    )
  }

  const getPatternSvg = (moduleShape) => {
    if (moduleShape === 'dots') {
      return '%3Ccircle cx="5" cy="5" r="2"/%3E'
    }
    if (moduleShape === 'rounded') {
      return '%3Crect x="0.5" y="0.5" width="9" height="9" rx="2"/%3E'
    }
    return '%3Crect width="10" height="10"/%3E'
  }

  const getMaskUrl = (moduleShape) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">${moduleShape === 'dots' ? '<circle cx="5" cy="5" r="2"/>' : moduleShape === 'rounded' ? '<rect x="0.5" y="0.5" width="9" height="9" rx="2"/>' : '<rect width="10" height="10"/>'}</svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  }

  return (
    <div>
      <label className="label">Templates</label>
      <div className="template-grid">
        {QR_TEMPLATES.map(tpl => (
          <button
            key={tpl.id}
            className={`template-card ${isActive(tpl) ? 'active' : ''}`}
            onClick={() => onSelectTemplate(tpl)}
            title={tpl.description}
          >
            <span className="template-preview" style={{ backgroundColor: tpl.bgColor }}>
              <span style={{
                display: 'block',
                width: '100%',
                height: '100%',
                backgroundColor: tpl.fgColor,
                maskImage: getMaskUrl(tpl.moduleShape),
                WebkitMaskImage: getMaskUrl(tpl.moduleShape),
                maskSize: '30px 30px',
                WebkitMaskSize: '30px 30px',
              }} />
            </span>
            <span className="template-info">
              <span className="template-name"><tpl.Icon size={14} strokeWidth={1.5} /> {tpl.name}</span>
              <span className="template-desc">{tpl.description}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TemplateSelector