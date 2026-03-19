import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "인바이츠루프 2.0",
  description: "호호호하하하",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
