import { useState, useEffect } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <button
      type="button"
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={className}
      aria-label={isDarkMode ? "Switch to day" : "Switch to night"}
    >
      Day / Night
    </button>
  );
}
