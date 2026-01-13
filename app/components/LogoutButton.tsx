"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/auth/signout", {
      method: "POST",
    });

    // hard redirect (očisti state)
    window.location.href = "/";
  }

  return (
    <button
      onClick={logout}
      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold hover:bg-white/10"
    >
      Log out
    </button>
  );
}
