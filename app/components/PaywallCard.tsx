// app/components/PaywallCard.tsx
import Link from "next/link";

export default function PaywallCard(props: {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  showLoginHint?: boolean;
}) {
  const {
    title = "Premium list",
    subtitle = "Unlock curated picks, deeper notes and early calls.",
    ctaLabel = "See pricing",
    ctaHref = "/pricing",
    showLoginHint = true,
  } = props;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
      <div className="text-2xl font-bold text-white">{title}</div>
      <div className="mt-2 text-zinc-300">{subtitle}</div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={ctaHref}
          className="rounded-xl border border-zinc-700 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
        >
          {ctaLabel}
        </Link>

        {showLoginHint ? (
          <div className="flex items-center text-sm text-zinc-400">
            Already a member?{" "}
            <Link className="ml-2 text-zinc-200 underline" href="/signin">
              Sign in
            </Link>
          </div>
        ) : null}
      </div>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-black/20 p-4 text-sm text-zinc-300">
        <ul className="list-disc pl-5 space-y-1">
          <li>Premium curated lists (weekly updates)</li>
          <li>Rank + notes + why it’s here</li>
          <li>Early watchlists by launchpad/meta</li>
        </ul>
      </div>
    </div>
  );
}
