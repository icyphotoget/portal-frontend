// app/components/CopyEmailButton.tsx
"use client";

export default function CopyEmailButton({ email }: { email: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
        } catch {
          // ignore
        }
      }}
      className="inline-flex items-center rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-zinc-800 transition"
    >
      Copy address
    </button>
  );
}
