import type { Metadata } from "next";
import "./proposal.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Onboarding Review | Interactive Product Concept for Remote",
  description:
    "An interactive queue showing how five fictional EOR hires are checked, when AI is useful, and which decisions still require a specialist.",
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
    title: "Onboarding Review — an interactive product concept for Remote",
    description:
      "Review five fictional international hires and see the country rules, evidence, AI use and human decisions behind each result.",
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
