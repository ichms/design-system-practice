import type { TokenSection } from "@/features/token-docs/type";

interface TokenValueTableProps {
  sections: TokenSection[];
}

export const TokenValueTable = ({ sections }: TokenValueTableProps) => {
  const rows = sections.flatMap((section) =>
    section.items.map((item) => ({
      section: section.title,
      name: item.name,
      value: item.value,
      description: item.description,
      previewType: item.previewType,
      previewClassName: item.previewClassName,
      previewLabel: item.previewLabel,
    })),
  );

  return (
    <section className="rounded-radius-12 border border-border bg-card p-6">
      <h2 className="mb-4 text-titleLg-SB text-foreground">Token Values</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-bodySm-R">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-2 py-2">Section</th>
              <th className="px-2 py-2">Token</th>
              <th className="px-2 py-2">Value</th>
              <th className="px-2 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.section}-${row.name}`} className="border-b border-border/60">
                <td className="px-2 py-2 text-muted-foreground">{row.section}</td>
                <td className="px-2 py-2 font-medium text-foreground">{row.name}</td>
                <td className="px-2 py-2 text-foreground">{row.value}</td>
                <td className="px-2 py-2 text-muted-foreground">
                  {row.previewType === "color" ? (
                    <span
                      className="inline-block h-20 w-70 rounded-radius-6 border border-border align-middle"
                      style={{ backgroundColor: row.value }}
                      aria-label={`${row.name} color swatch`}
                    />
                  ) : row.previewType === "text" ? (
                    <span className={row.previewClassName ?? "text-bodySm-R text-foreground"}>
                      {row.previewLabel ?? row.name}
                    </span>
                  ) : row.previewType === "radius" ? (
                    <div
                      className={`flex h-24 w-40 items-end border border-border bg-blueGrey-99 p-3 align-middle ${row.previewClassName ?? ""}`}
                      aria-label={`${row.name} radius preview`}
                    />
                  ) : (
                    row.description
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
