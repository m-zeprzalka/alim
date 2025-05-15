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
    const userAgent = navigator.userAgent;    // Create a hash of the combined data
    const fingerprintData = `${screenData}|${timeZone}|${userAgent.substring(
      0,
      50
    )}`;
    return btoa(encodeURIComponent(fingerprintData)).substring(0, 20);
  } catch (_) {
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
    }).catch((err) => {
      // Silent fail - client will still have the token locally
      console.error("Failed to register CSRF token:", err);
    });
  } catch (e) {
    console.error("Failed to store CSRF token:", e);
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
  } catch (_) {
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

  // Require at least 5 seconds between submissions
  return now - lastSubmissionTime > 5000;
};

// Record a submission time
export const recordSubmission = (): void => {
  localStorage.setItem("last_submission_time", Date.now().toString());
};

// Encrypt sensitive data client-side (simple obfuscation)
// Note: This is not true encryption, just basic obfuscation to make
// casual inspection of localStorage more difficult
export const obfuscateData = (data: string): string => {
  return btoa(encodeURIComponent(data));
};

// Deobfuscate data
export const deobfuscateData = (data: string): string => {
  try {
    return decodeURIComponent(atob(data));
  } catch (e) {
    console.error("Failed to deobfuscate data", e);
    return "";
  }
};
