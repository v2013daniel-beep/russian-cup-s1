// Deterministic pseudo-random number generator for SSR/client hydration match
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export function randomFromSeed(seed: number, min: number, max: number): number {
  return min + seededRandom(seed) * (max - min);
}
