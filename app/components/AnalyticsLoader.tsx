"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

const COOKIE_NAME = "fp_consent";

function readConsent(): any | null {
  const m = document.cookie.match(new RegExp("(^| )" + COOKIE_NAME + "=([^;]+)"));
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(m[2]));
  } catch {
    return null;
  }
}

export default function AnalyticsLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const c = readConsent();
    setEnabled(!!c?.analytics);

    const onChange = (e: any) => setEnabled(!!e?.detail?.analytics);
    window.addEventListener("fp:consentChanged", onChange as any);
    return () => window.removeEventListener("fp:consentChanged", onChange as any);
  }, []);

  if (!enabled) return null;
  return <Analytics />;
}
