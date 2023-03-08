//@ts-nocheck
import { WordArray } from "crypto-js";
import Base64 from "crypto-js/enc-base64";
import sha256Fallback from "crypto-js/sha256";

const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
const HAS_CRYPTO = typeof window !== "undefined" && !!(window.crypto as any);

/**
 * Stringifies `bytes` using the OAuth 2.0 `code_verifier` character set.
 */
function bytesToVerifierString(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((value: number) => CHARSET[value % CHARSET.length])
    .join("");
}

/**
 * Stringifies argument (as CryptoJS `WordArray` or EcmaScript `ArrayBuffer`)
 * and encodes to URL-safe Base64.
 */
function base64URLEncodeFromByteArray(arg: WordArray | ArrayBuffer): string {
  const makeURLSafe = (base64: string) => {
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };

  if (arg instanceof ArrayBuffer) {
    const bytes = new Uint8Array(arg);
    const utf8Binary = Array.from(bytes)
      .map((value) => String.fromCharCode(value))
      .join("");

    const base64 = btoa(utf8Binary);
    return makeURLSafe(base64);
  }

  return makeURLSafe(Base64.stringify(arg));
}

/**
 * Produces a SHA-256 hash of the given `message`. This function first attempts
 * to use the browser's built-in `SubtleCrypto` API, falling back to
 * CryptoJS if required.
 */
function sha256(message: string) {
  return base64URLEncodeFromByteArray(sha256Fallback(message));
}

/**
 * Creates a cryptographically random string using the browser's built-in
 * `Crypto` API, falling back to `Math.random` if required.
 */
function createRandomString(size: number) {
  const bytes = new Uint8Array(size);

  if (HAS_CRYPTO) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < size; i += 1)
      bytes[i] = Math.floor(Math.random() * Math.floor(255));
  }

  return bytesToVerifierString(bytes);
}

/**
 * Creates OAuth 2.0-compatible `code_verifier`, `code_challenge`, and `state`
 * parameters.
 */
export function createCryptoChallenge() {
  const state = createRandomString(128);
  const verifier = createRandomString(128);
  const challenge = sha256(verifier);
  return { verifier, challenge, state };
}
