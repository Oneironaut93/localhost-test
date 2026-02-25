const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Väntar",
    className: "bg-yellow-100 text-yellow-800",
  },
  running: {
    label: "Pågår",
    className: "bg-blue-100 text-blue-800",
  },
  completed: {
    label: "Klar",
    className: "bg-green-100 text-green-800",
  },
  failed: {
    label: "Fel",
    className: "bg-red-100 text-red-800",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
