import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const payload = await getCurrentUser();
  if (!payload) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const job = await prisma.scrapeJob.findUnique({
    where: { id: params.id },
    include: { companies: true },
  });

  if (!job || job.userId !== payload.sub) {
    return NextResponse.json({ error: "Jobb hittades inte" }, { status: 404 });
  }

  return NextResponse.json(job);
}
