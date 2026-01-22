// app/lists/_components/ReviewsBlock.tsx
import Link from "next/link";

export default function ReviewsBlock({ locked }: { locked: boolean }) {
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-5">
      <div className="text-sm text-zinc-300">
        <div className="font-semibold text-white">User reviews</div>
        <p className="mt-2 text-zinc-400">
          This is where you’ll later show “most helpful” reviews, comments, and verified Pro badges.
        </p>

        {locked ? (
          <div className="mt-4 rounded-xl border border-yellow-500/25 bg-yellow-500/5 p-4">
            <div className="font-semibold text-yellow-200">Premium reviews</div>
            <p className="mt-1 text-sm text-zinc-300">
              Unlock Pro to see full notes + leave verified reviews.
            </p>
            <div className="mt-3">
              <Link
                href="/pricing"
                className="inline-flex rounded-xl border border-zinc-700 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
              >
                Unlock Pro
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800/60 bg-black/20 p-4">
              <div className="text-sm font-semibold text-white">“Saved me from rugs.”</div>
              <div className="mt-2 text-xs text-zinc-400">Verified user • 2d ago</div>
            </div>
            <div className="rounded-xl border border-zinc-800/60 bg-black/20 p-4">
              <div className="text-sm font-semibold text-white">“Best catalysts section.”</div>
              <div className="mt-2 text-xs text-zinc-400">Verified user • 1w ago</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
