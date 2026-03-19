"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { tokenCategories } from "@/features/token-docs/model/token-categories";

export const TokenLnb = () => {
  const selected = useSelectedLayoutSegment();

  return (
    <nav className="sticky top-0 h-screen w-64 shrink-0 border-r border-border bg-card p-4">
      <h2 className="mb-4 text-titleSm-SB text-foreground">Design Tokens</h2>
      <ul className="space-y-1">
        {tokenCategories.map((category) => {
          const isActive = selected === category.id;

          return (
            <li key={category.id}>
              <Link
                href={`/tokens/${category.id}`}
                className={`block rounded-radius-8 px-3 py-2 text-bodySm-M transition-colors ${
                  isActive
                    ? "bg-blue-50 text-common-100"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {category.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
