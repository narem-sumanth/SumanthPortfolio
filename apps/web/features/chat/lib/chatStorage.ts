"use client";

/**
 * Persists chat in localStorage, AES-GCM encrypted.
 * Key in localStorage too — prevents plaintext in inspector, not a security boundary.
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

// Encrypts and stores single conversation — fails silently (convenience, not required).
export async function saveChatHistory<T>(value: T): Promise<void> {
  try {
    const key = await getOrCreateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(JSON.stringify(value));
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ iv: toBase64(iv), data: toBase64(ciphertext) }));
  } catch {
    // Ignore — private browsing, no storage, or SubtleCrypto unavailable.
  }
}

// Reads and decrypts stored conversation, or null if missing/unreadable.
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

// Clears stored conversation (Clear chat action).
export function clearChatHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — private browsing or no storage.
  }
}
