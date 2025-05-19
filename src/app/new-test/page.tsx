"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/custom/Logo";
import {
  ArrowRight,
  ArrowUp,
  CheckCircle,
  BarChart,
  FileText,
  Scale,
  Shield,
  Menu,
  X,
  ChevronRight,
  Calendar,
  Sparkles,
} from "lucide-react";

// Main data
const SITE_DATA = {
  tagline: "Rewolucja w alimentach",
  headline: "Precyzyjne kalkulacje alimentów w oparciu o sztuczną inteligencję",
  description:
    "AliMatrix analizuje tysiące orzeczeń sądowych, aktualne wskaźniki ekonomiczne i indywidualne okoliczności, aby dostarczyć najbardziej sprawiedliwe i precyzyjne wyliczenia zobowiązań alimentacyjnych.",
  ctaPrimary: "Rozpocznij kalkulację",
  ctaSecondary: "Zobacz demo",
  trustBadges: [
    "Zweryfikowano przez prawników",
    "Ponad 10 000 spraw zakończonych sukcesem",
    "Najnowsze orzecznictwo",
    "Zgodność z RODO",
  ],
  stats: [
    { value: "98%", label: "dokładność obliczeń" },
    { value: "12,500+", label: "zadowolonych klientów" },
    { value: "1,200+", label: "kancelarii prawnych" },
    { value: "15 min", label: "średni czas kalkulacji" },
  ],
};

const FEATURES = [
  {
    title: "Precyzyjne obliczenia alimentacyjne",
    description:
      "Algorytmy oparte na modelach ML analizują okoliczności sprawy i dostosowują kwotę do indywidualnej sytuacji.",
    icon: Scale,
    stats: { value: "98%", label: "dokładność" },
  },
  {
    title: "Automatyczna dokumentacja",
    description:
      "Generuj gotowe do złożenia w sądzie wnioski i załączniki z profesjonalnym uzasadnieniem.",
    icon: FileText,
    stats: { value: "30+", label: "szablonów" },
  },
  {
    title: "Kompleksowa analiza sytuacji",
    description:
      "Uwzględniamy wszystkie aspekty - stan majątkowy, model opieki, specjalne potrzeby dzieci i wiele innych.",
    icon: BarChart,
    stats: { value: "100+", label: "czynników" },
  },
  {
    title: "Gwarancja bezpieczeństwa",
    description:
      "Wszystkie dane są szyfrowane, a nasz system jest w pełni zgodny z wymogami RODO i najwyższymi standardami bezpieczeństwa.",
    icon: Shield,
    stats: { value: "100%", label: "bezpieczeństwo" },
  },
];

const TESTIMONIALS = [
  {
    content:
      "AliMatrix skrócił proces wyliczenia alimentów z kilku miesięcy do kilku minut. Sąd w całości przychylił się do kwoty wyliczonej przez system.",
    author: "Anna K.",
    title: "Samodzielna matka 2 dzieci",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    content:
      "Korzystam z AliMatrix w mojej kancelarii przy każdej sprawie alimentacyjnej. System jest niezastąpiony w analizie niestandardowych przypadków.",
    author: "mec. Piotr Nowak",
    title: "Kancelaria Prawna Nowak & Wspólnicy",
    avatar: "https://i.pravatar.cc/150?img=61",
  },
  {
    content:
      "Precyzyjne wyliczenia i profesjonalna dokumentacja. Oszczędzam czas klientów i znacząco zwiększam skuteczność prowadzonych spraw.",
    author: "mec. Joanna Wiśniewska",
    title: "Specjalista prawa rodzinnego",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Wprowadź dane",
    description:
      "Odpowiedz na pytania dotyczące sytuacji finansowej, liczby dzieci i modelu opieki.",
    icon: "01",
  },
  {
    title: "Analiza i kalkulacja",
    description:
      "Nasz algorytm analizuje dane w kontekście aktualnego orzecznictwa i wskaźników ekonomicznych.",
    icon: "02",
  },
  {
    title: "Otrzymaj dokumentację",
    description:
      "Wygeneruj pełne uzasadnienie, wniosek alimentacyjny i inne potrzebne dokumenty.",
    icon: "03",
  },
];

const BLOG_POSTS = [
  {
    title: "Nowe orzecznictwo SN w sprawach alimentacyjnych - 2025",
    excerpt:
      "Najnowsze interpretacje Sądu Najwyższego zmieniają podejście do obliczania alimentów w przypadku szczególnych potrzeb dzieci.",
    author: "mec. Maria Kowalska",
    date: "18 maja 2025",
    category: "Prawo rodzinne",
    image: "/blog-post-1.jpg",
    readTime: "6 min",
  },
  {
    title: "Jak przygotować się do sprawy o alimenty - praktyczny przewodnik",
    excerpt:
      "Kompleksowe wskazówki dla rodziców dotyczące dokumentacji, argumentacji i współpracy z prawnikiem podczas sprawy o alimenty.",
    author: "dr Adam Nowak",
    date: "10 maja 2025",
    category: "Poradniki",
    image: "/blog-post-2.jpg",
    readTime: "9 min",
  },
  {
    title: "Sztuczna inteligencja w prawie rodzinnym - przełom czy zagrożenie?",
    excerpt:
      "Analiza wpływu AI na postępowania sądowe, ze szczególnym uwzględnieniem spraw alimentacyjnych i opieki nad dziećmi.",
    author: "prof. Ewa Wiśniewska",
    date: "28 kwietnia 2025",
    category: "Technologia",
    image: "/blog-post-3.jpg",
    readTime: "11 min",
  },
];

export default function AliMatrixPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for sections
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const blogRef = useRef(null);
  const ctaRef = useRef(null);

  // Check if element is in view
  const useInView = (ref) => {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [ref]);

    return isInView;
  };

  const isHeroInView = useInView(heroRef);
  const areFeaturesInView = useInView(featuresRef);
  const areTestimonialsInView = useInView(testimonialsRef);
  const isHowItWorksInView = useInView(howItWorksRef);
  const isBlogInView = useInView(blogRef);
  const isCtaInView = useInView(ctaRef);

  // Auto-switch testimonials
  useEffect(() => {
    if (!areTestimonialsInView) return;

    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [areTestimonialsInView]);

  // Detect scroll for navigation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simple fade-in animation variant
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="relative min-h-screen bg-sky-50 text-sky-950 overflow-hidden">
      {/* Background elements - simplified */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-sky-100 to-sky-50/0" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60" />
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60" />
      </div>

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Logo size="large" />
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#funkcje"
                className="text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
              >
                Funkcje
              </a>
              <a
                href="#jak-to-dziala"
                className="text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
              >
                Jak to działa
              </a>
              <a
                href="#opinie"
                className="text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
              >
                Opinie
              </a>
              <a
                href="#blog"
                className="text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
              >
                Blog
              </a>
              <a
                href="/logowanie"
                className="text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
              >
                Logowanie
              </a>
            </nav>

            {/* CTA button */}
            <div className="hidden lg:block">
              <a
                href="/rozpocznij"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-sky-950 hover:bg-sky-800 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Rozpocznij kalkulację
                <ArrowRight className="ml-2 -mr-0.5 h-4 w-4" />
              </a>
            </div>

            {/* Mobile hamburger button */}
            <div className="md:hidden">
              <button
                className="p-2.5 rounded-md text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 py-5 bg-white shadow-lg border-t border-sky-100">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#funkcje"
                  className="block text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Funkcje
                </a>
                <a
                  href="#jak-to-dziala"
                  className="block text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jak to działa
                </a>
                <a
                  href="#opinie"
                  className="block text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Opinie
                </a>
                <a
                  href="#blog"
                  className="block text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </a>
                <a
                  href="/logowanie"
                  className="block text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Logowanie
                </a>
                <div className="pt-2 mt-2 border-t border-sky-100">
                  <a
                    href="/rozpocznij"
                    className="flex w-full items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-sky-950 hover:bg-sky-800 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Rozpocznij kalkulację
                    <ArrowRight className="ml-2 -mr-0.5 h-4 w-4" />
                  </a>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero section */}
      <section
        ref={heroRef}
        className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden"
      >
        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <div className="flex flex-col lg:flex-row items-center">
            {/* Hero content */}
            <div className="w-full lg:w-1/2 lg:pr-10 mb-10 lg:mb-0">
              {/* Tagline */}
              <span className="inline-flex items-center px-3 py-1 mb-5 rounded-full bg-sky-100 text-sky-800 text-sm font-medium ring-1 ring-inset ring-sky-700/20">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-700"></span>
                </span>
                {SITE_DATA.tagline}
              </span>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-sky-950 leading-tight">
                <span className="text-sky-700 inline-block mb-1">
                  {SITE_DATA.headline.split(" ").slice(0, 3).join(" ")}
                </span>
                <br />
                {SITE_DATA.headline.split(" ").slice(3).join(" ")}
              </h1>

              {/* Description */}
              <p className="mt-6 text-lg text-sky-800 leading-relaxed max-w-xl">
                {SITE_DATA.description}
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="/rozpocznij"
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-sky-950 hover:bg-sky-800 shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                >
                  {SITE_DATA.ctaPrimary}
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </a>
                <a
                  href="/demo"
                  className="inline-flex justify-center items-center px-6 py-3 border border-sky-300 text-base font-medium rounded-lg text-sky-700 bg-white hover:bg-sky-50 shadow-sm hover:shadow transition-all duration-300 w-full sm:w-auto"
                >
                  {SITE_DATA.ctaSecondary}
                  <svg
                    className="ml-2 -mr-1 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {SITE_DATA.trustBadges.map((badge, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-sky-700">{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero calculator card - modernized AliMatrix Card */}
            <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative max-w-lg mx-auto">
                {/* Main card */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-sky-100">
                  {/* Card header */}
                  <div className="bg-sky-950 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-sky-100 rounded-lg flex items-center justify-center">
                          <Scale className="h-5 w-5 text-sky-950" />
                        </div>
                        <h3 className="text-white font-medium">
                          Kalkulator alimentów
                        </h3>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-sky-800 text-sky-100 text-xs font-medium">
                          <Sparkles className="h-3 w-3 mr-1" /> AI
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress tracker */}
                  <div className="px-6 py-4 bg-sky-50 border-b border-sky-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-sky-950">
                        Postęp kalkulacji
                      </span>
                      <span className="text-sm text-sky-700">7/9</span>
                    </div>
                    <div className="w-full bg-sky-200 rounded-full h-2">
                      <div
                        className="bg-sky-700 h-2 rounded-full"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-6">
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-sky-950 mb-4">
                        Koszty utrzymania dziecka
                      </h4>

                      {/* Form fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-sky-700 mb-1">
                            Koszty mieszkaniowe
                          </label>
                          <div className="flex gap-3">
                            <div className="w-2/3 h-10 bg-white border border-sky-200 rounded-md px-3 py-2 text-sm">
                              1100 PLN
                            </div>
                            <div className="w-1/3 h-10 bg-sky-50 border border-sky-200 rounded-md flex items-center justify-center text-sm text-sky-700 font-medium">
                              550 PLN
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-sky-600">
                            Udział dziecka: 50%
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-sky-700 mb-1">
                            Koszty wyżywienia
                          </label>
                          <div className="flex gap-3">
                            <div className="w-2/3 h-10 bg-white border border-sky-200 rounded-md px-3 py-2 text-sm">
                              800 PLN
                            </div>
                            <div className="w-1/3 h-10 bg-sky-50 border border-sky-200 rounded-md flex items-center justify-center">
                              <div className="flex items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-sky-700"
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
                                <span className="text-sm text-sky-700">
                                  Obliczanie
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-sky-600">
                            W oparciu o dane GUS 2025
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-sky-700 mb-1">
                            Edukacja i zajęcia dodatkowe
                          </label>
                          <div className="flex gap-3">
                            <div className="w-2/3 h-10 bg-white border border-sky-200 rounded-md px-3 py-2 text-sm">
                              700 PLN
                            </div>
                            <div className="w-1/3 h-10 bg-sky-50 border border-sky-200 rounded-md flex items-center justify-center text-sm text-sky-700 font-medium">
                              700 PLN
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-sky-600">
                            Udział dziecka: 100%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Results card */}
                    <div className="bg-sky-50 rounded-lg p-4 border border-sky-200">
                      <div className="flex justify-between mb-3">
                        <h5 className="text-sm font-medium text-sky-950">
                          Aktualne wyliczenie
                        </h5>
                        <div className="flex items-center text-xs text-sky-600">
                          <span className="relative flex h-2 w-2 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
                          </span>
                          Aktualizacja na żywo
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-sky-200">
                        <div className="text-sm text-sky-700">
                          Szacowana kwota alimentów
                        </div>
                        <div className="text-xl font-bold text-sky-950">
                          1 250 PLN
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-sky-200">
                        <div className="text-sm text-sky-700">
                          Możliwy zakres
                        </div>
                        <div className="text-sm font-medium text-sky-800">
                          1 100 - 1 400 PLN
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-xs text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>98% pewność wyliczenia</span>
                        </div>
                        <button className="text-xs font-medium text-sky-700 hover:text-sky-800 flex items-center">
                          Szczegóły analizy
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex justify-between">
                      <button className="px-4 py-2 text-sm font-medium text-sky-700 hover:text-sky-900 border border-sky-200 rounded-md hover:bg-sky-50 transition-colors">
                        Wstecz
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-sky-950 hover:bg-sky-800 rounded-md transition-colors flex items-center">
                        Dalej
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI suggestion notification */}
                <div className="absolute -right-6 top-24 max-w-[250px] bg-white p-3 rounded-lg shadow-lg border border-sky-100 z-10">
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 rounded-full bg-sky-100">
                      <Sparkles className="h-4 w-4 text-sky-700" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-sky-950">
                        Uwzględniliśmy 3 nowe orzeczenia Sądu Najwyższego
                        dotyczące kosztów edukacji
                      </p>
                      <p className="text-xs text-sky-600 mt-1">przed chwilą</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {SITE_DATA.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white shadow-sm rounded-lg py-4 px-4 text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-2xl sm:text-3xl font-bold text-sky-700">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-sky-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features section */}
      <section
        id="funkcje"
        ref={featuresRef}
        className="bg-white py-16 sm:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate={areFeaturesInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
              Funkcje
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-950">
              Wszystkie narzędzia dla spraw alimentacyjnych w jednym miejscu
            </h2>
            <p className="mt-4 text-lg text-sky-700">
              AliMatrix to zaawansowane narzędzie dla rodziców i prawników,
              które rewolucjonizuje sposób ustalania alimentów dzięki sztucznej
              inteligencji i analizie danych.
            </p>
          </motion.div>

          {/* Features grid */}
          <motion.div
            className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            animate={areFeaturesInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-sky-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Feature icon */}
                <div className="inline-flex items-center justify-center p-3 bg-sky-100 rounded-lg text-sky-700 mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>

                {/* Stats badge */}
                <div className="mb-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                  <span className="font-bold mr-1">{feature.stats.value}</span>
                  <span>{feature.stats.label}</span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-sky-950 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sky-700 mb-4">{feature.description}</p>

                {/* Learn more link */}
                <a
                  href={`#feature-${index}`}
                  className="inline-flex items-center text-sm font-medium text-sky-700 hover:text-sky-800"
                >
                  <span>Dowiedz się więcej</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works section */}
      <section
        id="jak-to-dziala"
        ref={howItWorksRef}
        className="bg-sky-50 py-16 sm:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate={isHowItWorksInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Jak to działa
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-950">
              Trzy proste kroki do sprawiedliwych alimentów
            </h2>
            <p className="mt-4 text-lg text-sky-700">
              Nasz proces jest zaprojektowany tak, aby przeprowadzić Cię przez
              cały proces szybko, łatwo i z maksymalną precyzją.
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div
            className="mt-16 grid gap-8 md:grid-cols-3"
            initial="hidden"
            animate={isHowItWorksInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            {HOW_IT_WORKS.map((step, index) => (
              <div key={index} className="relative">
                {/* Step connector */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[calc(50%+2rem)] right-0 h-0.5 bg-sky-200">
                    <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="8" cy="8" r="8" fill="#BAE6FD" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-sky-950 text-white text-xl font-bold shadow-md mb-4">
                    {step.icon}
                  </div>

                  {/* Step content */}
                  <h3 className="text-xl font-semibold text-sky-950 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sky-700">{step.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials section */}
      <section
        id="opinie"
        ref={testimonialsRef}
        className="bg-white py-16 sm:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate={areTestimonialsInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
              Opinie
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-950">
              Tysiące zadowolonych klientów i prawników
            </h2>
            <p className="mt-4 text-lg text-sky-700">
              Sprawdź, co mówią o nas osoby, które skorzystały z AliMatrix przy
              swoich sprawach alimentacyjnych.
            </p>
          </motion.div>

          {/* Testimonials slider */}
          <div className="mt-16 max-w-3xl mx-auto">
            {TESTIMONIALS.map(
              (testimonial, index) =>
                index === activeTestimonial && (
                  <motion.div
                    key={index}
                    className="bg-sky-50 p-6 md:p-8 rounded-xl shadow-sm relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Quote icon */}
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shadow-md">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 11L8 13H5C4.44772 13 4 12.5523 4 12V7C4 6.44772 4.44772 6 5 6H9C9.55228 6 10 6.44772 10 7V11Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19 11L17 13H14C13.4477 13 13 12.5523 13 12V7C13 6.44772 13.4477 6 14 6H18C18.5523 6 19 6.44772 19 7V11Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <p className="text-lg md:text-xl text-sky-800 italic relative z-10">
                      "{testimonial.content}"
                    </p>

                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
                          src={testimonial.avatar}
                          alt={testimonial.author}
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-semibold text-sky-950">
                          {testimonial.author}
                        </h4>
                        <p className="text-sm text-sky-600">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
            )}

            {/* Indicator dots */}
            <div className="mt-6 flex justify-center space-x-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? "bg-sky-700 scale-110"
                      : "bg-sky-300 hover:bg-sky-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog section - new section */}
      <section id="blog" ref={blogRef} className="bg-sky-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate={isBlogInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
              Blog
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-950">
              Aktualności i informacje ze świata alimentów
            </h2>
            <p className="mt-4 text-lg text-sky-700">
              Najnowsze artykuły, analizy i porady dotyczące spraw
              alimentacyjnych przygotowane przez ekspertów.
            </p>
          </motion.div>

          {/* Blog posts grid */}
          <motion.div
            className="mt-16 grid gap-8 md:grid-cols-3"
            initial="hidden"
            animate={isBlogInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            {BLOG_POSTS.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Post image placeholder */}
                <div className="h-48 bg-sky-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-sky-700">
                    <FileText className="h-12 w-12" />
                  </div>
                </div>

                <div className="p-6">
                  {/* Category and date */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium px-2.5 py-0.5 bg-sky-100 text-sky-800 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center text-sky-600 text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.date}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-sky-950 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sky-700 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-sky-100">
                    <div className="text-xs text-sky-600">{post.author}</div>
                    <div className="text-xs text-sky-600">
                      {post.readTime} czytania
                    </div>
                  </div>

                  {/* Read more link */}
                  <a
                    href={`/blog/${index}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-sky-700 hover:text-sky-900"
                  >
                    Czytaj więcej
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </motion.div>

          {/* See all posts button */}
          <div className="mt-12 text-center">
            <a
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-sky-300 rounded-lg text-sm font-medium text-sky-700 bg-white hover:bg-sky-50 transition-all duration-300"
            >
              Zobacz wszystkie artykuły
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section ref={ctaRef} className="relative bg-sky-950 py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 800 800">
            <defs>
              <pattern
                id="wave"
                patternUnits="userSpaceOnUse"
                width="100"
                height="100"
                patternTransform="scale(8 8)"
              >
                <path
                  d="M.5 25C20 25 20 75 39.5 75S60 25 79.5 25 100 75 100 75"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                ></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave)"></rect>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate={isCtaInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Rozpocznij kalkulację alimentów już dziś
            </h2>
            <p className="mt-4 text-lg text-sky-200">
              Dołącz do tysięcy zadowolonych rodziców i prawników, którzy
              korzystają z AliMatrix, aby uzyskać sprawiedliwe alimenty.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/rozpocznij"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-sky-950 bg-white hover:bg-sky-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Rozpocznij kalkulację
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </a>
              <a
                href="/kontakt"
                className="inline-flex justify-center items-center px-6 py-3 border border-sky-400 text-base font-medium rounded-lg text-white hover:bg-sky-900 transition-all duration-300"
              >
                Porozmawiaj z ekspertem
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-sky-800 py-12 border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sky-950 text-lg font-semibold mb-4">
                AliMatrix
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    O nas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    Zespół
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    Kariera
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sky-950 text-lg font-semibold mb-4">
                Funkcje
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    Kalkulator alimentów
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    Generator dokumentów
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    Konsultacje prawne
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    Analiza orzeczeń
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sky-950 text-lg font-semibold mb-4">
                Wsparcie
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    Centrum pomocy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    Kontakt
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-950 transition-colors">
                    Baza wiedzy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sky-950 text-lg font-semibold mb-4">
                Kontakt
              </h3>
              <ul className="space-y-2 text-sm">
                <li>kontakt@alimatrix.pl</li>
                <li>+48 123 456 789</li>
                <li>ul. Przykładowa 123</li>
                <li>00-001 Warszawa</li>
              </ul>
              <div className="mt-4 flex space-x-4">
                {/* Social icons */}
                <a
                  href="#"
                  className="text-sky-700 hover:text-sky-950 transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-sky-700 hover:text-sky-950 transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-sky-700 hover:text-sky-950 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-sky-100 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} AliMatrix. Wszelkie prawa
              zastrzeżone.
            </p>
            <div className="mt-4 sm:mt-0 flex space-x-6">
              <a
                href="#"
                className="text-sm hover:text-sky-950 transition-colors"
              >
                Polityka prywatności
              </a>
              <a
                href="#"
                className="text-sm hover:text-sky-950 transition-colors"
              >
                Regulamin
              </a>
              <a
                href="#"
                className="text-sm hover:text-sky-950 transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating chat button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="#chat"
          className="flex items-center space-x-2 bg-white rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-100"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="font-medium text-sm text-sky-950">
            Chat z ekspertem
          </span>
        </a>
      </div>

      {/* Back to top button */}
      <div className="fixed bottom-6 left-6 z-40">
        <a
          href="#top"
          className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-100 text-sky-700 hover:text-sky-950"
        >
          <ArrowUp className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
