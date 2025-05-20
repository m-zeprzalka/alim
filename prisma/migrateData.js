// Skrypt do migracji istniejących danych do nowej struktury bazy danych
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function migrateExistingData() {
  console.log("Rozpoczynanie migracji danych do nowej struktury...");

  try {
    // 1. Pobierz wszystkie formularze
    const submissions = await prisma.formSubmission.findMany({
      include: {
        dzieci: true,
      },
    });

    console.log(`Znaleziono ${submissions.length} formularzy do przetworzenia`);

    // 2. Dla każdego formularza
    for (const submission of submissions) {
      try {
        console.log(`Przetwarzanie formularza ${submission.id}...`);

        // Parsuj dane JSON formularza
        const formData =
          typeof submission.formData === "string"
            ? JSON.parse(submission.formData)
            : submission.formData;

        // 3. Ekstrakcja danych użytkownika i adresowych
        const userData = extractUserData(formData);
        if (Object.keys(userData).length > 0) {
          await prisma.formSubmission.update({
            where: { id: submission.id },
            data: userData,
          });
          console.log(
            `Zaktualizowano dane użytkownika dla formularza ${submission.id}`
          );
        }

        // 4. Ekstrakcja danych sądowych
        const courtData = extractCourtData(formData);
        if (Object.keys(courtData).length > 0) {
          await prisma.formSubmission.update({
            where: { id: submission.id },
            data: courtData,
          });
          console.log(
            `Zaktualizowano dane sądowe dla formularza ${submission.id}`
          );
        }

        // 5. Tworzenie lub aktualizacja szczegółowych kosztów utrzymania
        const livingCostsData = extractLivingCostsData(formData);
        if (Object.keys(livingCostsData).length > 0) {
          // Sprawdź czy już istnieje rekord kosztów
          const existingCosts = await prisma.kosztyUtrzymania.findUnique({
            where: { formSubmissionId: submission.id },
          });

          if (existingCosts) {
            await prisma.kosztyUtrzymania.update({
              where: { id: existingCosts.id },
              data: livingCostsData,
            });
            console.log(
              `Zaktualizowano koszty utrzymania dla formularza ${submission.id}`
            );
          } else {
            await prisma.kosztyUtrzymania.create({
              data: {
                ...livingCostsData,
                formSubmission: {
                  connect: { id: submission.id },
                },
              },
            });
            console.log(
              `Utworzono nowy rekord kosztów utrzymania dla formularza ${submission.id}`
            );
          }
        }

        // 6. Aktualizacja danych dzieci
        if (submission.dzieci && submission.dzieci.length > 0) {
          for (const dziecko of submission.dzieci) {
            const childData = extractChildDetailsData(
              formData,
              dziecko.childId
            );
            if (Object.keys(childData).length > 0) {
              await prisma.child.update({
                where: { id: dziecko.id },
                data: childData,
              });
              console.log(
                `Zaktualizowano dane dziecka ${dziecko.childId} dla formularza ${submission.id}`
              );
            }
          }
        }
      } catch (error) {
        console.error(
          `Błąd podczas przetwarzania formularza ${submission.id}:`,
          error
        );
      }
    }

    console.log("Migracja danych zakończona pomyślnie!");
  } catch (error) {
    console.error("Błąd podczas migracji danych:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Funkcja do ekstrahowania danych użytkownika z formData
function extractUserData(formData) {
  const userData = {};

  if (formData.adres) {
    if (formData.adres.street) userData.adresUlica = formData.adres.street;
    if (formData.adres.postalCode)
      userData.adresKodPocztowy = formData.adres.postalCode;
    if (formData.adres.city) userData.adresMiasto = formData.adres.city;
  }

  if (formData.userDetails) {
    if (formData.userDetails.pesel) userData.pesel = formData.userDetails.pesel;
    if (formData.userDetails.phone)
      userData.telefon = formData.userDetails.phone;
    if (formData.userDetails.employmentStatus)
      userData.statusZatrudnienia = formData.userDetails.employmentStatus;
    if (formData.userDetails.monthlyIncome)
      userData.dochodMiesieczny = parseFloat(
        formData.userDetails.monthlyIncome
      );
  }

  return userData;
}

// Funkcja do ekstrahowania danych sądowych z formData
function extractCourtData(formData) {
  const courtData = {};

  if (formData.sadData) {
    if (formData.sadData.judgeName) {
      // Próba rozdzielenia imienia i nazwiska
      const nameParts = formData.sadData.judgeName.split(" ");
      if (nameParts.length >= 2) {
        courtData.imieSedziego = nameParts[0];
        courtData.nazwiskoSedziego = nameParts.slice(1).join(" ");
      } else {
        courtData.nazwiskoSedziego = formData.sadData.judgeName;
      }
    }

    if (formData.sadData.representativeType)
      courtData.typReprezentacji = formData.sadData.representativeType;
    if (formData.sadData.representativeName) {
      // Próba rozdzielenia imienia i nazwiska
      const nameParts = formData.sadData.representativeName.split(" ");
      if (nameParts.length >= 2) {
        courtData.imieReprezentanta = nameParts[0];
        courtData.nazwiskoReprezentanta = nameParts.slice(1).join(" ");
      } else {
        courtData.nazwiskoReprezentanta = formData.sadData.representativeName;
      }
    }

    if (formData.sadData.representativeCost)
      courtData.kosztReprezentacji = parseFloat(
        formData.sadData.representativeCost
      );
    if (formData.sadData.hearingDate)
      courtData.dataRozprawy = new Date(formData.sadData.hearingDate);
    if (formData.sadData.filingDate)
      courtData.dataZlozeniaPozwu = new Date(formData.sadData.filingDate);
    if (formData.sadData.hearingsCount)
      courtData.liczbaRozpraw = parseInt(formData.sadData.hearingsCount);
  }

  return courtData;
}

// Funkcja do ekstrahowania danych o kosztach utrzymania z formData
function extractLivingCostsData(formData) {
  const costsData = {};

  if (formData.kosztyUtrzymania) {
    // Podstawowe koszty (możliwe że są już w bazie)
    if (formData.kosztyUtrzymania.czynsz !== undefined)
      costsData.czynsz = parseFloat(formData.kosztyUtrzymania.czynsz);
    if (formData.kosztyUtrzymania.media !== undefined)
      costsData.media = parseFloat(formData.kosztyUtrzymania.media);
    if (formData.kosztyUtrzymania.kosztyUtrzymania !== undefined)
      costsData.kosztyUtrzymania = parseFloat(
        formData.kosztyUtrzymania.kosztyUtrzymania
      );

    // Szczegółowe koszty mediów (mogą być w formData ale nie w bazie)
    if (formData.kosztyUtrzymania.energia !== undefined)
      costsData.energia = parseFloat(formData.kosztyUtrzymania.energia);
    if (formData.kosztyUtrzymania.woda !== undefined)
      costsData.woda = parseFloat(formData.kosztyUtrzymania.woda);
    if (formData.kosztyUtrzymania.ogrzewanie !== undefined)
      costsData.ogrzewanie = parseFloat(formData.kosztyUtrzymania.ogrzewanie);
    if (formData.kosztyUtrzymania.internet !== undefined)
      costsData.internet = parseFloat(formData.kosztyUtrzymania.internet);
    if (formData.kosztyUtrzymania.telefon !== undefined)
      costsData.telefon = parseFloat(formData.kosztyUtrzymania.telefon);

    // Inne koszty
    if (formData.kosztyUtrzymania.transport !== undefined)
      costsData.transport = parseFloat(formData.kosztyUtrzymania.transport);
    if (formData.kosztyUtrzymania.zywnosc !== undefined)
      costsData.zywnosc = parseFloat(formData.kosztyUtrzymania.zywnosc);
    if (formData.kosztyUtrzymania.lekarstwa !== undefined)
      costsData.lekarstwa = parseFloat(formData.kosztyUtrzymania.lekarstwa);

    // Jeśli utilities istnieje, ale brak szczegółowych danych, podziel równo
    if (
      formData.kosztyUtrzymania.utilities !== undefined &&
      !costsData.energia &&
      !costsData.woda &&
      !costsData.ogrzewanie
    ) {
      const utilities = parseFloat(formData.kosztyUtrzymania.utilities);
      const avgValue = utilities / 3; // Podział na równe części

      costsData.energia = avgValue;
      costsData.woda = avgValue;
      costsData.ogrzewanie = avgValue;
    }

    // Dodatkowe informacje
    if (formData.kosztyUtrzymania.typZamieszkania !== undefined)
      costsData.typZamieszkania = formData.kosztyUtrzymania.typZamieszkania;
    if (formData.kosztyUtrzymania.czestotliwoscOplat !== undefined)
      costsData.czestotliwoscOplat =
        formData.kosztyUtrzymania.czestotliwoscOplat;
    if (formData.kosztyUtrzymania.powierzchniaMieszkania !== undefined)
      costsData.powierzchniaMieszkania = parseFloat(
        formData.kosztyUtrzymania.powierzchniaMieszkania
      );
    if (formData.kosztyUtrzymania.liczbaOsob !== undefined)
      costsData.liczbaOsob = parseInt(formData.kosztyUtrzymania.liczbaOsob);
    if (formData.kosztyUtrzymania.inneKoszty !== undefined)
      costsData.inneKosztyMiesieczne = parseFloat(
        formData.kosztyUtrzymania.inneKoszty
      );
    if (formData.kosztyUtrzymania.inneKosztyOpis !== undefined)
      costsData.inneKosztyOpis = formData.kosztyUtrzymania.inneKosztyOpis;
  }

  return costsData;
}

// Funkcja do ekstrahowania szczegółowych danych o dziecku
function extractChildDetailsData(formData, childId) {
  const childData = {};

  // Znajdź dane dziecka w formData
  if (formData.dzieci && Array.isArray(formData.dzieci)) {
    const dziecko = formData.dzieci.find((d) => d.id === childId);
    if (!dziecko) return childData;

    // Dodatkowe pola edukacyjne
    if (dziecko.poziomEdukacji !== undefined)
      childData.poziomEdukacji = dziecko.poziomEdukacji;
    if (dziecko.kosztySzkoly !== undefined)
      childData.kosztySzkoly = parseFloat(dziecko.kosztySzkoly);
    if (dziecko.dodatkZajeciaCena !== undefined)
      childData.dodatkZajeciaCena = parseFloat(dziecko.dodatkZajeciaCena);
    if (dziecko.rodzajZajec !== undefined)
      childData.rodzajZajec = dziecko.rodzajZajec;

    // Szczegółowy procent czasu opieki
    if (dziecko.szczegolowyProcentCzasu !== undefined) {
      childData.szczegolowyProcentCzasu =
        typeof dziecko.szczegolowyProcentCzasu === "string"
          ? JSON.parse(dziecko.szczegolowyProcentCzasu)
          : dziecko.szczegolowyProcentCzasu;
    }

    // Jeśli mamy dane o czasie opieki w formie tabeli, ale nie mamy szczegolowyProcentCzasu,
    // spróbuj wyekstrahować te dane
    if (dziecko.tabelaCzasu && !childData.szczegolowyProcentCzasu) {
      const tabelaData =
        typeof dziecko.tabelaCzasu === "string"
          ? JSON.parse(dziecko.tabelaCzasu)
          : dziecko.tabelaCzasu;

      if (tabelaData && typeof tabelaData === "object") {
        // Przekształć tabeleCzasu na szczegolowyProcentCzasu
        // Ten kod zależy od struktury tabelaCzasu i musi być dostosowany
        // do rzeczywistej struktury danych
        const procentyDni = {};

        // Przykładowe mapowanie - zakładamy że tabelaData zawiera dni tygodnia
        const dniTygodnia = [
          "poniedzialek",
          "wtorek",
          "sroda",
          "czwartek",
          "piatek",
          "sobota",
          "niedziela",
        ];

        for (const dzien of dniTygodnia) {
          if (tabelaData[dzien] && tabelaData[dzien].procent) {
            procentyDni[dzien] = tabelaData[dzien].procent;
          }
        }

        // Jeśli udało się wyekstrahować jakieś dane
        if (Object.keys(procentyDni).length > 0) {
          childData.szczegolowyProcentCzasu = procentyDni;
        }
      }
    }
  }

  return childData;
}

// Uruchom migrację
migrateExistingData()
  .then(() => console.log("Proces migracji zakończony"))
  .catch((e) => console.error("Błąd podczas migracji:", e));
