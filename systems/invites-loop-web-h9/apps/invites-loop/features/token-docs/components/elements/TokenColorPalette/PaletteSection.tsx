import { PaletteRow } from "@/features/token-docs/components/elements/TokenColorPalette/PaletteRow";
import type { PaletteGroup } from "@/features/token-docs/type";

interface PaletteSectionProps {
  group: PaletteGroup;
}

export const PaletteSection = ({ group }: PaletteSectionProps) => {
  return (
    <section className="space-y-4 rounded-radius-12 border border-border bg-card p-6">
      <div>
        <h2 className="text-titleLg-SB text-foreground">{group.title}</h2>
        {group.description ? (
          <p className="mt-1 text-bodySm-R text-muted-foreground">{group.description}</p>
        ) : null}
      </div>
      <PaletteRow tones={group.tones} />
    </section>
  );
};
