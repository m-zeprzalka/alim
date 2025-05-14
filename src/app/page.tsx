import { Logo } from "@/components/ui/custom/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent>
          <Logo size="medium" />
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-left text-sky-950">
              AliMatrix - Alimenty bez tajemnic
            </h1>
            <div className="space-y-4 text-sky-950">
              <p>
                <strong>AliMatrix</strong> to niezależna inicjatywa oparta na
                rzeczywistych danych. Pokazujemy, jak w praktyce rodzice w
                Polsce dzielą się kosztami utrzymania dzieci – w różnych
                sytuacjach życiowych, różnych układach opieki i różnych
                decyzjach sądowych. Chcemy, żeby ustalenia dotyczące alimentów
                były bardziej przejrzyste, a mniej zależne od przypadku.
              </p>
              <p>
                Rozwód, rozstanie, ustalanie sposobu finansowania potrzeb
                dziecka – to momenty, które rodzą wiele pytań i niepewności. W
                polskim systemie brakuje jasnych standardów, a decyzje sądowe
                często znacząco się różnią. <strong>AliMatrix</strong> powstał
                po to, by to zmienić – przez analizę rzeczywistych przypadków i
                budowę narzędzia opartego na danych, nie na opiniach.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Wypełniając ten formularz:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Wypełniając ten formularz:{" "}
                    <strong>otrzymasz spersonalizowany raport</strong>, który
                    pokaże, jak Twoja sytuacja wygląda na tle innych podobnych
                    przypadków (pierwsze 1000 osób – bezpłatnie)
                  </li>
                  <li>
                    pomagasz stworzyć{" "}
                    <strong>
                      pierwszą w Polsce bazę danych alimentacyjnych
                    </strong>
                    , która może realnie zmienić system
                  </li>
                </ul>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Uwaga:</strong> obecnie zbieramy dane do stworzenia
                  pierwszych raportów. Aby raporty były wiarygodne i naprawdę
                  użyteczne, potrzebujemy odpowiedniej liczby spójnych
                  przypadków. Po osiągnięciu wymaganej liczby odpowiedzi,
                  przygotujemy i bezpłatnie udostępnimy raporty pierwszym 1000
                  osobom, które wypełniły formularz - Dostęp do raportów będzie
                  w przyszłości odpłatny. O postępach i gotowości raportu
                  będziemy Cię informować, jeśli zdecydujesz się zostawić swój
                  adres e-mail.
                </p>
              </div>

              <p className="text-sm text-gray-600">
                Przewidywany czas wypełnienia: około 60 minut.
              </p>
            </div>
            <p>
              To nie jest zwykła ankieta – to proces, który może przynieść
              wartość także Tobie. Odpowiadając na pytania, być może lepiej
              zrozumiesz swoją sytuację, zobaczysz ją w szerszym kontekście i
              zyskasz wskazówki, które pomogą w dalszych decyzjach. Twoje
              odpowiedzi z kolei pozwolą AliMatrix tworzyć trafniejsze estymacje
              – zarówno dla Ciebie, jak i dla innych osób w podobnej sytuacji.
            </p>
            <p className="font-semibold mt-4">
              Formularz został podzielony na kilka przejrzystych części:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                Informacje o dzieciach, na które ustalane są zasady finansowania
                potrzeb.
              </li>
              <li>
                Dochody, koszty życia rodziców i wydatki związane z wychowaniem
                dzieci.
              </li>
              <li>
                Informacje o postępowaniu sądowym dotyczącym Twojej sytuacji.
              </li>
              <li>
                Dane użytkownika potrzebne do bardziej miarodajnej analizy.
              </li>
            </ul>
            <p className="text-sm mt-2">
              Po zakończeniu wypełniania formularza poprosimy Cię o wyrażenie
              osobnej zgody na przetwarzanie danych w celu przygotowania
              spersonalizowanego raportu. Jeśli zdecydujesz się podać adres
              e‑mail, będzie on przechowywany oddzielnie od pozostałych
              informacji. Twoje dane będą pseudonimizowane i nie będą powiązane
              z Twoją tożsamością. Możesz je w każdej chwili edytować lub
              usunąć. Przetwarzamy je zgodnie z RODO, stosując nowoczesne
              technologie ochrony prywatności i bezpieczeństwa.
            </p>
            <p className="text-sm mt-2">
              Wiemy, że odpowiedzi na pytania dotyczące sytuacji rodzinnej i
              finansowej mogą wymagać chwili zastanowienia. Dlatego formularz
              został zaprojektowany tak, by automatycznie zapisywać Twoje
              postępy. Możesz wypełniać go we własnym tempie – wracać do
              wcześniejszych odpowiedzi, poprawiać je lub uzupełniać, kiedy
              będziesz gotowy.
            </p>
            <p className="text-sm mt-2">
              Dokładne odpowiedzi pomogą zbudować obraz Twojej sytuacji tak, aby
              raport był dla Ciebie naprawdę użytecznym drogowskazem. Każda
              precyzyjna informacja to krok ku większej przejrzystości – dla
              Ciebie i dla tych, którzy pójdą Twoim śladem.
            </p>
            <div className="pt-4">
              <Link href="/sciezka" passHref>
                <Button className="w-full">Rozpocznij</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
