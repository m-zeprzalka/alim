// Pomocnik do obsługi trybu offline i zarządzania statusem bazy danych

// Stan połączenia z bazą danych
let databaseStatus = {
  isConnected: false,
  lastConnected: null as Date | null,
  connectionAttempts: 0,
  lastError: null as Error | null,
};

// Sprawdzenie połączenia sieciowego
export function checkNetworkConnection(): boolean {
  if (typeof window !== "undefined") {
    return navigator.onLine;
  }
  return true; // Na serwerze zakładamy, że połączenie istnieje
}

// Domyślna kolejka offline dla elementów, które nie zostały zsynchronizowane
const offlineQueue: Array<{
  type: string;
  data: any;
  timestamp: Date;
  id: string;
}> = [];

// Dodanie elementu do kolejki offline
export function addToOfflineQueue(type: string, data: any): string {
  const id = `offline-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  offlineQueue.push({
    type,
    data,
    timestamp: new Date(),
    id,
  });

  // Zapisz kolejkę w localStorage (jeśli w środowisku klienta)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        "alimatrix_offline_queue",
        JSON.stringify(offlineQueue)
      );
    } catch (error) {
      console.error("Failed to save offline queue to localStorage:", error);
    }
  }

  return id;
}

// Pobranie kolejki offline
export function getOfflineQueue(): typeof offlineQueue {
  // Aktualizuj kolejkę z localStorage (jeśli w środowisku klienta)
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("alimatrix_offline_queue");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Konwersja stringów dat na obiekty Date
        parsed.forEach((item: any) => {
          item.timestamp = new Date(item.timestamp);
        });

        // Merge z istniejącą kolejką (unikając duplikatów)
        const existingIds = new Set(offlineQueue.map((item) => item.id));
        parsed.forEach((item: any) => {
          if (!existingIds.has(item.id)) {
            offlineQueue.push(item);
          }
        });
      }
    } catch (error) {
      console.error("Failed to load offline queue from localStorage:", error);
    }
  }

  return [...offlineQueue];
}

// Czyszczenie kolejki offline
export function clearOfflineQueue(): void {
  offlineQueue.length = 0;

  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("alimatrix_offline_queue");
    } catch (error) {
      console.error("Failed to clear offline queue from localStorage:", error);
    }
  }
}

// Usunięcie elementu z kolejki offline
export function removeFromOfflineQueue(id: string): boolean {
  const initialLength = offlineQueue.length;
  const index = offlineQueue.findIndex((item) => item.id === id);

  if (index !== -1) {
    offlineQueue.splice(index, 1);

    // Aktualizuj localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "alimatrix_offline_queue",
          JSON.stringify(offlineQueue)
        );
      } catch (error) {
        console.error("Failed to update offline queue in localStorage:", error);
      }
    }

    return true;
  }

  return false;
}

// Aktualizacja statusu bazy danych
export function updateDatabaseStatus(connected: boolean, error?: Error): void {
  databaseStatus.isConnected = connected;

  if (connected) {
    databaseStatus.lastConnected = new Date();
    databaseStatus.connectionAttempts = 0;
    databaseStatus.lastError = null;
  } else {
    databaseStatus.connectionAttempts++;
    if (error) {
      databaseStatus.lastError = error;
    }
  }
}

// Pobranie statusu bazy danych
export function getDatabaseStatus(): typeof databaseStatus {
  return { ...databaseStatus };
}

// Sprawdzenie czy używamy trybu offline
export function isOfflineMode(): boolean {
  // Jesteśmy w trybie offline jeśli:
  // 1. Nie ma połączenia sieciowego
  // 2. Baza danych jest niedostępna
  return !checkNetworkConnection() || !databaseStatus.isConnected;
}

// Pobierz dane z formularza zapisane lokalnie
export function getLocalFormData(id: string): any | null {
  if (typeof window === "undefined") return null;

  try {
    const allData = localStorage.getItem("alimatrix_form_backups");
    if (!allData) return null;

    const parsedData = JSON.parse(allData);
    return parsedData[id] || null;
  } catch (error) {
    console.error("Failed to get local form data:", error);
    return null;
  }
}

// Zapisz dane formularza lokalnie
export function saveLocalFormData(id: string, data: any): boolean {
  if (typeof window === "undefined") return false;

  try {
    // Pobierz istniejące dane
    const allData = localStorage.getItem("alimatrix_form_backups");
    const parsedData = allData ? JSON.parse(allData) : {};

    // Dodaj nowe dane
    parsedData[id] = {
      data,
      timestamp: new Date().toISOString(),
    };

    // Zapisz z powrotem do localStorage
    localStorage.setItem("alimatrix_form_backups", JSON.stringify(parsedData));
    return true;
  } catch (error) {
    console.error("Failed to save local form data:", error);
    return false;
  }
}

// Pomocnicza funkcja do inicjalizacji usługi offline przy starcie aplikacji
export function initializeOfflineService(): void {
  // Ładowanie zapisanej kolejki
  getOfflineQueue();

  // Sprawdzanie początkowego stanu połączenia
  if (typeof window !== "undefined") {
    updateDatabaseStatus(navigator.onLine);

    // Nasłuchiwanie zmian stanu połączenia
    window.addEventListener("online", () => {
      updateDatabaseStatus(true);
    });

    window.addEventListener("offline", () => {
      updateDatabaseStatus(false);
    });
  }
}
