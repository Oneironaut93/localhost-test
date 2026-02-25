import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";

export default async function DashboardPage() {
  const payload = await getCurrentUser();
  if (!payload) return null;

  const [totalJobs, recentJobs] = await Promise.all([
    prisma.scrapeJob.count({ where: { userId: payload.sub } }),
    prisma.scrapeJob.findMany({
      where: { userId: payload.sub },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        kommun: true,
        status: true,
        totalCompanies: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Översikt</h1>
        <Link
          href="/dashboard/new"
          className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Nytt jobb
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Totalt antal jobb</p>
          <p className="mt-1 text-3xl font-bold text-brand-900">{totalJobs}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-3">
          <h2 className="font-semibold text-gray-900">Senaste jobb</h2>
        </div>
        {recentJobs.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">
            Inga jobb ännu.{" "}
            <Link href="/dashboard/new" className="text-brand-600 hover:underline">
              Skapa ditt första jobb
            </Link>
          </p>
        ) : (
          <ul className="divide-y">
            {recentJobs.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/dashboard/jobs/${job.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{job.kommun}</p>
                    <p className="text-xs text-gray-500">
                      {job.createdAt.toLocaleDateString("sv-SE")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {job.totalCompanies} företag
                    </span>
                    <StatusBadge status={job.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
