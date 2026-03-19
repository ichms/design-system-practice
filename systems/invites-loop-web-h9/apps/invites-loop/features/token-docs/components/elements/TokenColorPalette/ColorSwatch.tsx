import { cn } from "invites-ui";
import type { PaletteTone } from "@/features/token-docs/type";

const getTextColor = (hex: string) => {
  const normalized = hex.replace("#", "");

  if (normalized.length !== 6) {
    return "#111111";
  }

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.7 ? "#111111" : "#FFFFFF";
};

interface ColorSwatchProps {
  tone: PaletteTone;
}

export const ColorSwatch = ({ tone }: ColorSwatchProps) => {
  const foreground = getTextColor(tone.value);

  return (
    <div className="min-w-0">
      <div
        className={cn(
          "relative flex h-14 items-center justify-center rounded-radius-8 border border-black/5",
          tone.emphasized && "ring-2 ring-offset-2 ring-offset-white ring-black/10",
        )}
        style={{ backgroundColor: tone.value }}
        aria-label={`${tone.token} ${tone.value}`}
      >
        {tone.emphasized ? (
          <span
            className="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-captionLg-SB"
            style={{ backgroundColor: "rgba(255,255,255,0.18)", color: foreground }}
          >
            P
          </span>
        ) : null}
      </div>
      <div className="mt-2 text-center">
        <p className="text-captionLg-SB text-foreground">{tone.label}</p>
      </div>
    </div>
  );
};
