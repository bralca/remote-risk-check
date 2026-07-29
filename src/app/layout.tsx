import type { Metadata } from "next";
import "./proposal.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Country-Aware AI Risk Operations | Product Proposal for Remote",
  description:
    "A working multi-country EOR decision center with deterministic policy, cost-aware AI routing, and bounded autonomous operations.",
  keywords: [
    "Senior Product Manager",
    "Remote",
    "fraud and compliance",
    "AI",
    "credit risk",
    "country-aware onboarding",
    "AI model routing",
    "reserve management",
    "KYB",
    "compliance automation",
    "operational tooling",
    "API",
    "false positives"
  ],
  authors: [{ name: "Alessio Carrà" }],
  creator: "Alessio Carrà",
  icons: {
    icon: `${basePath}/favicon.svg`
  },
  openGraph: {
    title: "Country-Aware AI Risk Operations — a product proposal for Remote",
    description:
      "Clear standard hires. Route only the exceptions. A working product proposal by Alessio Carrà.",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
