"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/context/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md"
      aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
