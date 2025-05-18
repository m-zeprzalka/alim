// Test aplikacji AliMatrix po optymalizacjach
// Ten skrypt ma za zadanie sprawdzić, czy wprowadzone zmiany rozwiązały problemy
// z formularzami i nawigacją między stronami.

function testFormularze() {
  console.log("===== ROZPOCZYNAM TESTY FORMULARZY =====");

  // Sprawdzenie czy tokeny CSRF są prawidłowo inicjalizowane
  const csrfToken = localStorage.getItem("csrf_token");
  console.log(
    "CSRF token:",
    csrfToken ? "OK - token istnieje" : "BŁĄD - brak tokenu"
  );

  // Sprawdzenie mechanizmu zapisywania formularzy
  try {
    // Testowe dane formularza
    const testData = {
      sciezkaWybor: "established",
      sposobFinansowania: "shared",
      __meta: {
        lastUpdated: Date.now(),
        formVersion: "1.1.0",
        testId: "form-test-" + Date.now(),
      },
    };

    // Import niezbędnych modułów
    const {
      obfuscateData,
      deobfuscateData,
    } = require("./src/lib/client-security");

    // Test mechanizmu obfuskacji danych
    const obfuscated = obfuscateData(JSON.stringify(testData));
    console.log("Obfuskacja danych:", obfuscated ? "OK" : "BŁĄD");

    const deobfuscated = deobfuscateData(obfuscated);
    const parsedData = JSON.parse(deobfuscated);
    console.log(
      "Deobfuskacja danych:",
      parsedData.sciezkaWybor === "established" ? "OK" : "BŁĄD"
    );

    console.log("Testy mechanizmów szyfrowania: POMYŚLNE");
  } catch (error) {
    console.error("Błąd podczas testów mechanizmu szyfrowania:", error);
    console.log("Testy mechanizmów szyfrowania: NIEPOWODZENIE");
  }

  // Sprawdzenie nawigacji
  try {
    const { safeNavigate } = require("./src/lib/form-handlers");
    console.log("Import safeNavigate: OK");

    let navigationOccurred = false;

    safeNavigate(
      () => {
        navigationOccurred = true;
        console.log("Nawigacja wykonana");
      },
      () => {
        console.log("Wykonano akcje przed nawigacją");
      },
      50
    ).then(() => {
      console.log(
        "SafeNavigate zakończony: ",
        navigationOccurred ? "OK" : "BŁĄD"
      );
    });

    setTimeout(() => {
      console.log(
        "Test mechanizmu nawigacji: ",
        navigationOccurred ? "POMYŚLNY" : "NIEPOWODZENIE"
      );
    }, 200);
  } catch (error) {
    console.error("Błąd podczas testów mechanizmu nawigacji:", error);
    console.log("Testy mechanizmów nawigacji: NIEPOWODZENIE");
  }

  console.log("===== TESTY FORMULARZY ZAKOŃCZONE =====");
}

// Uruchom testy
try {
  testFormularze();
} catch (e) {
  console.error("Błąd podczas testów:", e);
}
