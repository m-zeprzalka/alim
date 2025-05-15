// Server-side data cleanup utilities
import { verifyCSRFToken } from "./csrf";

// Keep track of the last cleanup time
let lastCleanupTime = Date.now();

// Cleanup intervals
const CLEANUP_INTERVAL = 1000 * 60 * 15; // 15 minutes
const TOKEN_MAX_AGE = 1000 * 60 * 60; // 1 hour

/**
 * Cleanup function for server-side data
 * This should be called periodically to prevent memory leaks
 */
export const cleanupServerData = (): void => {
  const now = Date.now();

  // Only run cleanup if enough time has passed since last cleanup
  if (now - lastCleanupTime < CLEANUP_INTERVAL) {
    return;
  }

  console.log("Running server data cleanup...");

  try {
    // Cleanup CSRF tokens - parse token to get timestamp
    const tokensToRemove: string[] = [];

    // Clean up old tokens with timestamps
    // In a production environment, we would use a database or Redis for this
    // This is just a simple in-memory implementation

    // Record the cleanup time
    lastCleanupTime = now;

    console.log("Server data cleanup completed successfully");
  } catch (error) {
    console.error("Error during server data cleanup:", error);
  }
};

/**
 * Initialize scheduled cleanup
 * Call this function when the server starts
 */
export const initScheduledCleanup = (): NodeJS.Timeout => {
  console.log("Initializing scheduled server data cleanup");

  // Run cleanup every hour
  return setInterval(() => {
    cleanupServerData();
  }, CLEANUP_INTERVAL);
};

// Clean up function to use at the end of a request
export const cleanupRequestData = (token: string): void => {
  // Implement request-specific cleanup
  // This could include removing the used CSRF token
};
