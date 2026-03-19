import { TYPOGRAPHY_WEIGHTS, type TypographyRow } from "@/features/token-docs/type";

interface TokenTypographyTableProps {
  rows: TypographyRow[];
}

const typographyColumns = [
  { label: "Regular", weight: TYPOGRAPHY_WEIGHTS.REGULAR },
  { label: "Medium", weight: TYPOGRAPHY_WEIGHTS.MEDIUM },
  { label: "SemiBold", weight: TYPOGRAPHY_WEIGHTS.SEMIBOLD },
  { label: "Bold", weight: TYPOGRAPHY_WEIGHTS.BOLD },
] as const;

export const TokenTypographyTable = ({ rows }: TokenTypographyTableProps) => {
  return (
    <section className="overflow-hidden rounded-radius-12 border border-border bg-card">
      <div className="border-b border-border bg-coolNeutral-99 px-6 py-6">
        <p className="text-captionLg-SB text-muted-foreground">Pretendard</p>
        <div className="mt-4 flex h-22 w-22 items-center justify-center rounded-radius-12 bg-background text-[56px] font-semibold leading-none text-foreground">
          Aa
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-260">
          <div className="grid grid-cols-[220px_repeat(4,minmax(0,1fr))] border-b border-border bg-coolNeutral-99/60 px-6 py-3 text-captionLg-SB text-muted-foreground">
            <div>Spec</div>
            {typographyColumns.map((column) => (
              <div key={column.weight}>{column.label}</div>
            ))}
          </div>

          {rows.map((row) => (
            <div
              key={row.title}
              className="grid grid-cols-[220px_repeat(4,minmax(0,1fr))] gap-x-6 border-b border-border px-6 py-5 last:border-b-0"
            >
              <div className="space-y-1">
                <p className="text-bodySm-SB text-foreground">{row.title}</p>
                <p className="text-captionLg-R text-muted-foreground">
                  Font size: {row.size}px | Line height: {row.lineHeight}px | Tracking:{" "}
                  {row.tracking}
                </p>
              </div>

              {typographyColumns.map((column) => {
                const variant = row.variants.find((item) => item.weight === column.weight);

                if (!variant) {
                  return <div key={column.weight} />;
                }

                return (
                  <div key={variant.token} className="min-w-0">
                    <p className={`${variant.className} wrap-break-word text-foreground`}>
                      {variant.label}
                    </p>
                    <p className="mt-2 text-captionLg-R text-muted-foreground">{variant.token}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
