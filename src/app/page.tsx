"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import GitCheatsheet from "@/components/GitCheatsheet";

const CATEGORY_LINKS = [
"Basics",
"Branching",
"Remote",
"Stash",
"History & Inspect",
"Undo & Fix",
"Advanced"];


export default function Page() {
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = saved ? saved === "dark" : prefersDark;
    setDark(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);

  // Apply theme when toggled
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Keyboard shortcut: press / to focus search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredQuery = useMemo(() => query.replace(/\s+/g, " ").trimStart(), [query]);

  return (
    <div className="min-h-[100svh] bg-[var(--color-background)] text-[var(--color-foreground)]">
      <header className="sticky top-0 z-10 border-b backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--color-background)_80%,transparent)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Git Commands Cheatsheet</h1>
              <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)]">Fast, searchable, dark terminal style</p>
            </div>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="group inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-[color-mix(in_oklab,var(--color-muted)_20%,transparent)]"
            aria-label="Toggle theme">

            <span className="inline-flex h-4 w-4 items-center justify-center" aria-hidden>
              {dark ? "☀" : "🌙"}
            </span>
            <span className="hidden sm:inline">{dark ? "Light" : "Dark"} mode</span>
          </button>
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-4">
          <div className="relative">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search (/, cmd, desc, or category)"
              className="w-full rounded-lg border bg-[color-mix(in_oklab,var(--color-muted)_12%,transparent)] px-3 py-2 pl-9 font-mono text-sm outline-none focus:ring-2 focus:ring-[color:var(--color-ring)]" />

            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 select-none text-[var(--color-muted-foreground)]">⌕</span>
          </div>
          <nav className="mt-3 flex flex-wrap gap-2">
            {CATEGORY_LINKS.map((name) => {
              const id = name.replace(/\s+/g, "-").toLowerCase();
              return (
                <a
                  key={name}
                  href={`#${id}`}
                  className="rounded-full border px-3 py-1.5 text-xs sm:text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[color-mix(in_oklab,var(--color-muted)_20%,transparent)]">

                  {name}
                </a>);

            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <GitCheatsheet query={filteredQuery} />
      </main>

      <footer className="mx-auto max-w-6xl px-4 sm:px-6 pb-10 text-center text-xs text-[var(--color-muted-foreground)]">
        Tip: Press / to focus search. Built with Next.js 15.
      </footer>
    </div>);

}