"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ScaleIcon,
  DocumentTextIcon,
  CursorArrowRaysIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

// Główne dane strony
const HERO_DATA = {
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
    { value: "1200+", label: "kancelarii prawnych" },
    { value: "15 min", label: "średni czas kalkulacji" },
  ],
};

const FEATURES = [
  {
    title: "Precyzyjne obliczenia alimentacyjne",
    description:
      "Algorytmy oparte na modelach ML analizują okoliczności sprawy i dostosowują kwotę do indywidualnej sytuacji.",
    icon: ScaleIcon,
    color: "from-blue-500 to-indigo-600",
    shadow: "blue",
    stats: { value: "98%", label: "dokładność" },
  },
  {
    title: "Automatyczna dokumentacja",
    description:
      "Generuj gotowe do złożenia w sądzie wnioski i załączniki z profesjonalnym uzasadnieniem.",
    icon: DocumentTextIcon,
    color: "from-violet-500 to-purple-600",
    shadow: "purple",
    stats: { value: "30+", label: "szablonów" },
  },
  {
    title: "Kompleksowa analiza sytuacji",
    description:
      "Uwzględniamy wszystkie aspekty - stan majątkowy, model opieki, specjalne potrzeby dzieci i wiele innych.",
    icon: ChartBarIcon,
    color: "from-emerald-500 to-teal-600",
    shadow: "emerald",
    stats: { value: "100+", label: "czynników" },
  },
  {
    title: "Gwarancja bezpieczeństwa",
    description:
      "Wszystkie dane są szyfrowane, a nasz system jest w pełni zgodny z wymogami RODO i najwyższymi standardami bezpieczeństwa.",
    icon: ShieldCheckIcon,
    color: "from-rose-500 to-red-600",
    shadow: "rose",
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

export default function HeroPage() {
  const prefersReducedMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs dla sekcji
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);
  // Parallax efekty - łagodniejsze zanikanie
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.5]);

  // Sprawdzanie czy element jest w widoku
  const isHeroInView = useInView(heroRef, { once: false, amount: 0.3 });
  const areFeaturesInView = useInView(featuresRef, {
    once: false,
    amount: 0.2,
  });
  const areTestimonialsInView = useInView(testimonialsRef, {
    once: false,
    amount: 0.3,
  });
  const isHowItWorksInView = useInView(howItWorksRef, {
    once: false,
    amount: 0.3,
  });
  const isCtaInView = useInView(ctaRef, { once: false, amount: 0.5 });

  // Automatyczne przełączanie testimoniali
  useEffect(() => {
    if (!areTestimonialsInView) return;

    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [areTestimonialsInView]);

  // Wykrywanie przewinięcia dla nawigacji
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

  // Warianty animacji
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 100 },
    },
  };

  const staggerItems = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-50 to-transparent" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] right-[20%] w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
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
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center rounded-xl text-white font-bold text-xl shadow-md">
                  A
                </div>
                <span
                  className={`font-bold text-xl transition-colors duration-300 ${
                    isScrolled ? "text-gray-900" : "text-gray-800"
                  }`}
                >
                  AliMatrix
                </span>
              </div>
            </div>
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#funkcje"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Funkcje
              </a>
              <a
                href="#jak-to-dziala"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Jak to działa
              </a>
              <a
                href="#opinie"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Opinie
              </a>
              <a
                href="#cennik"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Cennik
              </a>
              <a
                href="/logowanie"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Logowanie
              </a>
            </nav>
            {/* CTA button */}
            <div className="hidden lg:block">
              <a
                href="/rozpocznij"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Rozpocznij kalkulację
                <ArrowRightIcon className="ml-2 -mr-0.5 h-4 w-4" />
              </a>
            </div>{" "}
            {/* Mobile hamburger button */}
            <div className="md:hidden">
              <button
                className="p-2.5 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-0 left-0 right-0 z-40 bg-white shadow-md py-5 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center rounded-xl text-white font-bold text-xl shadow-md">
                  A
                </div>
                <span className="font-bold text-xl text-gray-900">
                  AliMatrix
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              <a
                href="#funkcje"
                className="block text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Funkcje
              </a>
              <a
                href="#jak-to-dziala"
                className="block text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Jak to działa
              </a>
              <a
                href="#opinie"
                className="block text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Opinie
              </a>
              <a
                href="#cennik"
                className="block text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Cennik
              </a>
              <a
                href="/logowanie"
                className="block text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Logowanie
              </a>
            </nav>

            <div className="mt-6">
              <a
                href="/rozpocznij"
                className="block w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 shadow-md transition-all duration-300"
              >
                Rozpocznij kalkulację
              </a>
            </div>
          </div>
        )}
      </header>
      {/* Mobile navigation menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center rounded-lg text-white font-bold text-lg">
                    A
                  </div>
                  <span className="font-bold">AliMatrix</span>
                </div>
                <button
                  className="p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col space-y-4">
                <a
                  href="#funkcje"
                  className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Funkcje
                </a>
                <a
                  href="#jak-to-dziala"
                  className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jak to działa
                </a>
                <a
                  href="#opinie"
                  className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Opinie
                </a>
                <a
                  href="#cennik"
                  className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cennik
                </a>
                <a
                  href="/logowanie"
                  className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Logowanie
                </a>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <a
                    href="/rozpocznij"
                    className="flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Rozpocznij kalkulację
                    <ArrowRightIcon className="ml-2 -mr-0.5 h-4 w-4" />
                  </a>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero section */}{" "}
      <section
        ref={heroRef}
        className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden"
      >
        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
          style={{
            y: prefersReducedMotion ? 0 : heroY,
            opacity: prefersReducedMotion ? 1 : heroOpacity,
          }}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="flex flex-col lg:flex-row items-center">
            {/* Hero content */}
            <div className="w-full lg:w-1/2 lg:pr-10 mb-10 lg:mb-0">
              {/* Tagline */}
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center px-3 py-1 mb-5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium ring-1 ring-inset ring-blue-500/20">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  {HERO_DATA.tagline}
                </span>
              </motion.div>
              {/* Headline */}
              <motion.h1
                className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight"
                variants={itemVariants}
              >
                <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent inline-block mb-1">
                  {HERO_DATA.headline.split(" ").slice(0, 3).join(" ")}
                </span>
                <br />
                {HERO_DATA.headline.split(" ").slice(3).join(" ")}
              </motion.h1>{" "}
              {/* Description */}
              <motion.p
                className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl"
                variants={itemVariants}
              >
                {HERO_DATA.description}
              </motion.p>
              {/* CTA Buttons */}
              <motion.div
                className="mt-8 flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <motion.a
                  href="/rozpocznij"
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 w-full sm:w-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {HERO_DATA.ctaPrimary}
                  <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
                </motion.a>
                <motion.a
                  href="/demo"
                  className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-300 w-full sm:w-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {HERO_DATA.ctaSecondary}
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
                </motion.a>
              </motion.div>
              {/* Trust badges */}
              <motion.div
                className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3"
                variants={itemVariants}
              >
                {HERO_DATA.trustBadges.map((badge, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-500">{badge}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero image/illustration */}
            <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
              <motion.div
                className="relative max-w-lg mx-auto"
                variants={itemVariants}
              >
                {/* Main dashboard mockup */}
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                  {/* Dashboard header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-3 px-4">
                    <div className="flex items-center">
                      <div className="flex space-x-2">
                        <div className="h-3 w-3 rounded-full bg-red-400"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                        <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="w-full flex justify-center">
                        <div className="bg-white/20 rounded-md px-4 py-1 text-xs text-white">
                          <span className="mr-2">●</span>alimatrix.pl
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  {/* Dashboard content */}
                  <div className="p-3 sm:p-5">
                    {/* Progress indicator */}
                    <div className="mb-4 sm:mb-5">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-gray-900">
                          Kalkulacja alimentów
                        </div>
                        <div className="text-sm text-gray-500">7/9</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Form mockup */}
                    <div className="mb-5 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-lg font-medium text-gray-900 mb-4">
                        Koszty utrzymania dziecka
                      </div>

                      <div className="space-y-4">
                        {/* Form field 1 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Koszty mieszkaniowe
                          </label>
                          <div className="flex gap-3">
                            <div className="w-2/3 h-10 bg-white border border-gray-300 rounded-md"></div>
                            <div className="w-1/3 h-10 bg-indigo-50 border border-indigo-100 rounded-md flex items-center justify-center text-sm text-indigo-600 font-medium">
                              550 PLN
                            </div>
                          </div>
                        </div>

                        {/* Form field 2 - with animation */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Koszty wyżywienia
                          </label>
                          <div className="flex gap-3">
                            <div className="w-2/3 h-10 bg-white border border-gray-300 rounded-md"></div>
                            <div className="w-1/3 h-10 bg-indigo-50 border border-indigo-100 rounded-md flex items-center justify-center">
                              <span className="text-sm text-indigo-600 font-medium animate-pulse">
                                Obliczanie...
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Form field 3 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ubrania i obuwie
                          </label>
                          <div className="flex gap-3">
                            <div className="w-2/3 h-10 bg-white border border-gray-300 rounded-md"></div>
                            <div className="w-1/3 h-10 bg-gray-100 border border-gray-200 rounded-md"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Results preview */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex justify-between mb-3">
                        <div className="text-sm font-medium text-blue-800">
                          Aktualne wyliczenie
                        </div>
                        <div className="text-xs text-blue-500">
                          Aktualizacja na żywo
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-blue-100">
                        <div className="text-sm text-gray-600">
                          Szacowana kwota alimentów
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          1,250 PLN
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <div className="text-sm text-gray-600">
                          Możliwy zakres
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          1,100 - 1,400 PLN
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-xs text-emerald-600">
                          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                          <span>98% pewność wyliczenia</span>
                        </div>
                        <div className="text-xs text-blue-600">
                          3 czynniki specjalne
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full"></div>
                <div className="absolute -z-10 -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full"></div>
                <div className="absolute -z-10 top-1/2 -right-10 w-16 h-16 bg-emerald-100 rounded-full"></div>

                {/* Floating notification */}
                <motion.div
                  className="absolute -right-6 md:-right-10 top-1/4 max-w-[220px] bg-white p-3 rounded-lg shadow-lg border border-gray-100 z-10 cursor-pointer"
                  animate={{
                    y: [0, -8, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 5,
                      repeatType: "reverse",
                    },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open("#", "_blank")}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 rounded-full bg-green-100">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        Uwzględniliśmy 3 nowe orzeczenia Sądu Najwyższego
                      </p>
                      <p className="text-xs text-gray-500 mt-1">1 min temu</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Stats row */}
          <motion.div
            className="mt-12 sm:mt-24 grid grid-cols-2 sm:grid-cols-4 gap-y-6 sm:gap-y-8 gap-x-3 sm:gap-x-4 lg:gap-x-6 px-2 sm:px-4"
            variants={containerVariants}
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
            transition={{ delay: 0.5 }}
          >
            {HERO_DATA.stats.map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center bg-white/70 backdrop-blur-sm py-3 rounded-lg shadow-sm hover:shadow transition-all duration-300"
                variants={itemVariants}
              >
                <div className="text-2xl sm:text-4xl font-bold text-indigo-600">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-center text-gray-500 px-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Divider with curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="fill-white w-full h-[50px]"
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
          >
            <path d="M0,48 C240,15 480,0 720,0 C960,0 1200,15 1440,48 L1440,48 L0,48 Z"></path>
          </svg>
        </div>
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
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
              Funkcje
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Wszystkie narzędzia dla spraw alimentacyjnych w jednym miejscu
            </h2>
            <p className="mt-4 text-lg text-gray-600">
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
            variants={staggerItems}
          >
            {FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                className="relative bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                {/* Feature icon */}
                <div
                  className={`absolute -top-5 -left-5 p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-${feature.shadow}-500/20`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>

                {/* Stats badge */}
                <div className="absolute top-4 right-4 flex items-center">
                  <div className="flex items-center px-2 py-1 rounded-full bg-gray-50 border border-gray-200">
                    <span className="text-xs font-bold text-gray-700 mr-1">
                      {feature.stats.value}
                    </span>
                    <span className="text-xs text-gray-500">
                      {feature.stats.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-5 pt-3 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>

                {/* Learn more link */}
                <a
                  href={`#feature-${index}`}
                  className="inline-flex items-center mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <span>Dowiedz się więcej</span>
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* How it works section */}
      <section
        id="jak-to-dziala"
        ref={howItWorksRef}
        className="bg-gray-50 py-16 sm:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate={isHowItWorksInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
              Jak to działa
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Trzy proste kroki do sprawiedliwych alimentów
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Nasz proces jest zaprojektowany tak, aby przeprowadzić Cię przez
              cały proces szybko, łatwo i z maksymalną precyzją.
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div
            className="mt-16 grid gap-8 md:grid-cols-3"
            initial="hidden"
            animate={isHowItWorksInView ? "visible" : "hidden"}
            variants={staggerItems}
          >
            {HOW_IT_WORKS.map((step, index) => (
              <motion.div key={index} className="relative" variants={fadeIn}>
                {/* Step connector */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[calc(50%+2rem)] right-0 h-0.5 bg-gray-200">
                    <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="8" cy="8" r="8" fill="#E2E8F0" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-xl font-bold shadow-lg shadow-indigo-500/30 mb-4">
                    {step.icon}
                  </div>

                  {/* Step content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
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
            <span className="inline-block py-1 px-3 mb-3 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
              Opinie
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Tysiące zadowolonych klientów i prawników
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Sprawdź, co mówią o nas osoby, które skorzystały z AliMatrix przy
              swoich sprawach alimentacyjnych.
            </p>
          </motion.div>

          {/* Testimonials slider */}
          <div className="mt-16 max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {TESTIMONIALS.map(
                (testimonial, index) =>
                  index === activeTestimonial && (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 md:p-8 rounded-2xl shadow-sm relative"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                      }}
                    >
                      {/* Quote icon */}
                      <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
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

                      <p className="text-lg md:text-xl text-gray-700 italic relative z-10">
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
                          <h4 className="text-base font-semibold text-gray-900">
                            {testimonial.author}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {testimonial.title}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>

            {/* Indicator dots */}
            <div className="mt-6 flex justify-center space-x-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? "bg-indigo-600 scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* CTA section */}
      <section
        ref={ctaRef}
        className="relative bg-gradient-to-r from-indigo-600 to-blue-600 py-16 sm:py-24"
      >
        {/* Background pattern */}
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
            <p className="mt-4 text-lg text-indigo-100">
              Dołącz do tysięcy zadowolonych rodziców i prawników, którzy
              korzystają z AliMatrix, aby uzyskać sprawiedliwe alimenty.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="/rozpocznij"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Rozpocznij kalkulację
                <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
              </motion.a>
              <motion.a
                href="/kontakt"
                className="inline-flex justify-center items-center px-6 py-3 border border-indigo-300 text-base font-medium rounded-lg text-white hover:bg-indigo-700 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Porozmawiaj z ekspertem
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                AliMatrix
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    O nas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Zespół
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kariera
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Funkcje</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kalkulator alimentów
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Generator dokumentów
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Konsultacje prawne
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analiza orzeczeń
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Wsparcie
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centrum pomocy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kontakt
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Baza wiedzy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Kontakt</h3>
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
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
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
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
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

          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} AliMatrix. Wszelkie prawa
              zastrzeżone.
            </p>
            <div className="mt-4 sm:mt-0 flex space-x-6">
              <a
                href="#"
                className="text-sm hover:text-white transition-colors"
              >
                Polityka prywatności
              </a>
              <a
                href="#"
                className="text-sm hover:text-white transition-colors"
              >
                Regulamin
              </a>
              <a
                href="#"
                className="text-sm hover:text-white transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* Floating elements */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.div
          className="flex items-center space-x-2 bg-white rounded-full px-4 py-3 shadow-xl cursor-pointer border border-gray-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-sm text-gray-800">
            Chat z ekspertem
          </span>
        </motion.div>
      </div>
      {/* Custom cursor highlight effect for interactive elements */}
      <motion.div
        className="fixed hidden md:block w-5 h-5 pointer-events-none z-50 rounded-full bg-indigo-500 mix-blend-difference"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        style={{
          left: -100,
          top: -100,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Animation keyframes */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          height: -webkit-fill-available;
        }

        body {
          min-height: 100vh;
          min-height: -webkit-fill-available;
        }

        @supports (padding: max(0px)) {
          .has-safe-area {
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
          }
        }

        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 30px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 15s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Fix tailwindcss missing shadows for dynamic values */
        .shadow-blue-500\/20 {
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2),
            0 4px 6px -2px rgba(59, 130, 246, 0.1);
        }
        .shadow-purple-500\/20 {
          box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.2),
            0 4px 6px -2px rgba(139, 92, 246, 0.1);
        }
        .shadow-emerald-500\/20 {
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2),
            0 4px 6px -2px rgba(16, 185, 129, 0.1);
        }
        .shadow-rose-500\/20 {
          box-shadow: 0 10px 15px -3px rgba(244, 63, 94, 0.2),
            0 4px 6px -2px rgba(244, 63, 94, 0.1);
        }
      `}</style>
    </div>
  );
}
