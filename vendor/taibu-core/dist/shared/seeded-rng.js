// Browser-compatible deterministic hash functions
// Replace Node.js crypto.createHash('sha256') with pure JS multiplicative hash
// Same contracts: seedToUint32 → uint32, hashSeed → 24-char hex, resolveSeed → string

function hashString(str, seed) {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 2654435761);
    }
    return h >>> 0;
}

function seedToUint32(seed) {
    const value = hashString(seed, 0x9e3779b9);
    return value === 0 ? 0x9e3779b9 : value;
}

function hashSeed(input) {
    const h1 = hashString(input, 0xdeadbeef);
    const h2 = hashString(input, 0x41c6ce57);
    const h3 = hashString(input + '\x00', 0x9e3779b9);
    return (h1).toString(16).padStart(8, '0')
         + (h2).toString(16).padStart(8, '0')
         + (h3).toString(16).padStart(8, '0');
}

const UINT32_MAX_PLUS_ONE = 0x1_0000_0000;

export function createSeededRng(seed) {
    let state = seedToUint32(seed);
    return () => {
        // xorshift32
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return (state >>> 0) / UINT32_MAX_PLUS_ONE;
    };
}

export function resolveSeed(inputSeed, fallback, scope) {
    const normalized = inputSeed?.trim();
    const base = normalized || hashSeed(fallback);
    const scoped = scope?.trim();
    if (!scoped)
        return base;
    return hashSeed(`${scoped}|${base}`);
}
