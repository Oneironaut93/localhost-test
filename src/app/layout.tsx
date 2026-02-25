import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APL-platser",
  description: "Hitta APL-platser för din skola",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
