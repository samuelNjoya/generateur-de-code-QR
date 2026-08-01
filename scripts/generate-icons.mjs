// One-off / repeatable script: rasterizes public/icon.png into the real PNG
// icon sizes required by the PWA manifest (Android/iOS reliably support PNG
// icons; SVG-only manifests are a known cause of "installs but won't launch
// standalone" bugs on several Android WebView versions).
//
// Run with: node scripts/generate-icons.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const root = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(root, '..', 'public')
const svgPath = path.join(publicDir, 'icon.png')
const svgBuffer = readFileSync(svgPath)

const targets = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-maskable-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

for (const t of targets) {
  const out = path.join(publicDir, t.file)
  await sharp(svgBuffer, { density: 384 })
    .resize(t.size, t.size)
    .png()
    .toFile(out)
  console.log(`✓ ${t.file} (${t.size}x${t.size})`)
}
