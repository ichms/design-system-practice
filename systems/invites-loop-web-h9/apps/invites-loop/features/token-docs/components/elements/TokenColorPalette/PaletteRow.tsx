import { ColorSwatch } from "@/features/token-docs/components/elements/TokenColorPalette/ColorSwatch";
import type { PaletteTone } from "@/features/token-docs/type";

interface PaletteRowProps {
  tones: PaletteTone[];
}

export const PaletteRow = ({ tones }: PaletteRowProps) => {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${tones.length}, minmax(0, 1fr))` }}
    >
      {tones.map((tone) => (
        <ColorSwatch key={tone.token} tone={tone} />
      ))}
    </div>
  );
};
