import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const payload = await getCurrentUser();
  if (!payload) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, schoolName: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Användare hittades inte" }, { status: 404 });
  }

  return NextResponse.json(user);
}
