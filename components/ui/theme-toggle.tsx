"use client";
/**
 * Theme plumbing shared by the dock.
 *
 * The current theme lives on <html data-theme> (set pre-paint by the inline
 * script in app/layout.tsx), so nothing here needs React state. That also
 * means the icons never flash the wrong way round on hydration; the swap is
 * done in CSS via .theme-icon-to-dark / .theme-icon-to-light.
 */

import { Moon, Sun } from "lucide-react";

export const toggleTheme = () => {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    // storage blocked (private mode, etc.): the toggle still works this session
  }
};

export const ThemeIcon = () => (
  <>
    <Moon className="theme-icon-to-dark" />
    <Sun className="theme-icon-to-light" />
  </>
);
