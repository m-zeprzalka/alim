// Skrypt do testowania zapisu danych formularza AliMatrix
// Możesz skopiować ten kod i wkleić go do konsoli deweloperskiej przeglądarki

// Funkcja testująca zapisywanie i odczytywanie danych w localStorage
async function testFormDataPersistence() {
  console.group("🧪 TEST: Persystencja danych formularza");

  try {
    // 0. Wyczyść localStorage przed testem
    const shouldReset = confirm(
      "Czy chcesz wyczyścić dane formularza przed testem?"
    );
    if (shouldReset) {
      localStorage.removeItem("alimatrix-form-storage");
      console.log("✅ Dane formularza wyczyszczone");
    }

    // 1. Pobierz aktualne dane ze store'a (jeśli istnieją)
    const currentData = JSON.parse(
      localStorage.getItem("alimatrix-form-storage") ||
        '{"state":{"formData":{}}}'
    );
    console.log("📊 Aktualne dane formularza:", currentData);

    // 2. Dodaj testowe dane
    const testData = {
      state: {
        formData: {
          ...currentData.state.formData,
          testField: "Test " + new Date().toISOString(),
          submissionId: "test-" + Math.random().toString(36).substring(2, 10),
          dzieci: [
            {
              id: 1,
              wiek: 7,
              plec: "M",
              wskaznikiCzasuOpieki: {
                czasOpiekiBezEdukacji: 60,
                czasAktywnejOpieki: 75,
                czasSnu: 45,
              },
              inneZrodlaUtrzymania: {
                rentaRodzinna: true,
                rentaRodzinnaKwota: 500,
                inne: true,
                inneOpis: "Stypendium testowe",
                inneKwota: 350,
              },
            },
          ],
        },
      },
    };

    // 3. Zapisz testowe dane
    localStorage.setItem("alimatrix-form-storage", JSON.stringify(testData));
    console.log("✅ Testowe dane zapisane");

    // 4. Odczytaj dane ponownie
    const savedData = JSON.parse(
      localStorage.getItem("alimatrix-form-storage") || "{}"
    );
    console.log("📊 Zapisane dane:", savedData);

    // 5. Sprawdź czy dane zostały zapisane poprawnie
    const childData = savedData.state.formData.dzieci?.[0];
    const validations = {
      "ID zgłoszenia":
        savedData.state.formData.submissionId ===
        testData.state.formData.submissionId,
      "Dane dziecka": !!childData,
      "Wskaźniki czasu opieki":
        childData?.wskaznikiCzasuOpieki?.czasOpiekiBezEdukacji === 60 &&
        childData?.wskaznikiCzasuOpieki?.czasAktywnejOpieki === 75 &&
        childData?.wskaznikiCzasuOpieki?.czasSnu === 45,
      "Kwoty źródeł utrzymania":
        childData?.inneZrodlaUtrzymania?.rentaRodzinnaKwota === 500 &&
        childData?.inneZrodlaUtrzymania?.inneKwota === 350,
    };

    // 6. Wyświetl wyniki walidacji
    console.log("🔍 Wyniki walidacji:");
    Object.entries(validations).forEach(([name, result]) => {
      if (result) {
        console.log(`✅ ${name}: OK`);
      } else {
        console.error(`❌ ${name}: BŁĄD`);
      }
    });

    // 7. Podsumowanie
    const allValid = Object.values(validations).every((v) => v);
    if (allValid) {
      console.log("🎉 Wszystkie testy przeszły pomyślnie!");
    } else {
      console.error(
        "⚠️ Niektóre testy nie przeszły, sprawdź szczegóły powyżej"
      );
    }
  } catch (error) {
    console.error("❌ Błąd podczas testowania:", error);
  }

  console.groupEnd();
}

// Uruchom test
testFormDataPersistence().then(() => {
  console.log("Test zakończony");
});
