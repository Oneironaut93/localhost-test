import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  try {
    const { kommun, yrkesomraden } = await req.json();

    if (!kommun || !yrkesomraden?.length) {
      return NextResponse.json(
        { error: "Kommun och yrkesområden krävs" },
        { status: 400 }
      );
    }

    const job = await prisma.scrapeJob.create({
      data: {
        userId: payload.sub,
        kommun,
        yrkesomraden,
        status: "pending",
      },
    });

    // Trigger n8n webhook
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      const callbackUrl = `${req.nextUrl.origin}/api/webhook/job-complete`;
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.N8N_WEBHOOK_SECRET
              ? { "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET }
              : {}),
          },
          body: JSON.stringify({
            job_id: job.id,
            kommun: job.kommun,
            yrkesomraden: job.yrkesomraden,
            callback_url: callbackUrl,
          }),
        });
      } catch (err) {
        console.error("Failed to trigger n8n webhook:", err);
      }
    }

    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    console.error("Create job error:", err);
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}

export async function GET() {
  const payload = await getCurrentUser();
  if (!payload) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const jobs = await prisma.scrapeJob.findMany({
    where: { userId: payload.sub },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}
