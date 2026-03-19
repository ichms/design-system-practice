import { TokenHeader } from "@/features/common/components/TokenHeader";
import { TokenColorPalette } from "@/features/token-docs/components/elements/TokenColorPalette";
import { TokenIconGallery } from "@/features/token-docs/components/elements/TokenIconGallery";
import { TokenPreviewGrid } from "@/features/common/components/TokenPreviewGrid";
import { TokenTypographyTable } from "@/features/token-docs/components/elements/TokenTypographyTable";
import { TokenValueTable } from "@/features/common/components/TokenValueTable";
import { getTokenDoc } from "@/features/token-docs/model/get-token-doc";
import type { TokenCategory } from "@/features/token-docs/type";

interface TokenDocsPageProps {
  category: TokenCategory;
}

export const TokenDocsPage = ({ category }: TokenDocsPageProps) => {
  const doc = getTokenDoc(category);

  if (!doc) {
    return null;
  }

  return (
    <div className="space-y-6">
      <TokenHeader doc={doc} />
      {doc.paletteGroups ? (
        <TokenColorPalette groups={doc.paletteGroups} />
      ) : doc.iconGroups && doc.iconSizeRows ? (
        <TokenIconGallery groups={doc.iconGroups} sizeRows={doc.iconSizeRows} />
      ) : doc.typographyRows ? (
        <TokenTypographyTable rows={doc.typographyRows} />
      ) : (
        doc.sections.map((section) => (
          <TokenPreviewGrid key={section.title} section={section} />
        ))
      )}
      <TokenValueTable sections={doc.sections} />
    </div>
  );
};
