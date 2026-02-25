"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar({ userName }: { userName?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    document.cookie = "apl-token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-3">
      <Link href="/dashboard" className="text-lg font-bold text-brand-900">
        APL-platser
      </Link>
      <div className="flex items-center gap-4">
        {userName && (
          <span className="text-sm text-gray-600">{userName}</span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Logga ut
        </button>
      </div>
    </nav>
  );
}
