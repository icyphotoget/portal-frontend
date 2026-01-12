export const dynamic = "force-dynamic";

import BookmarksClient from "./BookmarksClient";

export default function BookmarksPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <BookmarksClient />
      </div>
    </main>
  );
}
