import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // Verify webhook secret
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await req.json();
    const { job_id, status, companies, error_message } = body;

    if (!job_id) {
      return NextResponse.json(
        { error: "job_id krävs" },
        { status: 400 }
      );
    }

    const job = await prisma.scrapeJob.findUnique({ where: { id: job_id } });
    if (!job) {
      return NextResponse.json(
        { error: "Jobb hittades inte" },
        { status: 404 }
      );
    }

    // Upsert companies and connect to job
    if (companies && Array.isArray(companies)) {
      for (const c of companies) {
        const company = await prisma.company.upsert({
          where: { orgnr: c.orgnr || `no-orgnr-${Date.now()}-${Math.random()}` },
          update: {
            name: c.name,
            bransch: c.bransch,
            sniCodes: c.sni_codes,
            yrkesomraden: c.yrkesomraden,
            ort: c.ort,
            adress: c.adress,
            postnummer: c.postnummer,
            telefon: c.telefon,
            epost: c.epost,
            webbplats: c.webbplats,
            antalAnstallda: c.antal_anstallda
              ? parseInt(c.antal_anstallda)
              : null,
            omsattningSek: c.omsattning_sek
              ? BigInt(c.omsattning_sek)
              : null,
          },
          create: {
            orgnr: c.orgnr || null,
            name: c.name,
            bransch: c.bransch,
            sniCodes: c.sni_codes,
            yrkesomraden: c.yrkesomraden,
            ort: c.ort,
            adress: c.adress,
            postnummer: c.postnummer,
            telefon: c.telefon,
            epost: c.epost,
            webbplats: c.webbplats,
            antalAnstallda: c.antal_anstallda
              ? parseInt(c.antal_anstallda)
              : null,
            omsattningSek: c.omsattning_sek
              ? BigInt(c.omsattning_sek)
              : null,
          },
        });

        await prisma.scrapeJob.update({
          where: { id: job_id },
          data: {
            companies: { connect: { id: company.id } },
          },
        });
      }
    }

    // Update job status
    await prisma.scrapeJob.update({
      where: { id: job_id },
      data: {
        status: status || "completed",
        totalCompanies: companies?.length || 0,
        progressPct: 100,
        errorMessage: error_message || null,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
