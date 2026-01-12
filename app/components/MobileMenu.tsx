"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import type { Category } from "@/app/components/TopNav";
import MenuAuthHeader from "@/app/components/MenuAuthHeader";

type SearchResult = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
  category: string | null;
};

function Plus({ open }: { open: boolean }) {
  return (
    <span
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-full",
        "border border-white/10 bg-zinc-900/60",
        "transition-transform",
        open ? "rotate-45" : "",
      ].join(" ")}
      aria-hidden="true"
    >
      <svg className="h-5 w-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
      </svg>
    </span>
  );
}

/**
 * ✅ IMPORTANT:
 * SearchBlock mora biti TOP-LEVEL komponenta (izvan MobileMenu),
 * inače React remounta input na svaki rerender i gubi fokus nakon svakog slova.
 */
function SearchBlock({
  variant,
  q,
  setQ,
  searchOpen,
  setSearchOpen,
  loading,
  results,
  runSearch,
  resetSearch,
  onPick,
}: {
  variant: "desktop" | "mobile";
  q: string;
  setQ: (v: string) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  loading: boolean;
  results: SearchResult[];
  runSearch: (q: string) => void;
  resetSearch: () => void;
  onPick: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const inputClass =
    variant === "desktop"
      ? "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      : "w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 pr-12 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-400/40";

  return (
    <div className={variant === "desktop" ? "px-4 py-3" : "px-4 pb-4"}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchOpen(true);
              runSearch(q);
            }
            if (e.key === "Escape") setSearchOpen(false);
          }}
          placeholder="Search"
          className={inputClass}
        />

        <button
          type="button"
          onClick={() => {
            setSearchOpen(true);
            runSearch(q);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white/70 hover:text-white hover:bg-white/10 transition"
          aria-label="Search"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {searchOpen && q.trim() && (
          <div
            className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur"
            // ✅ ne daj dropdownu da ukrade fokus (klik / mousedown)
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="flex items-center justify-between px-3 py-2 text-xs text-white/55">
              <span>{loading ? "Searching..." : results.length ? "Results" : "No results"}</span>
              <button
                type="button"
                onClick={() => {
                  resetSearch();
                  requestAnimationFrame(() => inputRef.current?.focus());
                }}
                className="text-white/55 hover:text-white transition"
              >
                Clear
              </button>
            </div>

            <div className="max-h-72 overflow-auto">
              {results.map((r) => (
                <Link
                  key={r.id}
                  href={`/news/${r.slug}`}
                  onClick={() => {
                    resetSearch();
                    onPick();
                  }}
                  className="block px-3 py-3 hover:bg-white/5"
                >
                  <div className="text-sm font-semibold text-white/90 line-clamp-1">{r.title}</div>
                  <div className="mt-1 text-xs text-white/55 line-clamp-2">{r.excerpt || r.category || ""}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // --- SEARCH state ---
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);

  function resetSearch() {
    setQ("");
    setResults([]);
    setSearchOpen(false);
    setLoading(false);
    abortRef.current?.abort();
  }

  const close = () => {
    setOpen(false);
    setExpanded(null);
    resetSearch();
  };

  const toggleSection = (key: string) => {
    setExpanded((p) => (p === key ? null : key));
  };

  // ✅ Keep only valid categories (no empty names/slugs, no duplicates)
  const cleanCategories = useMemo(() => {
    const seen = new Set<string>();
    return (categories ?? [])
      .filter((c) => {
        const name = (c?.name ?? "").trim();
        const slug = (c?.slug ?? "").trim();
        if (!name || !slug) return false;
        if (seen.has(slug)) return false;
        seen.add(slug);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  async function runSearch(query: string) {
    const term = query.trim();
    if (!term) {
      setResults([]);
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ac.signal });
      const json = await res.json();

      if (!res.ok) {
        console.error("Search API error:", json);
        setResults([]);
        return;
      }

      setResults(json?.results ?? []);
    } catch (e: any) {
      if (e?.name !== "AbortError") setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // debounce (da ne spama API dok tipkaš)
  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => {
      if (q.trim()) runSearch(q);
      else setResults([]);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, searchOpen]);

  // Close on ESC + click outside
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const onMouseDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Lock scroll only on mobile overlay
  useEffect(() => {
    if (!open) return;

    const isDesktop = window.matchMedia("(min-width: 768px)").matches; // md
    if (isDesktop) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-2 hover:bg-zinc-900 transition"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* =========================
          DESKTOP POPOVER (md+)
         ========================= */}
      {open && (
        <div className="hidden md:block">
          <div className="absolute right-0 top-[calc(100%+12px)] w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
            {/* small arrow */}
            <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 border-l border-t border-white/10 bg-zinc-950" />

            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <MenuAuthHeader onClose={close} />

              <button
                onClick={close}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/85 hover:bg-white/10 transition"
              >
                Close
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <SearchBlock
              variant="desktop"
              q={q}
              setQ={setQ}
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              loading={loading}
              results={results}
              runSearch={runSearch}
              resetSearch={resetSearch}
              onPick={close}
            />

            {/* Items */}
            <div className="max-h-[60vh] overflow-y-auto px-4 pb-4">
              <div className="space-y-3">
                {cleanCategories.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/70">
                    No categories yet.
                  </div>
                ) : (
                  cleanCategories.map((c) => {
                    const isExpanded = expanded === c.slug;
                    return (
                      <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5">
                        <button
                          onClick={() => toggleSection(c.slug)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left"
                        >
                          <span className="text-base font-extrabold text-white">{c.name}</span>
                          <Plus open={isExpanded} />
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-3">
                            <div className="space-y-2">
                              <Link
                                href={`/category/${c.slug}`}
                                onClick={close}
                                className="block rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white transition"
                              >
                                View all
                              </Link>
                              <Link
                                href={`/category/${c.slug}?tab=trending`}
                                onClick={close}
                                className="block rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white transition"
                              >
                                Trending
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          MOBILE OVERLAY (<md)
         ========================= */}
      {open && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-[9999]">
            <button
              aria-label="Close menu"
              onClick={close}
              className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            />

            <div className="relative h-full w-full bg-zinc-950 text-white">
              {/* Header */}
              <div className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/95 backdrop-blur">
                <div className="flex items-center justify-between px-4 py-4">
                  <MenuAuthHeader onClose={close} />

                  <button
                    onClick={close}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white/90 hover:bg-zinc-800 transition"
                  >
                    Close
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Search */}
                <SearchBlock
                  variant="mobile"
                  q={q}
                  setQ={setQ}
                  searchOpen={searchOpen}
                  setSearchOpen={setSearchOpen}
                  loading={loading}
                  results={results}
                  runSearch={runSearch}
                  resetSearch={resetSearch}
                  onPick={close}
                />
              </div>

              {/* Items */}
              <div className="h-[calc(100vh-132px)] overflow-y-auto bg-zinc-950 px-4 pb-10">
                <nav className="space-y-3 pt-3">
                  {cleanCategories.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-4 py-4 text-sm text-white/70">
                      No categories yet.
                    </div>
                  ) : (
                    cleanCategories.map((c) => {
                      const isExpanded = expanded === c.slug;
                      return (
                        <div key={c.id} className="rounded-2xl border border-white/10 bg-zinc-900/60">
                          <button
                            onClick={() => toggleSection(c.slug)}
                            className="flex w-full items-center justify-between px-4 py-4 text-left"
                          >
                            <span className="text-[20px] font-extrabold tracking-tight text-white">{c.name}</span>
                            <Plus open={isExpanded} />
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4">
                              <div className="space-y-2">
                                <Link
                                  href={`/category/${c.slug}`}
                                  onClick={close}
                                  className="block rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm font-semibold text-white/85 hover:bg-zinc-900 hover:text-white transition"
                                >
                                  View all
                                </Link>
                                <Link
                                  href={`/category/${c.slug}?tab=trending`}
                                  onClick={close}
                                  className="block rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm font-semibold text-white/85 hover:bg-zinc-900 hover:text-white transition"
                                >
                                  Trending
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
