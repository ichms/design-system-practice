import { PaletteSection } from "@/features/token-docs/components/elements/TokenColorPalette/PaletteSection";
import type { PaletteGroup } from "@/features/token-docs/type";

interface TokenColorPaletteProps {
  groups: PaletteGroup[];
}

export const TokenColorPalette = ({ groups }: TokenColorPaletteProps) => {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <PaletteSection key={group.title} group={group} />
      ))}
    </div>
  );
};
