"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/custom/Logo";
import { FormProgress } from "@/components/ui/custom/FormProgress";
import { InfoTooltip } from "@/components/ui/custom/InfoTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFormStore } from "@/lib/store/form-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function PostepowanieSadowe() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();

  // Stan oceny adekwatności postępowania
  const [ocenaAdekwatnosci, setOcenaAdekwatnosci] = useState<number>(
    formData.ocenaAdekwatnosciSad || 3
  );

  // Stany dla pozostałych pól formularza
  const [dataDecyzji, setDataDecyzji] = useState<string>(
    formData.dataDecyzjiSad || ""
  );
  const [rodzajSadu, setRodzajSadu] = useState<string>(
    formData.rodzajSaduSad || ""
  );
  const [wojewodztwo, setWojewodztwo] = useState<string>(
    formData.wojewodztwoSad || ""
  );
  const [miejscowosc, setMiejscowosc] = useState<string>(
    formData.miejscowoscSad || ""
  );
  const [liczbaSedzi, setLiczbaSedzi] = useState<string>(
    formData.liczbaSedzi || ""
  );
  const [plecSedziego, setPlecSedziego] = useState<string>(
    formData.plecSedziego || ""
  );
  const [inicjalySedziego, setInicjalySedziego] = useState<string>(
    formData.inicjalySedziego || ""
  );
  const [czyPozew, setCzyPozew] = useState<string>(formData.czyPozew || "");
  const [watekWiny, setWatekWiny] = useState<string>(formData.watekWiny || "");

  // Funkcja obsługująca przejście do następnego kroku
  const handleNext = () => {
    // Zapisujemy dane do store'a
    updateFormData({
      ocenaAdekwatnosciSad: ocenaAdekwatnosci,
      wariantPostepu: "court", // Upewniamy się, że wariant jest zapisany
      dataDecyzjiSad: dataDecyzji,
      rodzajSaduSad: rodzajSadu,
      wojewodztwoSad: wojewodztwo,
      miejscowoscSad: miejscowosc,
      liczbaSedzi: liczbaSedzi,
      plecSedziego: plecSedziego,
      inicjalySedziego: inicjalySedziego,
      czyPozew: czyPozew,
      watekWiny: watekWiny,
    });

    // Przekierowanie do następnego kroku
    router.push("/informacje-o-tobie");
  };
  // Funkcja obsługująca powrót do poprzedniego kroku
  const handleBack = () => {
    router.push("/dochody");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <Logo size="medium" />
          </div>
          <FormProgress currentStep={9} totalSteps={12} />

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                Informacje o postępowaniu sądowym
              </h1>
              <InfoTooltip
                content={
                  <div className="space-y-2 text-sm">
                    <p>
                      W tej części zbieramy informacje o decyzji, która
                      określiła zasady finansowania potrzeb dziecka – może to
                      być wyrok, postanowienie zabezpieczające, ugoda lub inne
                      rozstrzygnięcie.
                    </p>
                    <p>
                      Chcemy lepiej zrozumieć kontekst tej decyzji – kiedy
                      zapadła, przez jaki sąd została wydana, w jakim składzie,
                      oraz jak oceniasz jej adekwatność względem rzeczywistości.
                    </p>
                  </div>
                }
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="block mb-2">
                  Data decyzji lub zatwierdzenia porozumienia
                  <InfoTooltip
                    content={
                      <div className="text-sm">
                        <p>
                          Dzięki tej dacie system lepiej dopasuje porównania do
                          sytuacji rynkowej i orzeczniczej z tamtego okresu.
                        </p>
                      </div>
                    }
                  />
                </Label>
                <Input
                  type="date"
                  value={dataDecyzji}
                  onChange={(e) => setDataDecyzji(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="block mb-2">Sąd, który wydał decyzję</Label>
                <div className="space-y-3">
                  <Select value={rodzajSadu} onValueChange={setRodzajSadu}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rodzaj sądu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rejonowy">Sąd Rejonowy</SelectItem>
                      <SelectItem value="okregowy">Sąd Okręgowy</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={wojewodztwo} onValueChange={setWojewodztwo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Województwo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dolnoslaskie">Dolnośląskie</SelectItem>
                      <SelectItem value="kujawsko-pomorskie">
                        Kujawsko-Pomorskie
                      </SelectItem>
                      <SelectItem value="lubelskie">Lubelskie</SelectItem>
                      <SelectItem value="lubuskie">Lubuskie</SelectItem>
                      <SelectItem value="lodzkie">Łódzkie</SelectItem>
                      <SelectItem value="malopolskie">Małopolskie</SelectItem>
                      <SelectItem value="mazowieckie">Mazowieckie</SelectItem>
                      <SelectItem value="opolskie">Opolskie</SelectItem>
                      <SelectItem value="podkarpackie">Podkarpackie</SelectItem>
                      <SelectItem value="podlaskie">Podlaskie</SelectItem>
                      <SelectItem value="pomorskie">Pomorskie</SelectItem>
                      <SelectItem value="slaskie">Śląskie</SelectItem>
                      <SelectItem value="swietokrzyskie">
                        Świętokrzyskie
                      </SelectItem>
                      <SelectItem value="warminsko-mazurskie">
                        Warmińsko-Mazurskie
                      </SelectItem>
                      <SelectItem value="wielkopolskie">
                        Wielkopolskie
                      </SelectItem>
                      <SelectItem value="zachodniopomorskie">
                        Zachodniopomorskie
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    placeholder="Miejscowość sądu"
                    value={miejscowosc}
                    onChange={(e) => setMiejscowosc(e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Pozwoli to na mapowanie lokalnych różnic w orzecznictwie.
                </p>
              </div>

              <div>
                <Label className="block mb-2">Skład orzekający</Label>
                <div className="space-y-3">
                  <Select value={liczbaSedzi} onValueChange={setLiczbaSedzi}>
                    <SelectTrigger>
                      <SelectValue placeholder="Liczba sędziów" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jeden">1 sędzia</SelectItem>
                      <SelectItem value="trzech">3 sędziów</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={plecSedziego} onValueChange={setPlecSedziego}>
                    <SelectTrigger>
                      <SelectValue placeholder="Płeć sędziego przewodniczącego" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kobieta">Kobieta</SelectItem>
                      <SelectItem value="mezczyzna">Mężczyzna</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    placeholder="Inicjały sędziego prowadzącego (opcjonalnie)"
                    value={inicjalySedziego}
                    onChange={(e) => setInicjalySedziego(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="block mb-2">
                  Czy to Ty złożyłeś/łaś pozew?
                </Label>
                <RadioGroup value={czyPozew} onValueChange={setCzyPozew}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tak" id="pozew-tak" />
                    <Label htmlFor="pozew-tak">Tak</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nie" id="pozew-nie" />
                    <Label htmlFor="pozew-nie">Nie</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="block mb-2">
                  Czy w pozwie pojawił się wątek winy?
                </Label>
                <RadioGroup value={watekWiny} onValueChange={setWatekWiny}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tak-ja" id="wina-ja" />
                    <Label htmlFor="wina-ja">
                      Tak – domagałem/am się orzeczenia o winie
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tak-druga-strona" id="wina-druga" />
                    <Label htmlFor="wina-druga">
                      Tak – druga strona domagała się orzeczenia o winie
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nie" id="wina-nie" />
                    <Label htmlFor="wina-nie">Nie</Label>
                  </div>
                </RadioGroup>
              </div>

              <label className="block">
                <span className="block mb-2">
                  Jak oceniasz adekwatność postępowania sądowego w Twojej
                  sprawie?
                </span>
                <div className="text-sm text-gray-600 mb-2">
                  Oceń w skali 1–5, gdzie 1 oznacza &ldquo;zupełnie
                  nieadekwatny&rdquo;, a 5 &ldquo;w pełni adekwatny&rdquo;
                </div>
                <div className="relative py-5">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      zupełnie nieadekwatny
                    </span>
                    <span className="text-sm text-gray-600">
                      w pełni adekwatny
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={ocenaAdekwatnosci}
                    onChange={(e) =>
                      setOcenaAdekwatnosci(parseInt(e.target.value))
                    }
                    className="w-full"
                  />

                  <div className="flex justify-center mt-4">
                    <span className="font-semibold text-lg">
                      Twoja ocena: {ocenaAdekwatnosci}
                    </span>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleBack}>
                Wstecz
              </Button>
              <Button className="flex-1" onClick={handleNext}>
                Dalej
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
