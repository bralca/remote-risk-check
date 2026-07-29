import { ProposalExperience } from "@/components/proposal-experience";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Country-Aware AI Risk Operations — a product proposal for Remote",
    headline: "Clear standard hires. Route only the exceptions.",
    description:
      "A working multi-country EOR decision center with deterministic policy, cost-aware AI routing, and bounded autonomous operations.",
    author: {
      "@type": "Person",
      name: "Alessio Carrà"
    },
    isAccessibleForFree: true
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProposalExperience />
    </>
  );
}
