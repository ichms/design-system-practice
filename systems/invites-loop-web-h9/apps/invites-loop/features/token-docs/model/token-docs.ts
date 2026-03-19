import type { TokenCategory } from "@/features/token-docs/model/token-categories";
import { iconGroups, iconSections, iconSizeRows } from "@/features/token-docs/model/icons";
import { paletteGroups, paletteSections } from "@/features/token-docs/model/color-palette";
import { typographyRows, typographySections } from "@/features/token-docs/model/typography";
import { TOKEN_PREVIEW_TYPES, type TokenDoc } from "@/features/token-docs/type";

export const tokenDocs: Record<TokenCategory, TokenDoc> = {
  typography: {
    category: "typography",
    title: "Typography",
    description: "프로덕트 전반에서 일관된 타이포 체계를 유지하기 위한 토큰입니다.",
    sections: typographySections,
    typographyRows,
  },
  palette: {
    category: "palette",
    title: "Palette",
    description: "의미 기반(semantic)과 기본 색상 스케일(color scale)을 함께 제공합니다.",
    sections: paletteSections,
    paletteGroups,
  },
  icons: {
    category: "icons",
    title: "Icons",
    description: "공용 아이콘 컴포넌트와 사이즈 규칙을 문서화합니다.",
    sections: iconSections,
    iconGroups,
    iconSizeRows,
  },
  radius: {
    category: "radius",
    title: "Radius",
    description: "컴포넌트 모서리의 일관된 곡률을 위한 반경 토큰입니다.",
    sections: [
      {
        title: "Core Radius",
        description: "Border radius 토큰 전체 스케일입니다.",
        items: [
          {
            name: "rounded-radius",
            value: "0px",
            description: "직각 모서리",
            previewType: TOKEN_PREVIEW_TYPES.RADIUS,
            previewClassName: "rounded-radius",
          },
          {
            name: "rounded-radius-2",
            value: "2px",
            description: "아주 미세한 반경",
            previewType: TOKEN_PREVIEW_TYPES.RADIUS,
            previewClassName: "rounded-radius-2",
          },
          {
            name: "rounded-radius-4",
            value: "4px",
            description: "작은 입력 요소",
            previewType: TOKEN_PREVIEW_TYPES.RADIUS,
            previewClassName: "rounded-radius-4",
          },
          {
            name: "rounded-radius-6",
            value: "6px",
            description: "작은 카드/보조 컨트롤",
            previewType: TOKEN_PREVIEW_TYPES.RADIUS,
            previewClassName: "rounded-radius-6",
          },
          {
            name: "rounded-radius-8",
            value: "8px",
            description: "기본 카드/버튼",
            previewType: TOKEN_PREVIEW_TYPES.RADIUS,
            previewClassName: "rounded-radius-8",
          },
          {
            name: "rounded-radius-12",
            value: "12px",
            description: "중간 크기 패널",
            previewType: TOKEN_PREVIEW_TYPES.RADIUS,
            previewClassName: "rounded-radius-12",
          },
          {
            name: "rounded-radius-16",
            value: "16px",
            description: "강한 시각 분리 영역",
            previewType: TOKEN_PREVIEW_TYPES.RADIUS,
            previewClassName: "rounded-radius-16",
          },
          {
            name: "rounded-radius-20",
            value: "20px",
            description: "대형 카드/모달",
            previewType: TOKEN_PREVIEW_TYPES.RADIUS,
            previewClassName: "rounded-radius-20",
          },
          {
            name: "rounded-radius-24",
            value: "24px",
            description: "대형 시각 요소",
            previewType: TOKEN_PREVIEW_TYPES.RADIUS,
            previewClassName: "rounded-radius-24",
          },
          {
            name: "rounded-radius-1000",
            value: "1000px",
            description: "pill / fully rounded",
            previewType: TOKEN_PREVIEW_TYPES.RADIUS,
            previewClassName: "rounded-radius-1000",
          },
        ],
      },
    ],
  },
};
