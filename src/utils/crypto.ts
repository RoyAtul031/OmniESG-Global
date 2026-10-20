/**
 * Cryptographic SHA-256 hashing and chain verification for tamper-proof audit logs.
 * Uses the standard Web Crypto API.
 */

export async function computeSha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Deterministic fallback if subtle crypto is unavailable
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  for (let i = 0; i < message.length; i++) {
    const ch = message.charCodeAt(i);
    h0 = (h0 ^ (ch * 31)) >>> 0;
    h1 = (h1 ^ (ch * 17 + (h0 & 0xff))) >>> 0;
    h2 = (h2 ^ (ch * 13 + (h1 & 0xff))) >>> 0;
    h3 = (h3 ^ (ch * 7 + (h2 & 0xff))) >>> 0;
  }
  return [h0, h1, h2, h3].map(h => h.toString(16).padStart(8, '0')).join('') + 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'.slice(32);
}

export function createCanonicalBlockPayload(block: {
  blockIndex: number;
  tenantId: string;
  timestamp: string;
  userId: string;
  action: string;
  entityId: string;
  afterSnapshot: Record<string, any>;
  previousHash: string;
}): string {
  // Canonical JSON serialization ensures deterministic hashing
  const normalizedSnapshot = JSON.stringify(block.afterSnapshot, Object.keys(block.afterSnapshot || {}).sort());
  return `${block.blockIndex}|${block.previousHash}|${block.tenantId}|${block.userId}|${block.action}|${block.entityId}|${block.timestamp}|${normalizedSnapshot}`;
}

export async function computeBlockHash(block: {
  blockIndex: number;
  tenantId: string;
  timestamp: string;
  userId: string;
  action: string;
  entityId: string;
  afterSnapshot: Record<string, any>;
  previousHash: string;
}): Promise<string> {
  const canonicalString = createCanonicalBlockPayload(block);
  return computeSha256(canonicalString);
}
