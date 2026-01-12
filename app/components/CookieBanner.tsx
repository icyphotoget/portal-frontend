"use client";

import { useEffect, useState } from "react";

type Consent = {
  v: 1;
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

const COOKIE_NAME = "fp_consent";
const MAX_AGE_DAYS = 180;

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function writeCookie(name: string, value: string, days: number) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function parseConsent(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (obj?.v !== 1) return null;
    if (obj?.necessary !== true) return null;
    return obj as Consent;
  } catch {
    return null;
  }
}

function defaultConsent(): Consent {
  return {
    v: 1,
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
    ts: Date.now(),
  };
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [consent, setConsent] = useState<Consent>(defaultConsent());

  useEffect(() => {
    const stored = parseConsent(readCookie(COOKIE_NAME));
    if (!stored) {
      setConsent(defaultConsent());
      setOpen(true);
    } else {
      setConsent(stored);
      setOpen(false);
    }

    const handler = () => {
      setManage(true);
      setOpen(true);
    };
    window.addEventListener("fp:openPrivacySettings", handler as any);
    return () => window.removeEventListener("fp:openPrivacySettings", handler as any);
  }, []);

  function save(next: Consent) {
    const payload: Consent = { ...next, ts: Date.now() };
    writeCookie(COOKIE_NAME, JSON.stringify(payload), MAX_AGE_DAYS);
    setConsent(payload);
    setOpen(false);
    setManage(false);

    window.dispatchEvent(new CustomEvent("fp:consentChanged", { detail: payload }));
  }

  function acceptAll() {
    save({
      v: 1,
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: false, // ✅ you don’t use marketing, keep it false by default
      ts: Date.now(),
    });
  }

  function rejectAll() {
    save({
      v: 1,
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
      ts: Date.now(),
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4">
      <div className="mx-auto max-w-[960px] rounded-2xl border border-zinc-800 bg-black/90 backdrop-blur-xl p-4 sm:p-5 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-extrabold uppercase tracking-wide text-white">
              Cookies & Privacy
            </div>
            <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
              We use cookies to keep FullPort running and (with your permission) to measure traffic with Vercel Analytics.
              You can change your choices anytime in{" "}
              <button
                onClick={() => {
                  setManage(true);
                  setOpen(true);
                }}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                type="button"
              >
                Privacy Settings
              </button>
              .
            </p>

            <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-400">
              <a className="hover:text-white underline underline-offset-4" href="/cookie-policy">
                Cookie Policy
              </a>
              <a className="hover:text-white underline underline-offset-4" href="/privacy-notice">
                Privacy Notice
              </a>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              onClick={rejectAll}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-zinc-900 transition"
              type="button"
            >
              Reject all
            </button>
            <button
              onClick={() => {
                setManage(true);
                setOpen(true);
              }}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-zinc-900 transition"
              type="button"
            >
              Customize
            </button>
            <button
              onClick={acceptAll}
              className="rounded-xl bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-black hover:bg-zinc-200 transition"
              type="button"
            >
              Accept all
            </button>
          </div>
        </div>

        {manage ? (
          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="text-sm font-extrabold text-white">Manage settings</div>

            <div className="mt-3 space-y-3 text-sm">
              <SettingRow
                title="Necessary"
                desc="Required for core functionality (cannot be disabled)."
                checked
                disabled
                onChange={() => {}}
              />

              <SettingRow
                title="Preferences"
                desc="Remember choices like UI settings."
                checked={consent.preferences}
                onChange={(v) => setConsent((c) => ({ ...c, preferences: v }))}
              />

              <SettingRow
                title="Analytics"
                desc="Allows Vercel Analytics to measure traffic and improve the site."
                checked={consent.analytics}
                onChange={(v) => setConsent((c) => ({ ...c, analytics: v }))}
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => save(consent)}
                  className="rounded-xl bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-black hover:bg-zinc-200 transition"
                  type="button"
                >
                  Save choices
                </button>
                <button
                  onClick={() => {
                    setManage(false);
                    setOpen(false);
                  }}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-zinc-900 transition"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SettingRow({
  title,
  desc,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="font-bold text-white">{title}</div>
        <div className="text-zinc-400 text-xs leading-relaxed">{desc}</div>
      </div>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 accent-cyan-400"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
      </label>
    </div>
  );
}
