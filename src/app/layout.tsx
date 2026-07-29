import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Should Remote let this company hire? | Alessio Carrà",
  description:
    "An AI-assisted EOR risk check for Remote's Senior Product Manager, Fraud and Compliance role—covering KYB, credit risk, reserve management, false positives, APIs, and human-approved decisions.",
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
    title: "Should Remote let this company hire?",
    description:
      "A 60-second, AI-assisted EOR risk product exploration by Alessio Carrà.",
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
