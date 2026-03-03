// Shared seeded PRNG utilities for deterministic data generation

export function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// djb2 hash — derive a stable integer seed from any string
export function seedFromId(agentId) {
  let hash = 5381
  for (let i = 0; i < agentId.length; i++) {
    hash = ((hash << 5) + hash + agentId.charCodeAt(i)) | 0
  }
  return hash >>> 0
}

// Convenience: get a seeded rand() for an agent
export function agentRand(agentId) {
  return mulberry32(seedFromId(agentId))
}

// Pick one item from an array
export function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)]
}

// Pick n unique items from an array (Fisher-Yates partial shuffle)
export function pickN(rand, arr, n) {
  const copy = [...arr]
  const result = []
  const count = Math.min(n, copy.length)
  for (let i = 0; i < count; i++) {
    const idx = i + Math.floor(rand() * (copy.length - i))
    ;[copy[i], copy[idx]] = [copy[idx], copy[i]]
    result.push(copy[i])
  }
  return result
}
