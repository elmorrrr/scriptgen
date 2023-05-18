"use client";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useEffect } from "react";

export default function Theme() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    document.documentElement.setAttribute(
      "data-theme",
      resolvedTheme === "dark" ? "light" : "dark"
    );
  };

  return (
    <button
      aria-label="Toggle Theme"
      type="button"
      className=""
      onClick={toggleTheme}
    >
      {resolvedTheme === "dark" ? (
        <SunIcon className="h-5 w-5 text-orange-300" />
      ) : (
        <MoonIcon className="h-5 w-5 text-slate-800" />
      )}
    </button>
  );
}
