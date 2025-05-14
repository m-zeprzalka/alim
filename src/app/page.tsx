import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">AliMatrix</h1>
            <p className="font-semibold text-lg">Alimenty bez tajemnic.</p>

            <div className="space-y-4 text-gray-700 text-left">
              <p>
                <strong>AliMatrix</strong> to niezależna inicjatywa oparta na
                rzeczywistych danych. Pokazujemy, jak w praktyce rodzice w
                Polsce dzielą się kosztami utrzymania dzieci.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Wypełniając ten formularz:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    otrzymasz <strong>spersonalizowany raport</strong>
                  </li>
                  <li>
                    pomagasz stworzyć
                    <strong>
                      {" "}
                      pierwszą w Polsce bazę danych alimentacyjnych
                    </strong>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                Przewidywany czas wypełnienia: około 60 minut.
              </p>
            </div>

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
