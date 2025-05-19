"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CheckCircle2,
  Info,
  Sparkles,
  Star,
  Shield,
  FileText,
  Scale,
  BarChart3,
  X,
  Menu,
  ArrowUp,
  PenTool,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const CALC_STEPS = [
  { label: "Dane stron", completed: true },
  { label: "Dochody", completed: true },
  { label: "Wydatki", completed: false },
  { label: "Model opieki", completed: false },
  { label: "Potrzeby specjalne", completed: false },
];

const REVIEWS = [
  {
    rating: 5,
    content:
      "AliMatrix skrócił proces wyliczenia alimentów z kilku miesięcy do kilku minut. Sąd w całości przychylił się do kwoty wyliczonej przez system.",
    author: "Anna K.",
    title: "Samodzielna matka 2 dzieci",
  },
  {
    rating: 5,
    content:
      "Korzystam z AliMatrix w mojej kancelarii przy każdej sprawie alimentacyjnej. System jest niezastąpiony w analizie niestandardowych przypadków.",
    author: "mec. Piotr Nowak",
    title: "Kancelaria Prawna Nowak & Wspólnicy",
  },
  {
    rating: 5,
    content:
      "Precyzyjne wyliczenia i profesjonalna dokumentacja. Oszczędzam czas klientów i znacząco zwiększam skuteczność prowadzonych spraw.",
    author: "mec. Joanna Wiśniewska",
    title: "Specjalista prawa rodzinnego",
  },
];

const PARTNERS = [
  "Naczelna Rada Adwokacka",
  "Krajowa Izba Radców Prawnych",
  "Ministerstwo Sprawiedliwości",
  "Rzecznik Praw Dziecka",
  "Centrum Pomocy Prawnej",
];

const CASE_STUDIES = [
  {
    title: "Sprawa z dzieckiem o specjalnych potrzebach",
    amount: "2 100 zł",
    acceptance: "W 100% zaakceptowane przez sąd",
    time: "15 min kalkulacji vs. 3 miesiące tradycyjnie",
    icon: "👨‍👩‍👧",
  },
  {
    title: "Przedsiębiorca z nieregularnym dochodem",
    amount: "1 850 zł",
    acceptance: "W 96% zgodne z wyrokiem sądu",
    time: "22 min kalkulacji vs. 4 miesiące tradycyjnie",
    icon: "👨‍💼",
  },
  {
    title: "Rodzic pracujący za granicą",
    amount: "€450",
    acceptance: "W 98% zgodne z wyrokiem sądu",
    time: "18 min kalkulacji vs. 5 miesięcy tradycyjnie",
    icon: "✈️",
  },
];

const FAQ_ITEMS = [
  {
    question: "Czy wyliczenia AliMatrix są uznawane przez sądy?",
    answer:
      "Tak, wyliczenia AliMatrix są uznawane przez sądy w całej Polsce. System uwzględnia aktualne orzecznictwo, wskaźniki ekonomiczne oraz specyfikę każdej sprawy, co sprawia, że kalkulacje są precyzyjne i mają silne uzasadnienie prawne. Wielu sędziów docenia szczegółowość i transparentność metodologii AliMatrix.",
  },
  {
    question: "Jak długo trwa proces kalkulacji alimentów?",
    answer:
      "Przeciętny czas kalkulacji wynosi 15-20 minut. Wszystko zależy od złożoności sprawy i dostępności kompletnych danych. Po wprowadzeniu wszystkich informacji, system natychmiast przetwarza dane i przedstawia szczegółowe wyliczenia wraz z pełnym uzasadnieniem.",
  },
  {
    question: "Czy muszę mieć wiedzę prawniczą, aby korzystać z systemu?",
    answer:
      "Nie, AliMatrix został zaprojektowany tak, aby był intuicyjny dla wszystkich użytkowników, niezależnie od ich wiedzy prawniczej. System prowadzi Cię krok po kroku przez cały proces, zadając proste pytania i wyjaśniając wszystkie prawne aspekty w przystępny sposób.",
  },
  {
    question: "W jaki sposób AliMatrix uwzględnia specjalne potrzeby dziecka?",
    answer:
      "System zawiera specjalne moduły do uwzględniania dodatkowych potrzeb dzieci, takich jak leczenie, rehabilitacja, edukacja specjalna czy zajęcia dodatkowe. Algorytm analizuje orzecznictwo w podobnych przypadkach i dostosowuje wyliczenia tak, aby zapewnić odpowiednie wsparcie finansowe dla specyficznych potrzeb dziecka.",
  },
  {
    question:
      "Czy mogę skorzystać z AliMatrix, jeśli druga strona nie współpracuje?",
    answer:
      "Tak, możesz skorzystać z AliMatrix nawet jeśli druga strona nie współpracuje. System pozwala na wprowadzenie szacunkowych danych na podstawie dostępnych informacji (np. zawód, średnie wynagrodzenie w branży). Dodatkowo, oferujemy porady jak legalnie pozyskać informacje o dochodach drugiej strony.",
  },
];

// Mini calculator state to make it interactive
const initialState = {
  childrenCount: 1,
  parentIncome: 5000,
  specialNeeds: false,
  result: "",
};

export default function AliMatrixLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("standard");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcValues, setCalcValues] = useState(initialState);

  // Refs for sections
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);

  // Handle mini calculator
  const handleCalculate = () => {
    setIsCalculating(true);
    setCalcValues({ ...calcValues, result: "" });

    // Simulate calculation time
    setTimeout(() => {
      // Basic calculation formula for demo purposes
      let baseAmount = 700 + calcValues.childrenCount * 300;
      let incomeMultiplier = calcValues.parentIncome / 5000;
      let specialNeedsMultiplier = calcValues.specialNeeds ? 1.5 : 1;

      let calculatedAmount = Math.round(
        baseAmount * incomeMultiplier * specialNeedsMultiplier
      );

      setCalcValues({ ...calcValues, result: `${calculatedAmount} zł` });
      setIsCalculating(false);
    }, 1500);
  };

  // Auto-switch testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % REVIEWS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Detect scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderFixed(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      {/* Sticky header */}
      <header
        className={`w-full z-50 transition-all duration-300 ${
          isHeaderFixed
            ? "fixed top-0 bg-white shadow-md py-3"
            : "absolute top-0 bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 bg-blue-950 flex items-center justify-center rounded-lg text-white font-bold text-xl shadow-sm">
              A
            </div>
            <span className="font-bold text-xl text-blue-950">AliMatrix</span>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#funkcje"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
            >
              Funkcje
            </a>
            <a
              href="#opinie"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
            >
              Opinie
            </a>
            <a
              href="#cennik"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
            >
              Cennik
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
            >
              FAQ
            </a>
            <a
              href="/logowanie"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
            >
              Logowanie
            </a>
          </nav>

          {/* CTA button */}
          <div className="hidden md:block">
            <a
              href="/rozpocznij"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              Rozpocznij kalkulację
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="py-3 px-4">
              <nav className="flex flex-col space-y-3">
                <a
                  href="#funkcje"
                  className="text-base font-medium text-gray-700 hover:text-blue-700 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Funkcje
                </a>
                <a
                  href="#opinie"
                  className="text-base font-medium text-gray-700 hover:text-blue-700 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Opinie
                </a>
                <a
                  href="#cennik"
                  className="text-base font-medium text-gray-700 hover:text-blue-700 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cennik
                </a>
                <a
                  href="#faq"
                  className="text-base font-medium text-gray-700 hover:text-blue-700 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </a>
                <a
                  href="/logowanie"
                  className="text-base font-medium text-gray-700 hover:text-blue-700 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Logowanie
                </a>
                <a
                  href="/rozpocznij"
                  className="mt-2 inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Rozpocznij kalkulację
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero section */}
      <section
        ref={heroRef}
        className="relative pt-32 md:pt-40 pb-24 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Hero content */}
            <div className="w-full lg:w-1/2 max-w-2xl mx-auto lg:mx-0">
              {/* Badge */}
              <div className="inline-flex items-center mb-6 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                <Sparkles className="mr-2 h-4 w-4" />
                Rewolucja w alimentach
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-blue-950 leading-tight mb-6">
                Sprawiedliwe alimenty w{" "}
                <span className="text-blue-600">15 minut</span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                AliMatrix wykorzystuje sztuczną inteligencję do analizy tysięcy
                orzeczeń sądowych, aby dostarczyć precyzyjne i uczciwe
                wyliczenia alimentów dopasowane do Twojej sytuacji.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="/rozpocznij"
                  className="inline-flex items-center justify-center px-6 py-4 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all"
                >
                  Rozpocznij bezpłatną kalkulację
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a
                  href="#jak-to-dziala"
                  className="inline-flex items-center justify-center px-6 py-4 text-base font-medium text-blue-700 bg-white border border-blue-200 hover:border-blue-300 rounded-lg shadow-sm transition-all"
                >
                  Dowiedz się więcej
                  <ChevronDown className="ml-2 h-5 w-5" />
                </a>
              </div>

              {/* Social proof */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="flex -space-x-1.5 mr-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <span>12,500+ zadowolonych klientów</span>
                </div>
                <span className="block w-1.5 h-1.5 rounded-full bg-gray-300" />
                <div className="flex items-center">
                  <div className="flex mr-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span>Ocena 4.9/5 (1,250+ opinii)</span>
                </div>
              </div>
            </div>

            {/* Mini calculator */}
            <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Calculator header */}
                <div className="bg-blue-950 px-6 py-4 text-white">
                  <h2 className="text-xl font-bold">
                    Szybki kalkulator alimentów
                  </h2>
                  <p className="text-blue-200 text-sm mt-1">
                    Wypełnij podstawowe dane, aby uzyskać wstępne obliczenia
                  </p>
                </div>

                {/* Calculator body */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Children count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Liczba dzieci
                      </label>
                      <select
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={calcValues.childrenCount}
                        onChange={(e) =>
                          setCalcValues({
                            ...calcValues,
                            childrenCount: parseInt(e.target.value),
                            result: "",
                          })
                        }
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Income */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Miesięczny dochód zobowiązanego (netto)
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="5000"
                          value={calcValues.parentIncome}
                          onChange={(e) =>
                            setCalcValues({
                              ...calcValues,
                              parentIncome: parseInt(e.target.value) || 0,
                              result: "",
                            })
                          }
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">PLN</span>
                        </div>
                      </div>
                    </div>

                    {/* Special needs */}
                    <div className="flex items-center">
                      <input
                        id="special-needs"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={calcValues.specialNeeds}
                        onChange={(e) =>
                          setCalcValues({
                            ...calcValues,
                            specialNeeds: e.target.checked,
                            result: "",
                          })
                        }
                      />
                      <label
                        htmlFor="special-needs"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Dziecko ma specjalne potrzeby (np. leczenie,
                        rehabilitacja)
                      </label>
                    </div>

                    {/* Calculate button */}
                    <button
                      className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCalculate}
                      disabled={isCalculating || calcValues.parentIncome <= 0}
                    >
                      {isCalculating ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Obliczanie...
                        </>
                      ) : (
                        <>
                          Oblicz szacunkową kwotę
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>

                    {/* Results */}
                    {calcValues.result && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Szacowana kwota alimentów
                          </span>
                          <span className="text-blue-600 text-xs font-medium flex items-center">
                            <Info className="h-3 w-3 mr-1" />
                            Wstępna kalkulacja
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-900">
                            {calcValues.result}
                          </span>
                          <a
                            href="/rozpocznij"
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Pełna kalkulacja
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </a>
                        </div>
                        <p className="mt-3 text-xs text-gray-500">
                          Dokładna kwota zależy od wielu czynników, takich jak
                          model opieki, specyficzne potrzeby dziecka, sytuacja
                          mieszkaniowa, i inne okoliczności. Pełna kalkulacja
                          uwzględnia ponad 100 czynników i analizuje aktualne
                          orzecznictwo.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="p-1.5 bg-green-100 rounded-full">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">
                    Bezpieczne i zgodne z RODO
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="p-1.5 bg-blue-100 rounded-full">
                    <Scale className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">
                    Weryfikacja prawnicza
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="p-1.5 bg-purple-100 rounded-full">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700">
                    AI analizuje orzeczenia
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="p-1.5 bg-amber-100 rounded-full">
                    <FileText className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm text-gray-700">
                    Gotowe dokumenty
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Partners logos */}
          <div className="mt-16 md:mt-24">
            <p className="text-sm text-center text-gray-500 mb-6">
              Zaufały nam największe instytucje prawne w Polsce
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-75">
              {PARTNERS.map((partner, index) => (
                <div key={index} className="text-gray-400 font-medium">
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="jak-to-dziala" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              Jak to działa
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
              Uzyskaj sprawiedliwe alimenty w trzech prostych krokach
            </h2>
            <p className="text-lg text-gray-700">
              AliMatrix przeprowadzi Cię przez cały proces kalkulacji alimentów,
              od wprowadzenia danych po gotowe do złożenia dokumenty.
            </p>
          </div>

          {/* Process steps */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 h-full">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-3">
                  Wprowadź dane
                </h3>
                <p className="text-gray-700 mb-4">
                  Odpowiedz na pytania dotyczące Twojej sytuacji. AliMatrix
                  zapyta tylko o niezbędne informacje, aby obliczyć sprawiedliwą
                  kwotę alimentów.
                </p>

                {/* Completion steps */}
                <div className="mt-6">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">
                    Dane do wprowadzenia:
                  </span>
                  <div className="space-y-2 mt-3">
                    {CALC_STEPS.map((step, idx) => (
                      <div key={idx} className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {step.completed ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <span className="text-xs">{idx + 1}</span>
                          )}
                        </div>
                        <span
                          className={`ml-2 text-sm ${
                            step.completed ? "text-gray-700" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connector for desktop */}
              <div className="hidden md:block absolute top-1/4 -right-4 w-8 h-0.5 bg-blue-200">
                <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-blue-400"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 h-full">
                <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-3">
                  AI analizuje dane
                </h3>
                <p className="text-gray-700 mb-4">
                  Zaawansowany algorytm analizuje wprowadzone dane,
                  uwzględniając aktualne orzecznictwo, wskaźniki ekonomiczne i
                  indywidualne okoliczności.
                </p>

                {/* AI analysis visualization */}
                <div className="mt-6 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="font-medium text-gray-700">
                      Analiza w toku...
                    </span>
                    <span className="text-blue-600">4/9 czynników</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Analiza dochodów</span>
                        <span>Ukończono</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Analiza kosztów utrzymania</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full w-3/4"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Porównanie z orzecznictwem</span>
                        <span>42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full w-5/12"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Generowanie dokumentów</span>
                        <span>Oczekiwanie</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-gray-300 h-1.5 rounded-full w-0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector for desktop */}
              <div className="hidden md:block absolute top-1/4 -right-4 w-8 h-0.5 bg-blue-200">
                <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-blue-400"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 h-full">
                <div className="w-12 h-12 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-3">
                  Otrzymaj wyniki i dokumenty
                </h3>
                <p className="text-gray-700 mb-4">
                  W ciągu kilkunastu minut otrzymasz szczegółowe wyliczenia wraz
                  z gotowymi do złożenia dokumentami i profesjonalnym
                  uzasadnieniem.
                </p>

                {/* Result preview */}
                <div className="mt-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-blue-900">
                        Przykładowy wynik
                      </h4>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        98% dokładność
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between pb-2 border-b border-blue-100">
                        <span className="text-sm text-gray-600">
                          Podstawowa kwota alimentów:
                        </span>
                        <span className="font-semibold">1 450 zł / mies.</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-blue-100">
                        <span className="text-sm text-gray-600">
                          Możliwy zakres:
                        </span>
                        <span>1 200 - 1 600 zł</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Dostępne dokumenty:
                        </span>
                        <span className="text-blue-700">4 pliki</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-blue-100">
                      <a
                        href="/przyklad-dokumentu"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center"
                      >
                        <FileText className="mr-1.5 h-4 w-4" />
                        Zobacz przykładowy dokument
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="funkcje" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
              Funkcje
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
              Kompleksowe narzędzie dla spraw alimentacyjnych
            </h2>
            <p className="text-lg text-gray-700">
              AliMatrix to więcej niż kalkulator. To inteligentny asystent,
              który przeprowadzi Cię przez całą sprawę alimentacyjną od początku
              do końca.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg text-blue-700 flex items-center justify-center mb-4">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">
                Precyzyjne obliczenia
              </h3>
              <p className="text-gray-700 mb-4">
                Algorytm oparty na ML analizuje Twoją indywidualną sytuację i
                dostosowuje kwotę alimentów do rzeczywistych potrzeb dziecka i
                możliwości rodziców.
              </p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-blue-700">
                  98% dokładność
                </span>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Dowiedz się więcej
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg text-indigo-700 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">
                Automatyczne dokumenty
              </h3>
              <p className="text-gray-700 mb-4">
                Wygeneruj profesjonalne dokumenty prawne wraz z pełnym
                uzasadnieniem, gotowe do złożenia w sądzie lub wykorzystania w
                negocjacjach.
              </p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-indigo-700">
                  15+ typów dokumentów
                </span>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Dowiedz się więcej
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-lg text-teal-700 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">
                Analiza orzecznictwa
              </h3>
              <p className="text-gray-700 mb-4">
                System analizuje tysiące orzeczeń sądowych, aby przedstawić
                argumentację opartą na aktualnym orzecznictwie i praktyce
                sądowej.
              </p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-teal-700">
                  10 000+ orzeczeń
                </span>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Dowiedz się więcej
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-amber-100 rounded-lg text-amber-700 flex items-center justify-center mb-4">
                <PenTool className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">
                Pomoc prawnika
              </h3>
              <p className="text-gray-700 mb-4">
                Uzyskaj konsultację prawną i wsparcie doświadczonego prawnika,
                który zweryfikuje i udzieli porad dotyczących Twojej sprawy.
              </p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-amber-700">
                  Eksperckie wsparcie
                </span>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Dowiedz się więcej
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-rose-100 rounded-lg text-rose-700 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">
                Bezpieczeństwo danych
              </h3>
              <p className="text-gray-700 mb-4">
                Wszystkie dane są szyfrowane, a system jest w pełni zgodny z
                wymogami RODO i standardami bezpieczeństwa.
              </p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-rose-700">
                  100% bezpieczeństwo
                </span>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Dowiedz się więcej
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg text-purple-700 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">
                Aktualizacje i przypomnienia
              </h3>
              <p className="text-gray-700 mb-4">
                Otrzymuj powiadomienia o zmianach prawnych i terminach, które
                mogą wpłynąć na Twoją sprawę alimentacyjną.
              </p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-purple-700">
                  Zawsze na bieżąco
                </span>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Dowiedz się więcej
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case studies section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-green-100 text-green-700">
              Studia przypadków
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
              Realne historie sukcesu
            </h2>
            <p className="text-lg text-gray-700">
              Zobacz, jak AliMatrix pomógł w prawdziwych sprawach
              alimentacyjnych, oszczędzając czas i zapewniając sprawiedliwe
              rozwiązania.
            </p>
          </div>

          {/* Case studies grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {CASE_STUDIES.map((study, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
              >
                {/* Case icon */}
                <div className="bg-blue-50 p-6 flex justify-center items-center">
                  <span className="text-5xl">{study.icon}</span>
                </div>

                {/* Case content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-blue-950 mb-4">
                    {study.title}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Wyliczona kwota:
                      </span>
                      <span className="font-semibold">{study.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Akceptacja:</span>
                      <span className="text-green-600 font-medium">
                        {study.acceptance}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Czas:</span>
                      <span className="text-blue-600 font-medium">
                        {study.time}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`/case-study-${index + 1}`}
                    className="mt-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Czytaj pełną historię
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section
        id="opinie"
        ref={testimonialsRef}
        className="py-16 md:py-24 bg-blue-950 text-white"
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-blue-800 text-blue-100">
              Opinie klientów
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Co mówią użytkownicy AliMatrix
            </h2>
            <p className="text-xl text-blue-200">
              Przeczytaj opinie osób, które skorzystały z naszego systemu w
              swoich sprawach alimentacyjnych.
            </p>
          </div>

          {/* Testimonial slider */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Current testimonial */}
              <div className="p-8 md:p-10">
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(REVIEWS[activeTestimonial].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
                  "{REVIEWS[activeTestimonial].content}"
                </p>

                {/* Author */}
                <div>
                  <p className="font-bold text-blue-950">
                    {REVIEWS[activeTestimonial].author}
                  </p>
                  <p className="text-gray-600">
                    {REVIEWS[activeTestimonial].title}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-gray-50 py-4 px-8 border-t border-gray-100 flex justify-between items-center">
                <div className="flex space-x-2">
                  {REVIEWS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        activeTestimonial === index
                          ? "bg-blue-600"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="text-gray-500 text-sm">
                  {activeTestimonial + 1} z {REVIEWS.length}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-blue-900/40 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-blue-200 text-sm">dokładność obliczeń</div>
              </div>
              <div className="bg-blue-900/40 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">12 500+</div>
                <div className="text-blue-200 text-sm">
                  zadowolonych klientów
                </div>
              </div>
              <div className="bg-blue-900/40 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">1 200+</div>
                <div className="text-blue-200 text-sm">kancelarii prawnych</div>
              </div>
              <div className="bg-blue-900/40 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">15 min</div>
                <div className="text-blue-200 text-sm">
                  średni czas kalkulacji
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section
        id="cennik"
        ref={pricingRef}
        className="py-16 md:py-24 bg-gray-50"
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
              Cennik
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
              Przejrzyste i uczciwe ceny
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Wybierz plan najlepiej dopasowany do Twoich potrzeb. Wstępna
              kalkulacja zawsze jest bezpłatna.
            </p>

            {/* Plan tabs */}
            <div className="flex justify-center mb-8">
              <div className="p-1 bg-gray-100 rounded-lg inline-flex">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "standard"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-700 hover:text-blue-700"
                  }`}
                  onClick={() => setActiveTab("standard")}
                >
                  Osoby prywatne
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "business"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-700 hover:text-blue-700"
                  }`}
                  onClick={() => setActiveTab("business")}
                >
                  Dla kancelarii
                </button>
              </div>
            </div>
          </div>

          {/* Pricing plans */}
          <div
            className={`max-w-5xl mx-auto grid md:grid-cols-3 gap-8 ${
              activeTab === "standard" ? "block" : "hidden"
            }`}
          >
            {/* Basic plan */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-950 mb-2">
                  Podstawowy
                </h3>
                <p className="text-gray-600 mb-6">
                  Dla osób potrzebujących podstawowej kalkulacji alimentów
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-950">0 zł</span>
                  <span className="text-gray-500 ml-2">bezpłatnie</span>
                </div>

                <a
                  href="/rozpocznij-podstawowy"
                  className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-center text-gray-800 font-medium rounded-lg mb-6 transition-colors"
                >
                  Rozpocznij za darmo
                </a>

                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Podstawowa kalkulacja alimentów
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Szacunkowy zakres kwot
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Podstawowe wskazówki</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <X className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Uzasadnienie prawne</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <X className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Dokumenty do sądu</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Standard plan - highlighted */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-blue-500 overflow-hidden relative transform md:scale-105 z-10">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 uppercase">
                Polecany
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-950 mb-2">
                  Standard
                </h3>
                <p className="text-gray-600 mb-6">
                  Dla osób potrzebujących pełnego wsparcia w sprawie
                  alimentacyjnej
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-950">
                    149 zł
                  </span>
                  <span className="text-gray-500 ml-2">jednorazowo</span>
                </div>

                <a
                  href="/rozpocznij-standard"
                  className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-center text-white font-medium rounded-lg mb-6 transition-colors"
                >
                  Wybierz plan
                </a>

                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Zaawansowana kalkulacja alimentów
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Szczegółowe uzasadnienie prawne
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Komplet dokumentów do sądu
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Analiza porównawcza z orzecznictwem
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      30 dni dostępu do aktualizacji
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium plan */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-950 mb-2">
                  Premium
                </h3>
                <p className="text-gray-600 mb-6">
                  Dla złożonych przypadków wymagających wsparcia prawnika
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-950">
                    349 zł
                  </span>
                  <span className="text-gray-500 ml-2">jednorazowo</span>
                </div>

                <a
                  href="/rozpocznij-premium"
                  className="block w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-center text-white font-medium rounded-lg mb-6 transition-colors"
                >
                  Wybierz plan
                </a>

                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Wszystko co w planie Standard
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      60-minutowa konsultacja z prawnikiem
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Przygotowanie do rozprawy
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Indywidualna strategia
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      90 dni dostępu do aktualizacji
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Business pricing - hidden by default */}
          <div
            className={`max-w-3xl mx-auto ${
              activeTab === "business" ? "block" : "hidden"
            }`}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-950 mb-2">
                      Pakiet dla kancelarii prawnych
                    </h3>
                    <p className="text-gray-600">
                      Kompleksowe rozwiązanie dla kancelarii prowadzących sprawy
                      alimentacyjne
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Sparkles className="mr-1.5 h-4 w-4" />
                      Najlepszy wybór dla profesjonalistów
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-8">
                  {/* Plan features */}
                  <div className="md:w-2/3">
                    <h4 className="text-lg font-medium text-blue-950 mb-4">
                      Zawiera wszystko, czego potrzebuje Twoja kancelaria:
                    </h4>

                    <ul className="space-y-4">
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">
                            Nielimitowane kalkulacje
                          </span>
                          <p className="text-gray-600 text-sm">
                            Twórz nieograniczoną liczbę kalkulacji dla
                            wszystkich spraw klientów
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">
                            Zaawansowana automatyzacja dokumentów
                          </span>
                          <p className="text-gray-600 text-sm">
                            Generuj profesjonalne dokumenty procesowe z
                            możliwością dostosowania do stylu kancelarii
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">
                            Panel do zarządzania sprawami
                          </span>
                          <p className="text-gray-600 text-sm">
                            Zarządzaj wszystkimi sprawami alimentacyjnymi w
                            jednym miejscu
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">
                            Integracja z systemami kancelarii
                          </span>
                          <p className="text-gray-600 text-sm">
                            Możliwość integracji z popularnymi systemami do
                            zarządzania kancelarią
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">
                            Dedykowane wsparcie techniczne
                          </span>
                          <p className="text-gray-600 text-sm">
                            Priorytetowe wsparcie techniczne i prawne
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Pricing and CTA */}
                  <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <div className="text-center mb-6">
                      <div className="text-sm text-gray-500 mb-2">
                        Ceny zaczynają się od
                      </div>
                      <div className="text-3xl font-bold text-blue-950">
                        349 zł / mies.
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Rozliczenie miesięczne
                      </div>
                    </div>

                    <a
                      href="/dla-kancelarii"
                      className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-center text-white font-medium rounded-lg mb-4 transition-colors"
                    >
                      Umów prezentację
                    </a>

                    <a
                      href="/kontakt-biznes"
                      className="block w-full py-3 px-4 bg-white border border-gray-300 hover:border-gray-400 text-center text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      Skontaktuj się z nami
                    </a>

                    <div className="mt-6 text-center">
                      <span className="text-sm text-gray-600">
                        Dostępne również plany roczne z rabatem 20%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section id="faq" ref={faqRef} className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
              Najczęściej zadawane pytania
            </h2>
            <p className="text-lg text-gray-700">
              Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące
              korzystania z AliMatrix.
            </p>
          </div>

          {/* FAQ items */}
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center p-5 text-left"
                    onClick={() =>
                      setActiveFaq(activeFaq === index ? null : index)
                    }
                  >
                    <span className="font-medium text-blue-950">
                      {item.question}
                    </span>
                    <span
                      className={`transform transition-transform ${
                        activeFaq === index ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </span>
                  </button>

                  {activeFaq === index && (
                    <div className="p-5 pt-0 border-t border-gray-200">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* More questions */}
            <div className="mt-10 text-center">
              <p className="text-gray-700 mb-4">
                Nie znalazłeś odpowiedzi na swoje pytanie?
              </p>
              <a
                href="/kontakt"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Skontaktuj się z nami
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 md:py-20 bg-blue-950 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Gotowy, aby uzyskać sprawiedliwe alimenty?
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Dołącz do tysięcy zadowolonych klientów, którzy dzięki AliMatrix
              otrzymali uczciwe wsparcie finansowe dla swoich dzieci.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/rozpocznij"
                className="px-8 py-4 bg-white text-blue-950 font-bold rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                Rozpocznij bezpłatną kalkulację
              </a>
              <a
                href="/demo"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
              >
                Zobacz demo
              </a>
            </div>

            <p className="mt-6 text-blue-300 flex justify-center items-center">
              <Clock className="h-4 w-4 mr-2" />
              Zajmie Ci to tylko 15 minut
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-blue-950 flex items-center justify-center rounded-lg text-white font-bold text-lg">
                  A
                </div>
                <span className="font-bold text-lg text-blue-950">
                  AliMatrix
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Precyzyjne kalkulacje alimentów w oparciu o sztuczną
                inteligencję i aktualnego orzecznictwo.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-700">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-700">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-700">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-semibold text-blue-950 mb-4">
                Szybkie linki
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#funkcje"
                    className="text-gray-600 hover:text-blue-700"
                  >
                    Funkcje
                  </a>
                </li>
                <li>
                  <a
                    href="#opinie"
                    className="text-gray-600 hover:text-blue-700"
                  >
                    Opinie
                  </a>
                </li>
                <li>
                  <a
                    href="#cennik"
                    className="text-gray-600 hover:text-blue-700"
                  >
                    Cennik
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-600 hover:text-blue-700">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-gray-600 hover:text-blue-700">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-blue-950 mb-4">Zasoby</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/poradnik-alimentacyjny"
                    className="text-gray-600 hover:text-blue-700"
                  >
                    Poradnik alimentacyjny
                  </a>
                </li>
                <li>
                  <a
                    href="/dokumenty"
                    className="text-gray-600 hover:text-blue-700"
                  >
                    Wzory dokumentów
                  </a>
                </li>
                <li>
                  <a
                    href="/orzeczenia"
                    className="text-gray-600 hover:text-blue-700"
                  >
                    Baza orzeczeń
                  </a>
                </li>
                <li>
                  <a
                    href="/kalkulator-kosztow"
                    className="text-gray-600 hover:text-blue-700"
                  >
                    Kalkulator kosztów
                  </a>
                </li>
                <li>
                  <a
                    href="/centrum-wiedzy"
                    className="text-gray-600 hover:text-blue-700"
                  >
                    Centrum wiedzy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-blue-950 mb-4">Kontakt</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">kontakt@alimatrix.pl</li>
                <li className="text-gray-600">+48 123 456 789</li>
                <li className="text-gray-600">ul. Przykładowa 123</li>
                <li className="text-gray-600">00-001 Warszawa</li>
              </ul>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} AliMatrix. Wszelkie prawa
              zastrzeżone.
            </p>
            <div className="flex space-x-6">
              <a
                href="/polityka-prywatnosci"
                className="text-sm text-gray-500 hover:text-blue-700"
              >
                Polityka prywatności
              </a>
              <a
                href="/regulamin"
                className="text-sm text-gray-500 hover:text-blue-700"
              >
                Regulamin
              </a>
              <a
                href="/cookies"
                className="text-sm text-gray-500 hover:text-blue-700"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="/rozpocznij"
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <span>Rozpocznij kalkulację</span>
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>

      {/* Back to top button */}
      <div className="fixed bottom-6 left-6 z-40">
        <a
          href="#top"
          className="flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-100 text-blue-700 rounded-full shadow-md hover:shadow-lg transition-all border border-gray-200"
        >
          <ArrowUp className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
