"use client";

/**
 * Persists the single active chat conversation in localStorage, encrypted
 * with AES-GCM via the Web Crypto API. The key lives in localStorage too
 * (client-side JS has no place to hide a secret), so this only prevents the
 * conversation from sitting as plaintext in the storage inspector — it is
 * not a confidentiality boundary against anyone with access to the page.
 */

const STORAGE_KEY = "portfolio-chat:v1";
const KEY_STORAGE_KEY = "portfolio-chat:key:v1";

function toBase64(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of arr) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getOrCreateKey(): Promise<CryptoKey> {
  const stored = localStorage.getItem(KEY_STORAGE_KEY);
  if (stored) {
    return crypto.subtle.importKey("raw", fromBase64(stored) as BufferSource, "AES-GCM", false, ["encrypt", "decrypt"]);
  }
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const raw = await crypto.subtle.exportKey("raw", key);
  localStorage.setItem(KEY_STORAGE_KEY, toBase64(raw));
  return key;
}

/** Encrypts `value` and writes it as the single stored conversation. Fails silently — storage is a convenience, never a requirement. */
export async function saveChatHistory<T>(value: T): Promise<void> {
  try {
    const key = await getOrCreateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(JSON.stringify(value));
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ iv: toBase64(iv), data: toBase64(ciphertext) }));
  } catch {
    // Ignore — e.g. private browsing with storage disabled, or SubtleCrypto unavailable.
  }
}

/** Reads and decrypts the stored conversation, or null if there isn't one / it can't be read. */
export async function loadChatHistory<T>(): Promise<T | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { iv, data } = JSON.parse(raw) as { iv: string; data: string };
    const key = await getOrCreateKey();
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(iv) as BufferSource },
      key,
      fromBase64(data) as BufferSource,
    );
    return JSON.parse(new TextDecoder().decode(plaintext)) as T;
  } catch {
    return null;
  }
}

/** Removes the stored conversation (used by the "Clear chat" action). */
export function clearChatHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
