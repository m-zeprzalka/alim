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
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 overflow-hidden bg-white py-20"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-16 lg:flex-row">
            <div className="max-w-xl text-center lg:text-left">
              <Logo className="mb-4" />
              <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
                {SITE_DATA.headline}
              </h1>
              <p className="mt-4 text-lg text-gray-700">
                {SITE_DATA.description}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#"
                  className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700"
                >
                  {SITE_DATA.ctaPrimary}
                </a>
                <a
                  href="#"
                  className="inline-block rounded-lg border border-blue-600 px-6 py-3 text-base font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                >
                  {SITE_DATA.ctaSecondary}
                </a>
              </div>
            </div>
            <div className="relative w-full max-w-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 -z-10 transform-gpu overflow-hidden rounded-lg"
              >
                <svg
                  viewBox="0 0 600 600"
                  className="absolute -top-24 -right-24 -z-10 h-[500px] max-w-none rotate-[30deg]"
                >
                  <defs>
                    <linearGradient
                      id="gradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" style={{ stopColor: "#3b82f6" }} />
                      <stop offset="100%" style={{ stopColor: "#9333ea" }} />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#gradient1)"
                    d="M0,300 C150,100 450,500 600,300 L600,600 L0,600 Z"
                  />
                </svg>
              </motion.div>
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src="/hero-image.jpg"
                  alt="Hero Image"
                  className="w-full h-auto object-cover rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Trust Badges */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {SITE_DATA.trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {SITE_DATA.stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 text-center shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm font-medium text-gray-700">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              Dlaczego warto wybrać AliMatrix?
            </h2>
            <p className="mt-4 max-w-xl text-lg text-gray-700 sm:mx-auto">
              Nasze innowacyjne podejście do obliczeń alimentacyjnych opiera się
              na zaawansowanej analizie danych i sztucznej inteligencji.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-4 text-base text-gray-700">
                  {feature.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {feature.stats.value}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {feature.stats.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              Jak to działa?
            </h2>
            <p className="mt-4 max-w-xl text-lg text-gray-700 sm:mx-auto">
              Nasz proces jest prosty i intuicyjny. Zobacz, jak szybko możesz
              uzyskać dokładne wyliczenia alimentów.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {HOW_IT_WORKS.map((step, index) => (
              <div
                key={index}
                className="flex flex-col rounded-lg bg-gray-50 p-6 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                  <span className="text-xl font-bold">{step.icon}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-base text-gray-700">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              Co mówią nasi klienci?
            </h2>
            <p className="mt-4 max-w-xl text-lg text-gray-700 sm:mx-auto">
              Zobacz, jak AliMatrix pomógł innym w uzyskaniu sprawiedliwych
              alimentów.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
                <p className="mt-4 text-base text-gray-700">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              Najnowsze artykuły na blogu
            </h2>
            <p className="mt-4 max-w-xl text-lg text-gray-700 sm:mx-auto">
              Bądź na bieżąco z najnowszymi informacjami i poradami prawnymi.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post, index) => (
              <div
                key={index}
                className="flex flex-col rounded-lg bg-gray-50 p-6 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-700">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {post.date} • {post.readTime}
                    </span>
                    <a
                      href="#"
                      className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-blue-700"
                    >
                      Czytaj więcej
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex-1">
              <Logo className="text-white" />
              <p className="mt-4 text-sm text-gray-300">
                &copy; {new Date().getFullYear()} AliMatrix. Wszelkie prawa
                zastrzeżone.
              </p>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-300">
                Szybkie linki
              </h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    O nas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    Usługi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    Cennik
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    Kontakt
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-300">
                Skontaktuj się z nami
              </h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="mailto:kontakt@alimatrix.pl"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    kontakt@alimatrix.pl
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+48123456789"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    +48 123 456 789
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      Pon-Pt, 9:00-17:00
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
