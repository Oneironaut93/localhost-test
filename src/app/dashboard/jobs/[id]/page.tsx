import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import CompanyTable from "@/components/CompanyTable";
import Link from "next/link";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const payload = await getCurrentUser();
  if (!payload) return null;

  const job = await prisma.scrapeJob.findUnique({
    where: { id: params.id },
    include: { companies: true },
  });

  if (!job || job.userId !== payload.sub) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/dashboard/jobs"
        className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; Tillbaka till alla jobb
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.kommun}</h1>
          <p className="text-sm text-gray-500">
            {job.yrkesomraden.join(", ")}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Status</p>
          <p className="mt-1 font-medium">{job.status}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Framsteg</p>
          <p className="mt-1 font-medium">{job.progressPct}%</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Företag</p>
          <p className="mt-1 font-medium">{job.totalCompanies}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Skapad</p>
          <p className="mt-1 font-medium">
            {job.createdAt.toLocaleDateString("sv-SE")}
          </p>
        </div>
      </div>

      {job.errorMessage && (
        <div className="mb-6 rounded bg-red-50 p-4 text-sm text-red-700">
          {job.errorMessage}
        </div>
      )}

      {job.progressMessage && (
        <p className="mb-4 text-sm text-gray-600">{job.progressMessage}</p>
      )}

      {job.status === "completed" && job.companies.length > 0 && (
        <div className="mb-4 flex gap-2">
          <a
            href={`/api/jobs/${job.id}/download?format=csv`}
            className="rounded border border-brand-600 px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50"
          >
            Ladda ner CSV
          </a>
          <a
            href={`/api/jobs/${job.id}/download?format=xlsx`}
            className="rounded border border-brand-600 px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50"
          >
            Ladda ner Excel
          </a>
        </div>
      )}

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Företag</h2>
        <CompanyTable companies={job.companies} />
      </div>
    </div>
  );
}
