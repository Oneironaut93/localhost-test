import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stringify } from "csv-stringify/sync";
import ExcelJS from "exceljs";

export async function GET(
  req: NextRequest,
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

  const format = req.nextUrl.searchParams.get("format") || "csv";
  const rows = job.companies.map((c) => ({
    Namn: c.name,
    Organisationsnummer: c.orgnr || "",
    Bransch: c.bransch || "",
    Ort: c.ort || "",
    Adress: c.adress || "",
    Postnummer: c.postnummer || "",
    Telefon: c.telefon || "",
    "E-post": c.epost || "",
    Webbplats: c.webbplats || "",
    "Antal anställda": c.antalAnstallda ?? "",
    "Omsättning (SEK)": c.omsattningSek?.toString() || "",
  }));

  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Företag");

    if (rows.length > 0) {
      sheet.columns = Object.keys(rows[0]).map((key) => ({
        header: key,
        key,
        width: 20,
      }));
      rows.forEach((row) => sheet.addRow(row));
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${job.kommun}_apl.xlsx"`,
      },
    });
  }

  // CSV
  const csv = stringify(rows, { header: true });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${job.kommun}_apl.csv"`,
    },
  });
}
