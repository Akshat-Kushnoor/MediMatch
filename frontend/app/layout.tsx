import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediMatch - Blood Donation System",
  description: "Connect donors with recipients through intelligent matching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}