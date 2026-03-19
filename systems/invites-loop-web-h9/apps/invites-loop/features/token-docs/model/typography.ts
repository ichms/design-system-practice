import {
  TOKEN_PREVIEW_TYPES,
  TYPOGRAPHY_WEIGHTS,
  type TokenSection,
  type TypographyRow,
} from "@/features/token-docs/type";

const typographyRowsSource = [
  { title: "Display XL", size: 76, lineHeight: 94, tracking: "-2%", key: "displayXL" },
  { title: "Display Sm", size: 48, lineHeight: 58, tracking: "-2%", key: "displaySm" },
  { title: "Headline XL", size: 40, lineHeight: 48, tracking: "-1%", key: "headlineXL" },
  { title: "Headline Lg", size: 32, lineHeight: 40, tracking: "-1%", key: "headlineLg" },
  { title: "Headline Md", size: 26, lineHeight: 34, tracking: "-1%", key: "headlineMd" },
  { title: "Headline Sm", size: 24, lineHeight: 32, tracking: "-1%", key: "headlineSm" },
  { title: "Title Lg", size: 22, lineHeight: 30, tracking: "0%", key: "titleLg" },
  { title: "Title Md", size: 20, lineHeight: 28, tracking: "0%", key: "titleMd" },
  { title: "Title Sm", size: 18, lineHeight: 26, tracking: "0%", key: "titleSm" },
  { title: "Body Lg", size: 16, lineHeight: 24, tracking: "0%", key: "bodyLg" },
  { title: "Body Md", size: 15, lineHeight: 20, tracking: "0%", key: "bodyMd" },
  { title: "Body Sm", size: 14, lineHeight: 20, tracking: "0%", key: "bodySm" },
  { title: "Caption Lg", size: 12, lineHeight: 18, tracking: "0%", key: "captionLg" },
  { title: "Caption Md", size: 11, lineHeight: 14, tracking: "0%", key: "captionMd" },
] as const;

const weightMeta = [
  { label: TYPOGRAPHY_WEIGHTS.REGULAR, weight: TYPOGRAPHY_WEIGHTS.REGULAR },
  { label: TYPOGRAPHY_WEIGHTS.MEDIUM, weight: TYPOGRAPHY_WEIGHTS.MEDIUM },
  { label: TYPOGRAPHY_WEIGHTS.SEMIBOLD, weight: TYPOGRAPHY_WEIGHTS.SEMIBOLD },
  { label: TYPOGRAPHY_WEIGHTS.BOLD, weight: TYPOGRAPHY_WEIGHTS.BOLD },
] as const;

export const typographyRows: TypographyRow[] = typographyRowsSource.map((row) => ({
  title: row.title,
  size: row.size,
  lineHeight: row.lineHeight,
  tracking: row.tracking,
  variants: weightMeta.map((weight) => ({
    token: `text-${row.key}-${weight.weight}`,
    label: `${row.title}/${weight.label} ${row.size}px`,
    className: `text-${row.key}-${weight.weight}`,
    weight: weight.weight,
  })),
}));

export const typographySections: TokenSection[] = typographyRows.map((row) => ({
  title: row.title,
  description: `Font size: ${row.size}px | Line height: ${row.lineHeight}px | Tracking: ${row.tracking}`,
  items: row.variants.map((variant) => ({
    name: variant.token,
    value: `${row.size}px / ${row.lineHeight}px / ${variant.weight}`,
    description: `${row.title} ${variant.weight}`,
    previewType: TOKEN_PREVIEW_TYPES.TEXT,
    previewClassName: variant.className,
    previewLabel: variant.label,
  })),
}));
