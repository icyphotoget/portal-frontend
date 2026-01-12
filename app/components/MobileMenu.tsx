"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import type { Category } from "@/app/components/TopNav";
import MenuAuthHeader from "@/app/components/MenuAuthHeader";

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

export default function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);

  const close = () => {
    setOpen(false);
    setExpanded(null);
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
              {/* ✅ dynamic auth */}
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

            {/* Search (UI only for now) */}
            <div className="px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                />
                <svg
                  className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0z" />
                </svg>
              </div>
            </div>

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
                  {/* ✅ dynamic auth */}
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

                {/* Search (UI only for now) */}
                <div className="px-4 pb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 pr-10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                    />
                    <svg
                      className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
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
