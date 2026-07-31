// ── QR Protégé : chiffrement local (Web Crypto API, AES-GCM + PBKDF2) ───────
// Aucune donnée ne quitte l'appareil : le mot de passe sert uniquement à
// dériver une clé locale qui chiffre le contenu réel avant encodage dans le QR.

const PAYLOAD_PREFIX = 'QRPRO-ENC:v1:'
const PBKDF2_ITERATIONS = 150000

function bufToBase64(buf) {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64ToBuf(b64) {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded + '=='.slice(0, (4 - (padded.length % 4)) % 4))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

async function deriveKey(password, salt) {
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export function isEncryptedPayload(data) {
  return typeof data === 'string' && data.startsWith(PAYLOAD_PREFIX)
}

export async function encryptPayload(plainText, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const enc = new TextEncoder()
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plainText))
  return `${PAYLOAD_PREFIX}${bufToBase64(salt)}:${bufToBase64(iv)}:${bufToBase64(ciphertext)}`
}

export async function decryptPayload(payload, password) {
  if (!isEncryptedPayload(payload)) throw new Error('not-encrypted')
  const parts = payload.slice(PAYLOAD_PREFIX.length).split(':')
  if (parts.length !== 3) throw new Error('malformed-payload')
  const [saltB64, ivB64, dataB64] = parts
  const salt = new Uint8Array(base64ToBuf(saltB64))
  const iv = new Uint8Array(base64ToBuf(ivB64))
  const key = await deriveKey(password, salt)
  try {
    const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToBuf(dataB64))
    return new TextDecoder().decode(plainBuf)
  } catch {
    throw new Error('wrong-password')
  }
}
