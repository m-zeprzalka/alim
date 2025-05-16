"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";
import { CircleEllipsis } from "lucide-react";
interface InfoTooltipProps {
  content: React.ReactNode;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipContentRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Wykrywanie urządzeń dotykowych
  useEffect(() => {
    const detectTouch = () => {
      setIsTouchDevice(true);
      // Usunięcie listenera po wykryciu
      window.removeEventListener("touchstart", detectTouch);
    };
    window.addEventListener("touchstart", detectTouch, { once: true });

    return () => {
      window.removeEventListener("touchstart", detectTouch);
    };
  }, []);

  // Obsługa kliknięcia/dotyku poza tooltipem, żeby go zamknąć
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Sprawdzamy, czy kliknięcie/dotyk było poza przyciskiem i poza zawartością tooltipa
      const target = event.target as Node;

      if (
        open &&
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        tooltipContentRef.current &&
        !tooltipContentRef.current.contains(target)
      ) {
        // Kliknięto poza przyciskiem i tooltipem
        setOpen(false);
      }
    };

    // Dodajemy event listenery odpowiednie dla różnych typów urządzeń
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchend", handleClickOutside);

    return () => {
      // Czyszczenie po odmontowaniu
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [open]);
  // Funkcja do przełączania stanu tooltipa
  const handleToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Zapobieganie domyślnej akcji przeglądarki
    e.stopPropagation(); // Zapobieganie propagacji zdarzenia
    setOpen(!open);
  };

  return (
    <TooltipProvider>
      <Tooltip
        open={open}
        onOpenChange={(isOpen) => {
          // Na urządzeniach dotykowych, ignorujemy automatyczne zamykanie
          // Na urządzeniach niedotykowych, pozwalamy na zamykanie przez najechanie myszą
          if (isTouchDevice && isOpen === false) return;
          setOpen(isOpen);
        }}
        delayDuration={0} // Zerowe opóźnienie dla natychmiastowego otwierania/zamykania
      >
        <TooltipTrigger asChild>
          <button
            type="button"
            ref={buttonRef}
            onClick={handleToggle}
            onTouchEnd={(e) => {
              // Specjalna obsługa dotykowa
              e.preventDefault();
              handleToggle(e);
            }}
            className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold text-white bg-sky-950 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Więcej informacji"
            aria-expanded={open}
          >
            <CircleEllipsis />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="center"
          ref={tooltipContentRef}
          className="max-w-[calc(100vw-32px)] sm:max-w-sm p-4 bg-slate-900 text-white text-[13px] leading-5 shadow-lg z-50"
          sideOffset={5}
          onClick={(e) => {
            // Zapobieganie zamykaniu tooltipa przy kliknięciu w jego zawartość
            e.stopPropagation();
          }}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
