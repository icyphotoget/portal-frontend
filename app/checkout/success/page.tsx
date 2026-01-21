export default function SuccessPage({ searchParams }: { searchParams?: { order?: string } }) {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-black">Payment received ✅</h1>
        <p className="mt-3 text-white/70">
          If your payment is confirmed, Pro unlock happens automatically (sometimes takes a minute).
        </p>
        {searchParams?.order ? (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            Order: <span className="font-mono">{searchParams.order}</span>
          </div>
        ) : null}
      </div>
    </main>
  );
}
