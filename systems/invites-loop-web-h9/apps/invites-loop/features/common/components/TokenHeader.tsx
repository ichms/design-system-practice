import type { TokenDoc } from "@/features/token-docs/type";

interface TokenHeaderProps {
  doc: TokenDoc;
}

export const TokenHeader = ({ doc }: TokenHeaderProps) => {
  return (
    <header className="space-y-2">
      <p className="text-captionLg-SB text-blue-50">{doc.category.toUpperCase()}</p>
      <h1 className="text-headlineLg-SB text-foreground">{doc.title}</h1>
      <p className="text-bodyLg-R text-muted-foreground">{doc.description}</p>
    </header>
  );
};
