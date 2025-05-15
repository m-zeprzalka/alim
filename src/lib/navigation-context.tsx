"use client";

import { createContext, useContext, useEffect } from "react";

interface NavigationContextType {
  scrollToTop: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  scrollToTop: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <NavigationContext.Provider value={{ scrollToTop }}>
      {children}
    </NavigationContext.Provider>
  );
}
