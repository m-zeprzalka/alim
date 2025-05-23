// CSRF verification helpers
const csrfTokens = new Set<string>();

// Register a token as valid (should be called when generating a token)
export const registerCSRFToken = (token: string): void => {
  // Usunięto logowanie tokenów CSRF ze względów bezpieczeństwa
  csrfTokens.add(token);

  // Clean up tokens periodically (every 100 registrations)
  if (csrfTokens.size > 100) {
    cleanupOldTokens();
  }
};

// Verify a token is valid
export const verifyCSRFToken = (token: string): boolean => {
  const isValid = csrfTokens.has(token);
  // Usunięto logowanie weryfikacji tokenów CSRF ze względów bezpieczeństwa
  return isValid;
};

// Remove a token once used
export const consumeCSRFToken = (token: string): void => {
  csrfTokens.delete(token);
};

// Helper to clean up old tokens
const cleanupOldTokens = (): void => {
  // In a real implementation, tokens would include timestamps
  // and we'd remove old ones. For this simple implementation,
  // we'll just keep the 50 most recent tokens.
  const tokensArray = Array.from(csrfTokens);
  if (tokensArray.length > 50) {
    const tokensToRemove = tokensArray.slice(0, tokensArray.length - 50);
    tokensToRemove.forEach((token) => csrfTokens.delete(token));
  }
};
