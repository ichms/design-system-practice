import { isTokenCategory } from "@/features/token-docs/model/token-categories";
import { tokenDocs } from "@/features/token-docs/model/token-docs";
import type { TokenCategory, TokenDoc } from "@/features/token-docs/type";

export const getTokenDoc = (category: string): TokenDoc | null => {
  if (!isTokenCategory(category)) {
    return null;
  }

  return tokenDocs[category as TokenCategory] ?? null;
};
