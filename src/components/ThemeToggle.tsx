import { useEffect } from "react";

export function useTheme() {
  useEffect(() => {
    localStorage.setItem("mesac-theme", "dark");
    const root = document.documentElement;
    root.classList.add("dark");
    root.classList.remove("light");
  }, []);

  return {
    theme: "dark" as const,
    toggleTheme: () => {},
    isDark: true,
  };
}

export function ThemeToggle() {
  return null;
}
