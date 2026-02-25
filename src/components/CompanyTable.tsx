interface Company {
  id: string;
  name: string;
  orgnr?: string | null;
  bransch?: string | null;
  ort?: string | null;
  telefon?: string | null;
  epost?: string | null;
  webbplats?: string | null;
  antalAnstallda?: number | null;
}

export default function CompanyTable({
  companies,
}: {
  companies: Company[];
}) {
  if (companies.length === 0) {
    return <p className="text-sm text-gray-500">Inga företag hittade.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Företag
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Org.nr
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Bransch
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Ort
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Telefon
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              E-post
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Anställda
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {companies.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium">
                {c.webbplats ? (
                  <a
                    href={c.webbplats}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:underline"
                  >
                    {c.name}
                  </a>
                ) : (
                  c.name
                )}
              </td>
              <td className="px-4 py-2 text-gray-600">{c.orgnr || "–"}</td>
              <td className="px-4 py-2 text-gray-600">{c.bransch || "–"}</td>
              <td className="px-4 py-2 text-gray-600">{c.ort || "–"}</td>
              <td className="px-4 py-2 text-gray-600">{c.telefon || "–"}</td>
              <td className="px-4 py-2 text-gray-600">
                {c.epost ? (
                  <a
                    href={`mailto:${c.epost}`}
                    className="text-brand-600 hover:underline"
                  >
                    {c.epost}
                  </a>
                ) : (
                  "–"
                )}
              </td>
              <td className="px-4 py-2 text-gray-600">
                {c.antalAnstallda ?? "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
