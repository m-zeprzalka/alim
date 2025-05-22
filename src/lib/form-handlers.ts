// Utility functions for form handling and navigation

/**
 * Ulepszony mechanizm opóźnionej nawigacji, który zapewnia płynne przejścia między stronami
 *
 * @param navigateFunction - Funkcja do wykonania nawigacji, np. router.push('/sciezka')
 * @param beforeNavigate - Opcjonalna funkcja do wykonania przed nawigacją (np. scrollToTop)
 * @param delayMs - Czas opóźnienia w milisekundach (domyślnie 250ms)
 * @returns Promise<void>
 */
export const safeNavigate = async (
  navigateFunction: () => void,
  beforeNavigate?: () => void,
  delayMs = 250
): Promise<void> => {
  try {
    // Wykonaj opcjonalną funkcję przed nawigacją
    if (beforeNavigate) {
      beforeNavigate();
    }

    // Krótkie opóźnienie dla zapewnienia, że UI się zaktualizuje i dane zostaną zapisane
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    // Wykonaj nawigację
    navigateFunction();
  } catch (error) {
    // W przypadku błędu i tak próbujemy nawigować, ale bez opóźnienia
    navigateFunction();
  }
};

/**
 * Generator unikalnych ID operacji dla lepszego śledzenia i debugowania
 * @returns string - Unikalny identyfikator sesji
 */
export const generateOperationId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
};

/**
 * Zaawansowane logi z kontekstem i grupowaniem dla łatwiejszego debugowania
 *
 * @param operationId - ID operacji do śledzenia
 * @param message - Wiadomość do wyświetlenia
 * @param data - Opcjonalne dane do zalogowania
 * @param type - Typ logu ('debug', 'info', 'warn', 'error')
 */
export const trackedLog = (
  operationId: string,
  message: string,
  data?: any,
  type: "debug" | "info" | "warn" | "error" = "debug"
): void => {
  // W wersji produkcyjnej nie wyświetlamy logów
  // Funkcja została zachowana, aby zachować kompatybilność z istniejącym kodem
};

/**
 * Zaawansowany mechanizm ponownych prób dla operacji podatnych na błędy
 *
 * @param operation - Funkcja do wykonania
 * @param options - Opcje konfiguracyjne
 * @returns Promise<T> - Wynik operacji
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    exponentialBackoff?: boolean;
    operationId?: string;
    operationName?: string;
  } = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    delayMs = 100,
    exponentialBackoff = true,
    operationId = generateOperationId(),
    operationName = "operation",
  } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (attempt > 1) {
        trackedLog(
          operationId,
          `Próba ${attempt}/${maxAttempts} dla ${operationName}`,
          undefined,
          "info"
        );
      }

      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        trackedLog(
          operationId,
          `Próba ${attempt}/${maxAttempts} nie powiodła się dla ${operationName}`,
          error,
          "warn"
        );

        // Oblicz opóźnienie przed następną próbą
        const nextDelayMs = exponentialBackoff
          ? delayMs * Math.pow(2, attempt - 1)
          : delayMs;

        await new Promise((resolve) => setTimeout(resolve, nextDelayMs));
      }
    }
  }

  trackedLog(
    operationId,
    `Wszystkie ${maxAttempts} prób operacji ${operationName} nie powiodło się`,
    lastError,
    "error"
  );

  throw lastError;
};
