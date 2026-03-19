import type { TokenSection } from "@/features/token-docs/type";

interface TokenPreviewGridProps {
  section: TokenSection;
}

export const TokenPreviewGrid = ({ section }: TokenPreviewGridProps) => {
  return (
    <section className="space-y-4 rounded-radius-12 border border-border bg-card p-6">
      <div>
        <h2 className="text-titleLg-SB text-foreground">{section.title}</h2>
        {section.description ? (
          <p className="mt-1 text-bodySm-R text-muted-foreground">{section.description}</p>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {section.items.map((item) => {
          return (
            <article key={item.name} className="rounded-radius-8 border border-border p-4">
              <p className="text-captionLg-SB text-muted-foreground">{item.name}</p>
              <p className="mt-1 text-bodySm-M text-foreground">{item.description}</p>

              <div className="mt-4">
                {item.previewType === "text" ? (
                  <p className={item.previewClassName}>{item.previewLabel ?? item.name}</p>
                ) : null}

                {item.previewType === "color" ? (
                  <div
                    className={`h-14 w-full border border-border ${item.previewClassName ?? ""}`}
                    aria-label={`${item.name} color preview`}
                  />
                ) : null}

                {item.previewType === "radius" ? (
                  <div
                    className={`h-14 w-full border border-border bg-blueGrey-99 ${item.previewClassName ?? ""}`}
                    aria-label={`${item.name} radius preview`}
                  />
                ) : null}
              </div>

              <p className="mt-3 text-captionLg-R text-muted-foreground">Value: {item.value}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};
