// Client-side security utilities for forms
import { z } from "zod";

// Generate a CSRF token with added entropy
export const generateCSRFToken = (): string => {
  // Create a token with timestamp and random data for additional entropy
  const timestamp = Date.now();
  const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  // Add browser fingerprinting data if available (simple version)
  const fingerprint = generateSimpleFingerprint();

  return `${timestamp}:${randomPart}:${fingerprint}`;
};

// Generate a simple browser fingerprint for additional security
const generateSimpleFingerprint = (): string => {
  try {
    // Simple fingerprinting - in production would be more comprehensive
    const screenData = `${window.screen.width}x${window.screen.height}`;
    const timeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
    const userAgent = navigator.userAgent; // Create a hash of the combined data
    const fingerprintData = `${screenData}|${timeZone}|${userAgent.substring(
      0,
      50
    )}`;
    return btoa(encodeURIComponent(fingerprintData)).substring(0, 20);
  } catch {
    // Fallback if fingerprinting fails
    return Math.random().toString(36).substring(2, 10);
  }
};

// Store CSRF token in localStorage and register with server
export const storeCSRFToken = (token: string): void => {
  try {
    localStorage.setItem("csrf_token", token);

    // Also try to register the token with the server
    fetch("/api/register-csrf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest", // Standard CSRF protection header
      },
      body: JSON.stringify({ token }),
    }).catch(() => {
      // Silent fail - client will still have the token locally
    });
  } catch (e) {
    // Silent fail - we don't want to show errors to end users
  }
};

// Get CSRF token from localStorage
export const getCSRFToken = (): string | null => {
  return localStorage.getItem("csrf_token");
};

// Client-side email validation
export const validateEmail = (email: string): boolean => {
  const emailSchema = z.string().min(5).max(100).email();
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

// Check if a safe time window has passed since last form submission
// to prevent rapid form submissions and protect against double-click issues
export const safeToSubmit = (): boolean => {
  const lastSubmission = localStorage.getItem("last_submission_time");
  if (!lastSubmission) return true;

  const lastSubmissionTime = parseInt(lastSubmission, 10);
  const now = Date.now();

  // Require at least 500ms between submissions - tylko chronimy przed podwójnym kliknięciem
  // zmniejszone z 5000ms (5 sekund) na bardziej rozsądną wartość
  return now - lastSubmissionTime > 500;
};

// Record a submission time
export const recordSubmission = (): void => {
  localStorage.setItem("last_submission_time", Date.now().toString());
};

// Encrypt sensitive data client-side using a stronger approach
// This uses AES encryption which is more secure than simple base64 encoding
export const encryptData = async (data: any): Promise<string> => {
  try {
    // Use a consistent key derivation approach
    // In production, this would use a more secure key management system
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // Create a key from a passphrase + salt
    // Note: In production, use a secure key management system
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode("AliMatrix-SecureStorage"),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    // Derive a key for AES
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    // Generate initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Convert data to string if it's not already
    const dataString = typeof data === "string" ? data : JSON.stringify(data);

    // Encrypt the data
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      encoder.encode(dataString)
    );

    // Combine the salt, iv, and encrypted content into a single array
    const result = new Uint8Array(
      salt.length + iv.length + encryptedContent.byteLength
    );
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encryptedContent), salt.length + iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...result));
  } catch (e) {
    console.error("Failed to encrypt data:", e);
    // Fallback to simple obfuscation if encryption fails
    return btoa(
      encodeURIComponent(typeof data === "string" ? data : JSON.stringify(data))
    );
  }
};

// Decrypt data
export const decryptData = async (encryptedData: string): Promise<any> => {
  try {
    // Convert from base64
    const binaryString = atob(encryptedData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Extract salt, iv, and encrypted content
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const encryptedContent = bytes.slice(28);

    // Recreate the key
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode("AliMatrix-SecureStorage"),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      encryptedContent
    );

    const decoded = new TextDecoder().decode(decrypted);

    // Try to parse as JSON, return as string if not valid JSON
    try {
      return JSON.parse(decoded);
    } catch {
      return decoded;
    }
  } catch (e) {
    console.error("Failed to decrypt data:", e);
    try {
      // Fallback for backwards compatibility
      return JSON.parse(decodeURIComponent(atob(encryptedData)));
    } catch {
      try {
        return decodeURIComponent(atob(encryptedData));
      } catch {
        return null;
      }
    }
  }
};

// Legacy methods for backwards compatibility
export const obfuscateData = (data: string): string => {
  try {
    // Ensure we're working with strings
    const stringData = typeof data === "string" ? data : JSON.stringify(data);
    return btoa(encodeURIComponent(stringData));
  } catch (e) {
    console.error("Failed to obfuscate data", e);
    // Fallback - return data as is but don't throw
    return typeof data === "string" ? data : JSON.stringify(data);
  }
};

export const deobfuscateData = (data: string): string => {
  try {
    // Check if the string is base64 encoded
    if (!isBase64(data)) {
      console.warn("Data is not properly base64 encoded, returning as is");
      return data;
    }

    return decodeURIComponent(atob(data));
  } catch (e) {
    console.error("Failed to deobfuscate data", e);
    // Return original data if decoding fails
    return data;
  }
};

// Utility function to check if a string is valid base64
function isBase64(str: string): boolean {
  try {
    // Quick check for characters that aren't valid in base64
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    if (!base64Regex.test(str)) {
      return false;
    }

    // Try to decode - will throw if invalid
    atob(str);
    return true;
  } catch (e) {
    return false;
  }
}
