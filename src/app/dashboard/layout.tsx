import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getCurrentUser();
  let userName: string | undefined;

  if (payload) {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { name: true, email: true },
    });
    userName = user?.name || user?.email || undefined;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={userName} />
      <div className="flex">
        <aside className="hidden w-56 shrink-0 border-r bg-white p-4 md:block">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="block rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Översikt
            </Link>
            <Link
              href="/dashboard/new"
              className="block rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Nytt jobb
            </Link>
            <Link
              href="/dashboard/jobs"
              className="block rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Alla jobb
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
