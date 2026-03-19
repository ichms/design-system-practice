import Link from "next/link";
import { defaultTokenCategory } from "@/features/token-docs/model/token-categories";

const TokenCategoryNotFound = () => {
  return (
    <div className="rounded-radius-12 border border-border bg-card p-8">
      <h1 className="text-titleLg-SB text-foreground">Token Category Not Found</h1>
      <p className="mt-2 text-bodySm-R text-muted-foreground">
        요청한 토큰 카테고리가 없습니다. 기본 토큰 페이지로 이동해 주세요.
      </p>
      <Link
        href={`/tokens/${defaultTokenCategory}`}
        className="mt-4 inline-block rounded-radius-8 bg-blue-50 px-4 py-2 text-bodySm-SB text-common-100"
      >
        Go Tokens
      </Link>
    </div>
  );
};

export default TokenCategoryNotFound;
