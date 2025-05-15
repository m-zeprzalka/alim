"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Przewijanie do góry strony przy każdej zmianie ścieżki
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null; // Ten komponent nie renderuje żadnego UI
}
