import type { TokenCategory } from "@/features/token-docs/model/token-categories";

export type { TokenCategory };

export const TOKEN_PREVIEW_TYPES = {
  TEXT: "text",
  COLOR: "color",
  RADIUS: "radius",
} as const;

export type TokenPreviewType =
  (typeof TOKEN_PREVIEW_TYPES)[keyof typeof TOKEN_PREVIEW_TYPES];

export type TokenItem = {
  name: string;
  value: string;
  description: string;
  previewType: TokenPreviewType;
  previewClassName?: string;
  previewLabel?: string;
};

export type TokenSection = {
  title: string;
  description?: string;
  items: TokenItem[];
};

export type TokenDoc = {
  category: TokenCategory;
  title: string;
  description: string;
  sections: TokenSection[];
  paletteGroups?: PaletteGroup[];
  typographyRows?: TypographyRow[];
  iconGroups?: IconGroup[];
  iconSizeRows?: IconSizeRow[];
};

export type PaletteTone = {
  label: string;
  token: string;
  value: string;
  emphasized?: boolean;
};

export type PaletteGroup = {
  title: string;
  description?: string;
  tones: PaletteTone[];
};

export const TYPOGRAPHY_WEIGHTS = {
  REGULAR: "R",
  MEDIUM: "M",
  SEMIBOLD: "SB",
  BOLD: "B",
} as const;

export type TypographyWeight =
  (typeof TYPOGRAPHY_WEIGHTS)[keyof typeof TYPOGRAPHY_WEIGHTS];

export type TypographyVariant = {
  token: string;
  label: string;
  className: string;
  weight: TypographyWeight;
};

export type TypographyRow = {
  title: string;
  size: number;
  lineHeight: number;
  tracking: string;
  variants: TypographyVariant[];
};

export type IconComponent = (props: {
  size?: import("invites-ui").IconSize;
  className?: string;
}) => React.JSX.Element;

export type IconItem = {
  name: string;
  token: string;
  component: IconComponent;
};

export type IconGroup = {
  title: string;
  items: IconItem[];
};

export type IconSizeRow = {
  label: string;
  size: import("invites-ui").IconSize;
  pixelSize: number;
  usage: string;
};
