import type { ReactNode } from "react";
import { TokenLnb } from "@/features/common/components/TokenLnb";

interface TokensLayoutProps {
  children: ReactNode;
}

const TokensLayout = ({ children }: TokensLayoutProps) => {
  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <TokenLnb />
      <section className="w-full p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </section>
    </main>
  );
};

export default TokensLayout;
