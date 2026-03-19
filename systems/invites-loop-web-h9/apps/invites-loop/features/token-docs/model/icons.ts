import {
  Cancel,
  CheckContained,
  CheckVerified,
  InformationCircle,
  Like,
  Menu,
  Share,
  type IconSize,
} from "invites-ui";
import type { IconGroup, IconSizeRow, TokenSection } from "@/features/token-docs/type";
import { TOKEN_PREVIEW_TYPES } from "@/features/token-docs/type";

export const iconSizeRows: IconSizeRow[] = [
  { label: "xSmall", size: "xSmall", pixelSize: 12, usage: "보조 정보, 아주 작은 컨트롤" },
  { label: "Small", size: "small", pixelSize: 16, usage: "기본 리스트, 보조 액션" },
  { label: "sMedium", size: "sMedium", pixelSize: 20, usage: "입력 필드, 서브 액션" },
  { label: "Medium", size: "medium", pixelSize: 24, usage: "기본 아이콘 크기" },
  { label: "Large", size: "large", pixelSize: 32, usage: "강조 아이콘, 카드 UI" },
  { label: "xLarge", size: "xLarge", pixelSize: 40, usage: "대표 아이콘, 섹션 헤더" },
  { label: "2xLarge", size: "2xLarge", pixelSize: 48, usage: "상태 강조, 빈 상태" },
  { label: "3xLarge", size: "3xLarge", pixelSize: 56, usage: "주요 메시지 영역" },
  { label: "6xLarge", size: "6xLarge", pixelSize: 80, usage: "브랜딩/가이드 대표 예시" },
];

export const iconGroups: IconGroup[] = [
  {
    title: "General",
    items: [
      { name: "information-circle", token: "InformationCircle", component: InformationCircle },
      { name: "check-verified", token: "CheckVerified", component: CheckVerified },
      { name: "menu", token: "Menu", component: Menu },
      { name: "cancel", token: "Cancel", component: Cancel },
      { name: "check-contained", token: "CheckContained", component: CheckContained },
      { name: "like", token: "Like", component: Like },
      { name: "share", token: "Share", component: Share },
    ],
  },
];

const iconValue = (size: IconSize) => `size="${size}"`;

export const iconSections: TokenSection[] = iconGroups.map((group) => ({
  title: group.title,
  description: "공용 아이콘 컴포넌트 목록입니다.",
  items: group.items.map((item) => ({
    name: item.token,
    value: iconValue("medium"),
    description: item.name,
    previewType: TOKEN_PREVIEW_TYPES.TEXT,
    previewLabel: item.name,
  })),
}));
