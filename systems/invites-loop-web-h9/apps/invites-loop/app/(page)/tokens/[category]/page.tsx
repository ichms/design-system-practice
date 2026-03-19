import { notFound } from "next/navigation";
import { TokenDocsPage } from "@/features/token-docs/components/Page";
import { isTokenCategory } from "@/features/token-docs/model/token-categories";

interface TokenCategoryPageProps {
  params: Promise<{ category: string }>;
}

const TokenCategoryPage = async ({ params }: TokenCategoryPageProps) => {
  const resolvedParams = await params;

  if (!isTokenCategory(resolvedParams.category)) {
    notFound();
  }

  return <TokenDocsPage category={resolvedParams.category} />;
};

export default TokenCategoryPage;
