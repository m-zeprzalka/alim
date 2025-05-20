# Instrukcja korelacji frontendu z bazą danych w AliMatrix

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Podsumowanie niezgodności](#podsumowanie-niezgodności)
3. [Zidentyfikowane problemy według kategorii](#zidentyfikowane-problemy-według-kategorii)
4. [Plan naprawczy](#plan-naprawczy)
5. [Schematy migracji danych](#schematy-migracji-danych)
6. [Spójność typów danych](#spójność-typów-danych)
7. [Walidacja danych](#walidacja-danych)
8. [Rekomendacje dla eksportu Excel](#rekomendacje-dla-eksportu-excel)

## Wprowadzenie

Niniejszy dokument zawiera szczegółową analizę korelacji między danymi zarządzanymi przez frontend aplikacji AliMatrix a ich reprezentacją w bazie danych oraz eksporcie Excel. Celem jest identyfikacja wszystkich niezgodności i przedstawienie planu ich naprawy, aby zapewnić spójność danych w całym cyklu życia aplikacji.

## Podsumowanie niezgodności

1. **Dane tracone podczas zapisu (krytyczne)**:

   - Frontend zbiera dane, które nie są zapisywane w bazie danych
   - Dotyczy to m.in. szczegółowych opisów, poziomów edukacji, procentów opieki nad dziećmi

2. **Agregacja danych**:

   - Niektóre pola są agregowane przy zapisie do bazy danych (np. media)
   - Tracone są szczegółowe informacje o poszczególnych składnikach

3. **Niezgodności typów danych**:

   - Pola wyboru z predefiniowanymi opcjami w UI zapisywane jako zwykłe String w bazie
   - Brak spójnych formatów dla dat, wartości liczbowych, etc.

4. **Niekompletny eksport Excel**:
   - Wiele pól nie jest uwzględnianych w eksporcie
   - Niektóre dane są agregowane lub formatowane w sposób utrudniający analizę

## Zidentyfikowane problemy według kategorii

### Dane osobowe użytkownika

| Zmienna                            | Problem                                                      | Priorytet |
| ---------------------------------- | ------------------------------------------------------------ | --------- |
| `pesel`                            | Brak szyfrowania w bazie danych                              | WYSOKI    |
| `adres` (street, city, postalCode) | W exporcie wszystkie części adresu są łączone                | ŚREDNI    |
| `employmentStatus`                 | W bazie String bez ograniczeń, w UI z predefiniowanych opcji | NISKI     |
| `maritalStatus`                    | W bazie String bez ograniczeń, w UI z predefiniowanych opcji | NISKI     |

### Dane dotyczące dzieci

| Zmienna                   | Problem                                | Priorytet |
| ------------------------- | -------------------------------------- | --------- |
| `specialNeedsDescription` | Zbierane w UI, ale brak w bazie danych | WYSOKI    |
| `childEducationLevel`     | Zbierane w UI, ale brak w bazie danych | WYSOKI    |
| `childCustodyPercentage`  | Zbierane w UI, ale brak w bazie danych | WYSOKI    |
| `childName`, `childAge`   | W exporcie łączone w jednej komórce    | NISKI     |

### Koszty utrzymania

| Zmienna                         | Problem                                                     | Priorytet |
| ------------------------------- | ----------------------------------------------------------- | --------- |
| `energia`, `woda`, `ogrzewanie` | Zbierane oddzielnie, zapisywane jako jedno pole `utilities` | WYSOKI    |
| `billFrequency`                 | Zbierane w UI, ale brak w bazie danych                      | ŚREDNI    |
| `housingType`                   | Zbierane w UI, ale brak w bazie danych                      | ŚREDNI    |
| `otherDescription`              | Nie eksportowane do Excela                                  | NISKI     |

### Dane sądowe

| Zmienna                     | Problem                                | Priorytet |
| --------------------------- | -------------------------------------- | --------- |
| `judgeName`                 | Zbierane w UI, ale brak w bazie danych | WYSOKI    |
| `representativeType`        | Zbierane w UI, ale brak w bazie danych | WYSOKI    |
| `representativeName`        | Zbierane w UI, ale brak w bazie danych | WYSOKI    |
| `hearingDate`, `filingDate` | Różne formaty daty w UI vs. Excel      | NISKI     |

## Plan naprawczy

### 1. Uzupełnienie schematu bazy danych

Niezbędne jest dodanie brakujących pól w modelach bazy danych poprzez migracje Prisma:

```prisma
// Uzupełnienie modelu Child
model Child {
  // Istniejące pola
  id Int @id @default(autoincrement())
  userId Int
  user User @relation(fields: [userId], references: [id])
  name String
  age Int
  specialNeeds Boolean @default(false)

  // Nowe pola
  specialNeedsDescription String? // Dodane pole
  educationLevel String? // Dodane pole
  custodyPercentage Int? // Dodane pole

  // Pozostałe pola...
}

// Uzupełnienie modelu LivingCosts
model LivingCosts {
  // Istniejące pola
  id Int @id @default(autoincrement())
  userId Int
  user User @relation(fields: [userId], references: [id])
  rent Decimal
  utilities Decimal

  // Nowe pola
  electricity Decimal? // Dodane pole
  water Decimal? // Dodane pole
  heating Decimal? // Dodane pole
  billFrequency String? // Dodane pole
  housingType String? // Dodane pole

  // Pozostałe pola...
}

// Uzupełnienie modelu CourtCase
model CourtCase {
  // Istniejące pola
  id Int @id @default(autoincrement())
  userId Int
  user User @relation(fields: [userId], references: [id])
  courtId Int
  court Court @relation(fields: [courtId], references: [id])

  // Nowe pola
  judgeName String? // Dodane pole
  representativeType String? // Dodane pole
  representativeName String? // Dodane pole

  // Pozostałe pola...
}
```

### 2. Aktualizacja funkcji mapujących dane

Należy zaktualizować funkcje mapujące dane między frontendem a backendem:

```typescript
// Przykład aktualizacji funkcji mapującej dla kosztów utrzymania
function mapLivingCostsFormToDbModel(formData) {
  return {
    // Zachowujemy kompatybilność wsteczną
    utilities:
      Number(formData.energia || 0) +
      Number(formData.woda || 0) +
      Number(formData.ogrzewanie || 0),

    // Dodajemy nowe pola
    electricity: Number(formData.energia || 0),
    water: Number(formData.woda || 0),
    heating: Number(formData.ogrzewanie || 0),
    billFrequency: formData.billFrequency,
    housingType: formData.housingType,

    // Pozostałe pola...
    rent: Number(formData.rent || 0),
    transport: Number(formData.transport || 0),
    food: Number(formData.food || 0),
    // ...
  };
}
```

### 3. Implementacja walidacji danych

Należy zaimplementować spójny system walidacji danych:

```typescript
// Przykład implementacji walidacji z zod
import { z } from "zod";

// Definicja schematów walidacji
export const childSchema = z.object({
  name: z.string().min(1, "Imię dziecka jest wymagane"),
  age: z.number().int().min(0).max(26),
  specialNeeds: z.boolean(),
  specialNeedsDescription: z.string().optional(),
  educationLevel: z.string().optional(),
  custodyPercentage: z.number().int().min(0).max(100).optional(),
  // ...
});

export const livingCostsSchema = z.object({
  rent: z.number().min(0),
  energia: z.number().min(0),
  woda: z.number().min(0),
  ogrzewanie: z.number().min(0),
  billFrequency: z.string().optional(),
  housingType: z.string().optional(),
  // ...
});

// Walidacja w API
export async function validateFormData(data, schema) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.flatten(),
    };
  }
  return {
    valid: true,
    data: result.data,
  };
}
```

### 4. Aktualizacja funkcji eksportu Excel

Należy rozszerzyć funkcje eksportu Excel, aby uwzględniały wszystkie pola:

```typescript
function exportUserDataToExcel(userData) {
  const worksheet = XLSX.utils.json_to_sheet([
    {
      Imię: userData.firstName,
      Nazwisko: userData.lastName,
      Email: userData.email,
      PESEL: userData.userDetails?.pesel || "",
      Adres: `${userData.address?.street || ""}, ${
        userData.address?.postalCode || ""
      } ${userData.address?.city || ""}`,
      Telefon: userData.userDetails?.phone || "",
      "Status zawodowy": userData.userDetails?.employmentStatus || "",
      "Dochód miesięczny": userData.userDetails?.monthlyIncome || "",
      "Stan cywilny": userData.userDetails?.maritalStatus || "",

      // Dodanie brakujących pól
      "Dzieci - imiona": userData.children?.map((c) => c.name).join(", ") || "",
      "Dzieci - wiek": userData.children?.map((c) => c.age).join(", ") || "",
      "Dzieci - szczegółowe potrzeby":
        userData.children
          ?.map((c) =>
            c.specialNeeds ? c.specialNeedsDescription || "Tak" : "Nie"
          )
          .join(", ") || "",
      "Dzieci - poziom edukacji":
        userData.children?.map((c) => c.educationLevel).join(", ") || "",

      // Koszty utrzymania
      Czynsz: userData.livingCosts?.rent || "",
      Energia: userData.livingCosts?.electricity || "",
      Woda: userData.livingCosts?.water || "",
      Ogrzewanie: userData.livingCosts?.heating || "",
      "Media (łącznie)": userData.livingCosts?.utilities || "",
      "Częstotliwość opłat": userData.livingCosts?.billFrequency || "",
      "Typ zamieszkania": userData.livingCosts?.housingType || "",

      // Dane sądowe
      Sąd: userData.courtCase?.court?.name || "",
      Sędzia: userData.courtCase?.judgeName || "",
      Reprezentant: userData.courtCase?.representativeName || "",
      "Typ reprezentacji": userData.courtCase?.representativeType || "",

      // ...pozostałe pola
    },
  ]);

  // Formatowanie danych
  // ...
}
```

## Schematy migracji danych

Poniżej przedstawiono przykładowe schematy migracji danych dla rozwiązania zidentyfikowanych problemów:

### Przykład migracji Prisma dla uzupełnienia modeli:

```sql
-- AlterTable: Child
ALTER TABLE "Child" ADD COLUMN "specialNeedsDescription" TEXT;
ALTER TABLE "Child" ADD COLUMN "educationLevel" TEXT;
ALTER TABLE "Child" ADD COLUMN "custodyPercentage" INTEGER;

-- AlterTable: LivingCosts
ALTER TABLE "LivingCosts" ADD COLUMN "electricity" DECIMAL(10,2);
ALTER TABLE "LivingCosts" ADD COLUMN "water" DECIMAL(10,2);
ALTER TABLE "LivingCosts" ADD COLUMN "heating" DECIMAL(10,2);
ALTER TABLE "LivingCosts" ADD COLUMN "billFrequency" TEXT;
ALTER TABLE "LivingCosts" ADD COLUMN "housingType" TEXT;

-- AlterTable: CourtCase
ALTER TABLE "CourtCase" ADD COLUMN "judgeName" TEXT;
ALTER TABLE "CourtCase" ADD COLUMN "representativeType" TEXT;
ALTER TABLE "CourtCase" ADD COLUMN "representativeName" TEXT;
```

### Migracja danych istniejących (przykładowa procedura):

```typescript
async function migrateExistingData() {
  // 1. Pobierz wszystkie rekordy LivingCosts
  const livingCosts = await prisma.livingCosts.findMany();

  // 2. Aktualizuj każdy rekord, dzieląc pole 'utilities' na składowe
  // (To jest uproszczenie - w rzeczywistości potrzebna byłaby logika podziału)
  for (const cost of livingCosts) {
    const avgValue = cost.utilities / 3; // Przykładowy podział na równe części

    await prisma.livingCosts.update({
      where: { id: cost.id },
      data: {
        electricity: avgValue,
        water: avgValue,
        heating: avgValue,
      },
    });
  }

  // 3. Podobne migracje dla innych modeli
  // ...
}
```

## Spójność typów danych

Aby zapewnić spójność typów danych, rekomenduje się następujące podejście:

### 1. Wprowadzenie enumeracji dla pól z predefiniowanymi opcjami:

```typescript
// Przykład w schema.prisma
enum EmploymentStatus {
  EMPLOYED
  SELF_EMPLOYED
  UNEMPLOYED
  STUDENT
  RETIRED
}

enum MaritalStatus {
  SINGLE
  MARRIED
  DIVORCED
  WIDOWED
  SEPARATED
}

// Użycie w modelu
model UserDetails {
  // ...
  employmentStatus EmploymentStatus
  maritalStatus MaritalStatus
  // ...
}
```

### 2. Standaryzacja formatów dat:

```typescript
// Przykłady formatowania dat
export function formatDateForUI(date: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pl-PL");
}

export function formatDateForExport(date: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function formatDateForDB(date: string): Date | null {
  if (!date) return null;
  return new Date(date);
}
```

### 3. Standaryzacja formatów liczbowych:

```typescript
// Przykłady formatowania liczb
export function formatCurrencyForUI(value: number | null): string {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

export function formatCurrencyForExport(value: number | null): string {
  if (value === null || value === undefined) return "";
  return value.toFixed(2);
}

export function parseCurrencyForDB(value: string): number | null {
  if (!value) return null;
  return parseFloat(value.replace(/[^\d.,]/g, "").replace(",", "."));
}
```

## Walidacja danych

Rekomenduje się wdrożenie kompleksowego systemu walidacji danych:

### 1. Centralne schematy walidacji:

```typescript
// centralne schematy walidacji w /lib/schemas/

// Schemat dziecka
export const childSchema = z.object({
  name: z.string().min(1, "Imię dziecka jest wymagane"),
  age: z
    .number()
    .int()
    .min(0, "Wiek nie może być ujemny")
    .max(26, "Maksymalny wiek to 26 lat"),
  specialNeeds: z.boolean(),
  specialNeedsDescription: z.string().optional().nullable(),
  educationLevel: z
    .enum(["NONE", "PRESCHOOL", "PRIMARY", "SECONDARY", "HIGHER"])
    .optional()
    .nullable(),
  custodyPercentage: z.number().int().min(0).max(100).optional().nullable(),
  // ...
});

// Schemat kosztów utrzymania
export const livingCostsSchema = z.object({
  rent: z.number().min(0, "Wartość nie może być ujemna"),
  energia: z.number().min(0, "Wartość nie może być ujemna"),
  woda: z.number().min(0, "Wartość nie może być ujemna"),
  ogrzewanie: z.number().min(0, "Wartość nie może być ujemna"),
  billFrequency: z
    .enum(["MONTHLY", "QUARTERLY", "YEARLY"])
    .optional()
    .nullable(),
  housingType: z
    .enum(["OWNED", "RENTED", "COMMUNAL", "FAMILY"])
    .optional()
    .nullable(),
  // ...
});

// itd. dla pozostałych formularzy
```

### 2. Walidacja w komponentach UI:

```tsx
// Przykład użycia w komponencie React
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { childSchema } from "@/lib/schemas/child-schema";

export default function ChildForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(childSchema),
  });

  const onSubmit = (data) => {
    // Dane są już zwalidowane
    saveChild(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Imię dziecka</label>
        <input {...register("name")} />
        {errors.name && <p className="error">{errors.name.message}</p>}
      </div>

      <div>
        <label>Wiek</label>
        <input type="number" {...register("age", { valueAsNumber: true })} />
        {errors.age && <p className="error">{errors.age.message}</p>}
      </div>

      {/* Pozostałe pola */}
    </form>
  );
}
```

### 3. Walidacja w API:

```typescript
// Przykład walidacji w API route
import { childSchema } from "@/lib/schemas/child-schema";

export async function POST(req, res) {
  try {
    const data = await req.json();

    // Walidacja danych
    const validationResult = childSchema.safeParse(data);
    if (!validationResult.success) {
      return Response.json(
        {
          error: "Nieprawidłowe dane",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Dane są poprawne, można zapisać do bazy
    const result = await prisma.child.create({
      data: {
        userId: data.userId,
        name: data.name,
        age: data.age,
        specialNeeds: data.specialNeeds,
        specialNeedsDescription: data.specialNeedsDescription,
        educationLevel: data.educationLevel,
        custodyPercentage: data.custodyPercentage,
        // ...
      },
    });

    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Error saving child data:", error);
    return Response.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
```

## Rekomendacje dla eksportu Excel

### 1. Rozdzielenie danych w eksporcie:

```typescript
// Przykład eksportu z rozdzieleniem danych dzieci
function exportChildrenData(children) {
  // Zamiast łączyć dane dzieci w jednej komórce
  // Tworzymy oddzielne wiersze dla każdego dziecka

  return children.map((child, index) => ({
    [`Dziecko ${index + 1} - Imię`]: child.name,
    [`Dziecko ${index + 1} - Wiek`]: child.age,
    [`Dziecko ${index + 1} - Szczególne potrzeby`]: child.specialNeeds
      ? "Tak"
      : "Nie",
    [`Dziecko ${index + 1} - Opis potrzeb`]:
      child.specialNeedsDescription || "",
    [`Dziecko ${index + 1} - Poziom edukacji`]: child.educationLevel || "",
    [`Dziecko ${index + 1} - Procent opieki`]: child.custodyPercentage
      ? `${child.custodyPercentage}%`
      : "",
  }));
}
```

### 2. Formatowanie danych w eksporcie:

```typescript
// Funkcja do formatowania dat w eksporcie Excel
function formatDateForExcel(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// Funkcja do formatowania kwot w eksporcie Excel
function formatCurrencyForExcel(value) {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
```

### 3. Dodanie dodatkowych arkuszy z danymi szczegółowymi:

```typescript
// Tworzenie wielu arkuszy w eksporcie Excel
function createDetailedExcelExport(userData) {
  const workbook = XLSX.utils.book_new();

  // Arkusz 1: Podsumowanie główne
  const summaryData = [
    {
      "Imię i nazwisko": `${userData.firstName} ${userData.lastName}`,
      Email: userData.email,
      "Liczba dzieci": userData.children?.length || 0,
      // ...pozostałe podsumowania
    },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Podsumowanie");

  // Arkusz 2: Szczegółowe dane dzieci
  if (userData.children?.length > 0) {
    const childrenData = userData.children.map((child) => ({
      Imię: child.name,
      Wiek: child.age,
      "Szczególne potrzeby": child.specialNeeds ? "Tak" : "Nie",
      "Opis potrzeb": child.specialNeedsDescription || "",
      "Poziom edukacji": child.educationLevel || "",
      "Procent opieki": child.custodyPercentage
        ? `${child.custodyPercentage}%`
        : "",
    }));
    const childrenSheet = XLSX.utils.json_to_sheet(childrenData);
    XLSX.utils.book_append_sheet(workbook, childrenSheet, "Dzieci");
  }

  // Arkusz 3: Koszty utrzymania
  // ...

  // Zwróć workbook
  return workbook;
}
```

---

Implementacja powyższych rekomendacji pozwoli na znaczące zwiększenie spójności danych między frontendem, backendem i eksportem Excel w aplikacji AliMatrix. Dzięki temu użytkownicy będą mieli pewność, że wszystkie wprowadzone przez nich dane są prawidłowo przechowywane i można je w pełni wykorzystać w raportach i analizach.
