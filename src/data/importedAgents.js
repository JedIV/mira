// Simple in-memory store for agents imported via the Add Platform wizard.
// Listeners are notified when the count changes so Dashboard can re-render.

let importedCount = 0
const listeners = new Set()

export function getImportedCount() {
  return importedCount
}

export function addImportedAgents(count) {
  importedCount += count
  listeners.forEach(fn => fn(importedCount))
}

export function onImportedCountChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
