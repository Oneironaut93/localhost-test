import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";

export default async function JobsListPage() {
  const payload = await getCurrentUser();
  if (!payload) return null;

  const jobs = await prisma.scrapeJob.findMany({
    where: { userId: payload.sub },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      kommun: true,
      yrkesomraden: true,
      status: true,
      totalCompanies: true,
      progressPct: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Alla jobb</h1>
        <Link
          href="/dashboard/new"
          className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Nytt jobb
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500">
          Inga jobb ännu.{" "}
          <Link href="/dashboard/new" className="text-brand-600 hover:underline">
            Skapa ditt första jobb
          </Link>
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Kommun
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Yrkesområden
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Företag
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Skapad
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="font-medium text-brand-600 hover:underline"
                    >
                      {job.kommun}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {job.yrkesomraden.join(", ")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {job.totalCompanies}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {job.createdAt.toLocaleDateString("sv-SE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
