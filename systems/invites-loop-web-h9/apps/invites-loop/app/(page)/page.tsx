import { redirect } from "next/navigation";
import { defaultTokenCategory } from "@/features/token-docs/model/token-categories";

const TokensEntryPage = () => {
  redirect(`/tokens/${defaultTokenCategory}`);
};

export default TokensEntryPage;
