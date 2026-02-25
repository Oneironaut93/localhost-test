"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { YRKESOMRADEN } from "@/lib/sni-mappings";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const kommun = form.get("kommun") as string;
    const yrkesomraden = form.getAll("yrkesomraden") as string[];

    if (!kommun.trim()) {
      setError("Ange en kommun");
      setLoading(false);
      return;
    }
    if (yrkesomraden.length === 0) {
      setError("Välj minst ett yrkesområde");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kommun: kommun.trim(), yrkesomraden }),
    });

    if (res.ok) {
      const job = await res.json();
      router.push(`/dashboard/jobs/${job.id}`);
    } else {
      const data = await res.json();
      setError(data.error || "Kunde inte skapa jobb");
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Nytt skrapningsjobb
      </h1>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="kommun" className="mb-1 block text-sm font-medium">
            Kommun
          </label>
          <input
            id="kommun"
            name="kommun"
            type="text"
            placeholder="t.ex. Malmö"
            required
            className="w-full rounded border px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Yrkesområden</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {YRKESOMRADEN.map((y) => (
              <label
                key={y.id}
                className="flex items-start gap-2 rounded border p-3 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  name="yrkesomraden"
                  value={y.namn}
                  className="mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium">{y.namn}</span>
                  <span className="block text-xs text-gray-500">
                    {y.beskrivning}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-brand-600 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Skapar jobb..." : "Starta skrapning"}
        </button>
      </form>
    </div>
  );
}
