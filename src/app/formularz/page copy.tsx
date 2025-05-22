"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  BarChart3,
  Users,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function StartPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    // Interval for statistics animation
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 py-4 px-4 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto max-w-6xl flex justify-center items-center">
          <div className="relative">
            <Image
              src="/logo.svg"
              alt="AliMatrix Logo"
              width={180}
              height={60}
              className="h-10 md:h-12 w-auto"
              priority
            />
            {/* Stamp overlay */}
            <div className="absolute -top-1 -right-24 rotate-12 bg-blue-400/20 backdrop-blur-sm text-xs text-blue-900 py-1 px-3 rounded">
              Serwis w fazie rozwoju
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 md:pt-40 md:pb-24">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.h1
              variants={fadeIn}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900"
            >
              Alimenty bez tajemnic
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto"
            >
              AliMatrix to inicjatywa tworzona przez rodziców, którzy dzielą się
              swoją sytuacją alimentacyjną, by wspólnie budować bardziej
              przejrzysty system w Polsce.
            </motion.p>

            <motion.div variants={fadeIn} className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/podstawa-ustalen">Wypełnij formularz</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="py-12 px-4"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8 md:space-y-12">
            {/* Intro Text */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
              <p className="text-gray-700 mb-4">
                Jesteśmy na wczesnym etapie rozwoju – zbieramy rzeczywiste dane
                o ustalonych alimentach, by już za kilka tygodni udostępnić
                rzetelne raporty i analizy.
              </p>
              <p className="text-gray-700 font-medium">
                Twoje zgłoszenie ma znaczenie – im więcej danych, tym większa
                przejrzystość i lepsze decyzje.
              </p>
            </div>

            {/* How It Works */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-8">
                Jak to działa?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1 */}
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      1. Wypełniasz formularz
                    </h3>
                    <p className="text-gray-600">
                      Jeśli masz już ustalone alimenty (sądowo, ugodowo lub na
                      podstawie porozumienia).
                    </p>
                  </CardContent>
                </Card>

                {/* Step 2 */}
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      2. Twoje dane trafiają do bazy
                    </h3>
                    <p className="text-gray-600">
                      Dane są bezpieczne i anonimowe – zgodnie z RODO i
                      zabezpieczone technologicznie.
                    </p>
                  </CardContent>
                </Card>

                {/* Step 3 */}
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      3. Analizujemy zebrane przypadki
                    </h3>
                    <p className="text-gray-600">
                      Wkrótce udostępnimy rzetelne raporty i statystyki dla
                      Ciebie i innych użytkowników.
                    </p>
                  </CardContent>
                </Card>

                {/* Step 4 */}
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      4. Pomagasz innym
                    </h3>
                    <p className="text-gray-600">
                      Twoje zgłoszenie zwiększa przejrzystość i przewidywalność
                      systemu alimentacyjnego w Polsce.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Statistics */}
            <div className="py-12">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-8">
                Statystyki na dziś
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="relative h-40 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: activeIndex === 0 ? 1 : 0,
                      y: activeIndex === 0 ? 0 : -20,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-4xl md:text-5xl font-bold text-blue-900">
                      124
                    </span>
                    <span className="text-gray-700 text-center mt-2">
                      osoby podzieliły się swoją
                      <br />
                      sytuacją alimentacyjną
                    </span>
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: activeIndex === 1 ? 1 : 0,
                      y: activeIndex === 1 ? 0 : 20,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-4xl md:text-5xl font-bold text-blue-900">
                      43
                    </span>
                    <span className="text-gray-700 text-center mt-2">
                      minuty średni czas dokładnego
                      <br />
                      wypełnienia formularza
                    </span>
                  </motion.div>
                </div>

                <div className="flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md p-6 text-white">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">Dołącz teraz</h3>
                    <Button
                      asChild
                      variant="secondary"
                      size="lg"
                      className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-6 py-5 rounded-full shadow-lg"
                    >
                      <Link href="/podstawa-ustalen">Wypełnij formularz</Link>
                    </Button>
                    <p className="text-blue-100 text-sm mt-4">
                      Twoje dane są bezpieczne i nie wymagają podawania danych
                      osobowych.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Scroll Down Indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.2, 0.8, 0.2],
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }}
      >
        <ChevronDown className="h-8 w-8 text-blue-600" />
      </motion.div>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()} AliMatrix. Wszelkie prawa zastrzeżone.
          </p>
          <div className="mt-2 space-x-4">
            <Link
              href="/polityka-prywatnosci"
              className="text-blue-600 hover:underline"
            >
              Polityka prywatności
            </Link>
            <Link href="/regulamin" className="text-blue-600 hover:underline">
              Regulamin
            </Link>
            <Link href="/kontakt" className="text-blue-600 hover:underline">
              Kontakt
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
