import { InformationCircle } from "invites-ui";
import type { IconGroup, IconSizeRow } from "@/features/token-docs/type";

interface TokenIconGalleryProps {
  groups: IconGroup[];
  sizeRows: IconSizeRow[];
}

export const TokenIconGallery = ({ groups, sizeRows }: TokenIconGalleryProps) => {
  return (
    <div className="grid gap-6">
      <div className="w-full space-y-6">
        <section className="rounded-radius-12 border border-border bg-card p-8">
          <h2 className="text-displaySm-B text-foreground">Icons</h2>
          <p className="mt-4 text-bodySm-R text-muted-foreground">
            아이콘 Stroke Line Weight 1.5px
          </p>
          <p className="text-bodySm-R text-muted-foreground">
            아이콘 Flatten 적용, size 토큰으로 일관된 크기 사용
          </p>
        </section>

        <section className="rounded-radius-12 border border-border bg-card p-6">
          <h2 className="text-titleLg-SB text-foreground">Sizes</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-bodySm-R">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-2 py-3">Token</th>
                  <th className="px-2 py-3">Pixel</th>
                  <th className="px-2 py-3">Preview</th>
                  <th className="px-2 py-3">Usage</th>
                </tr>
              </thead>
              <tbody>
                {sizeRows.map((row) => (
                  <tr key={row.size} className="border-b border-border/60 last:border-b-0">
                    <td className="px-2 py-3 font-medium text-foreground">{row.size}</td>
                    <td className="px-2 py-3 text-foreground">{row.pixelSize}px</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-center rounded-radius-8 border border-dashed border-blue-80/60 bg-background">
                        <InformationCircle size={row.size} className="text-foreground" />
                      </div>
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">{row.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {groups.map((group) => (
          <section key={group.title} className="rounded-radius-12 border border-border bg-card p-8">
            <h3 className="text-headlineSm-SB text-foreground">{group.title}</h3>
            <div className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
              {group.items.map((item) => {
                const Icon = item.component;

                return (
                  <div key={item.token} className="flex items-center gap-3">
                    <Icon size="medium" className="shrink-0 text-foreground" />
                    <span className="text-titleSm-M text-foreground">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
