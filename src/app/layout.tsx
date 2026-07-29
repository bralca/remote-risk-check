import type { Metadata } from "next";
import "./proposal.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Employer Eligibility — Product Proposal for Remote | Alessio Carrà",
  description:
    "A working product proposal for Remote: deterministic employer-eligibility policy, AI evidence summaries, and human-approved decisions.",
  keywords: [
    "Senior Product Manager",
    "Remote",
    "fraud and compliance",
    "AI",
    "credit risk",
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
    title: "Employer Eligibility — a product proposal for Remote",
    description:
      "Rules decide. AI explains. People approve. A working product proposal by Alessio Carrà.",
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
