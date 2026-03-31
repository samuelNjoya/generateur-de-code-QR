npimport { useState, useCallback, useRef, useEffect } from 'react'
import QRCode from 'qrcode'
import { getECL } from '../utils/helpers'

const DEFAULT_STYLE = {
  fgColor: '#1a1a1a',
  bgColor: '#ffffff',
  moduleShape: 'square',   // square | rounded | dots
  eyeShape: 'square',      // square | rounded | circle
  margin: 4,
  errorCorrection: 'M',    // auto-overridden
}

export function useQRGenerator() {
  const [svgString, setSvgString] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [style, setStyle] = useState(DEFAULT_STYLE)
  const debounceRef = useRef(null)

  const generate = useCallback(async (data, logoDataUrl = null, styleOverride = null) => {
    if (!data || !data.trim()) { setSvgString(''); return }
    const s = styleOverride || style
    const ecl = getECL(data, !!logoDataUrl)

    setIsGenerating(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        // 1. Generate QR matrix via qrcode library
        const qr = await QRCode.create(data, { errorCorrectionLevel: ecl })
        const modules = qr.modules
        const size = modules.size
        const margin = s.margin
        const total = size + margin * 2

        // 2. Build custom SVG
        const moduleSize = 1
        let paths = ''

        // Helper: draw module shapes
        const drawModule = (x, y) => {
          const rx = x + margin
          const ry = y + margin
          if (s.moduleShape === 'dots') {
            return `<circle cx="${rx + 0.5}" cy="${ry + 0.5}" r="0.45"/>`
          }
          if (s.moduleShape === 'rounded') {
            return `<rect x="${rx + 0.05}" y="${ry + 0.05}" width="0.9" height="0.9" rx="0.25"/>`
          }
          return `<rect x="${rx}" y="${ry}" width="1" height="1"/>`
        }

        // Eye positions (3 finder patterns: TL, TR, BL)
        const eyePositions = [
          { ox: 0, oy: 0 },
          { ox: size - 7, oy: 0 },
          { ox: 0, oy: size - 7 },
        ]

        const isInEye = (x, y) => eyePositions.some(ep =>
          x >= ep.ox && x < ep.ox + 7 && y >= ep.oy && y < ep.oy + 7
        )

        // Draw data modules (excluding eyes)
        let dataPath = ''
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            if (modules.get(y, x) && !isInEye(x, y)) {
              dataPath += drawModule(x, y)
            }
          }
        }
        paths += `<g fill="${s.fgColor}">${dataPath}</g>`

        // Draw eyes with custom style
        const drawEye = (ox, oy) => {
          const mx = ox + margin
          const my = oy + margin
          const r_outer = s.eyeShape === 'circle' ? '3' : s.eyeShape === 'rounded' ? '1.5' : '0'
          const r_inner = s.eyeShape === 'circle' ? '2' : s.eyeShape === 'rounded' ? '1' : '0'
          return `
            <rect x="${mx}" y="${my}" width="7" height="7" rx="${r_outer}" ry="${r_outer}" fill="${s.fgColor}"/>
            <rect x="${mx + 1}" y="${my + 1}" width="5" height="5" rx="${r_inner}" ry="${r_inner}" fill="${s.bgColor}"/>
            <rect x="${mx + 2}" y="${my + 2}" width="3" height="3" rx="${s.eyeShape === 'circle' ? '1.5' : '0'}" ry="${s.eyeShape === 'circle' ? '1.5' : '0'}" fill="${s.fgColor}"/>
          `
        }

        eyePositions.forEach(ep => { paths += drawEye(ep.ox, ep.oy) })

        // 3. Build SVG with optional logo
        let logoEl = ''
        if (logoDataUrl) {
          const logoSize = total * 0.22
          const logoX = (total - logoSize) / 2
          const logoY = (total - logoSize) / 2
          const pad = 0.8
          logoEl = `
            <rect x="${logoX - pad}" y="${logoY - pad}" width="${logoSize + pad * 2}" height="${logoSize + pad * 2}" rx="${logoSize * 0.15}" fill="${s.bgColor}"/>
            <image href="${logoDataUrl}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" clip-path="inset(0% round ${logoSize * 0.12}px)"/>
          `
        }

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">
          <rect width="${total}" height="${total}" fill="${s.bgColor}"/>
          ${paths}
          ${logoEl}
        </svg>`

        setSvgString(svg)
      } catch (err) {
        console.error('QR generation error:', err)
      } finally {
        setIsGenerating(false)
      }
    }, 120)
  }, [style])

  const updateStyle = useCallback((updates) => {
    setStyle(prev => ({ ...prev, ...updates }))
  }, [])

  return { svgString, isGenerating, style, updateStyle, generate }
}
