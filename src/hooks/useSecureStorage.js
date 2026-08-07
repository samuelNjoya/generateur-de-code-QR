export function useSecureStorage() {
  const getItem = (key, fallback = null) => {
    try {
      const val = localStorage.getItem(key)
      return val !== null ? val : fallback
    } catch {
      return fallback
    }
  }

  const setItem = (key, value) => {
    try {
      localStorage.setItem(key, value)
      return true
    } catch {
      return false
    }
  }

  const getJSON = (key, fallback = null) => {
    try {
      const val = localStorage.getItem(key)
      return val ? JSON.parse(val) : fallback
    } catch {
      return fallback
    }
  }

  const setJSON = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  }

  const removeItem = (key) => {
    try {
      localStorage.removeItem(key)
    } catch {}
  }

  return { getItem, setItem, getJSON, setJSON, removeItem }
}